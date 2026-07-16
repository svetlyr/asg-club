import "./env-check";

import { eq } from "drizzle-orm";
import * as v from "valibot";
import { advanceOrder, notifyPaid } from "./bot";
import { products } from "./config";
import { db } from "./db";
import { orders, productIds } from "./db/schema";
import { sendOwnerEmail } from "./mail";
import { verifyWebhookSignature } from "./paypal";

const MAX_FILES = 10;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const orderSchema = v.object({
    firstName: v.pipe(v.string(), v.trim(), v.minLength(1), v.maxLength(100)),
    lastName: v.pipe(v.string(), v.trim(), v.minLength(1), v.maxLength(100)),
    email: v.pipe(v.string(), v.email(), v.maxLength(200)),
    tel: v.optional(v.pipe(v.string(), v.maxLength(40))),
    product: v.picklist(productIds),
    // * Checkbox — arrives as "on"/"true" when checked, absent otherwise
    needsDesign: v.optional(v.string()),
    description: v.pipe(v.string(), v.minLength(10), v.maxLength(5000)),
    // * Honeypot — must stay empty, bots fill it
    website: v.optional(v.string()),
});

const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
};

function json(data: unknown, status = 200): Response {
    return Response.json(data, { status, headers: CORS_HEADERS });
}

// --- rate limiting (in-memory, per IP) ---

const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT = 5;

const hits = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const entry = hits.get(ip);

    if (!entry || entry.resetAt < now) {
        hits.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
        return false;
    }

    entry.count += 1;
    return entry.count > RATE_LIMIT;
}

setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of hits) {
        if (entry.resetAt < now) hits.delete(ip);
    }
}, RATE_WINDOW_MS);

// --- handlers ---

async function handleOrder(request: Request, server: Bun.Server<unknown>): Promise<Response> {
    const ip =
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        server.requestIP(request)?.address ??
        "unknown";

    if (isRateLimited(ip)) return json({ ok: false, error: "Too many requests, try again later" }, 429);

    const formData = await request.formData().catch(() => null);
    if (!formData) return json({ ok: false, error: "Expected multipart/form-data" }, 400);

    const parsed = v.safeParse(orderSchema, {
        firstName: formData.get("firstName") ?? undefined,
        lastName: formData.get("lastName") ?? undefined,
        email: formData.get("email") ?? undefined,
        tel: formData.get("tel") ?? undefined,
        product: formData.get("product") ?? undefined,
        needsDesign: formData.get("needsDesign") ?? undefined,
        description: formData.get("description") ?? undefined,
        website: formData.get("website") ?? undefined,
    });

    if (!parsed.success) {
        const issue = parsed.issues[0];
        return json(
            { ok: false, error: `${issue.path?.map((p) => p.key).join(".") ?? "body"}: ${issue.message}` },
            422,
        );
    }

    const body = parsed.output;

    // * Honeypot filled — pretend success, drop silently
    if (body.website) return json({ ok: true });

    // * Cast: undici's FormDataEntryValue type clashes with Bun's File, runtime values are Bun Files
    const images = formData.getAll("images").filter((entry) => entry instanceof File) as unknown as File[];

    if (images.length > MAX_FILES) return json({ ok: false, error: `At most ${MAX_FILES} photos allowed` }, 422);

    for (const image of images) {
        if (!ALLOWED_TYPES.includes(image.type)) {
            return json({ ok: false, error: "Only JPG, PNG and WEBP images are allowed" }, 422);
        }
        if (image.size > MAX_FILE_SIZE) return json({ ok: false, error: "Each photo must be under 10 MB" }, 422);
    }

    const manual = products[body.product].kind === "manual";
    const needsDesign = body.needsDesign === "on" || body.needsDesign === "true";

    const [row] = await db
        .insert(orders)
        .values({
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
            tel: body.tel || null,
            product: body.product,
            needsDesign,
            description: body.description,
            status: manual ? "manual" : "new",
        })
        .returning({ orderId: orders.id });

    const orderId = row!.orderId;

    // * Email failure must not block the pricing pipeline
    try {
        await sendOwnerEmail(
            {
                id: orderId,
                firstName: body.firstName,
                lastName: body.lastName,
                email: body.email,
                tel: body.tel ?? null,
                product: body.product,
                needsDesign,
                description: body.description,
            },
            images,
        );
    } catch (error) {
        console.error(`Owner email failed for order #${orderId}:`, error);
    }

    // * Manual orders (Custom Merch) stop here — the owner takes over
    if (!manual) await advanceOrder(orderId, images.length ? images : undefined);

    return json({ ok: true, orderId });
}

async function handlePaypalWebhook(request: Request): Promise<Response> {
    let event: { event_type?: string; resource?: { invoice?: { id?: string } } };
    try {
        event = (await request.json()) as typeof event;
    } catch {
        return json({ ok: false }, 400);
    }

    const valid = await verifyWebhookSignature(Object.fromEntries(request.headers), event);
    if (!valid) return json({ ok: false }, 400);

    if (event.event_type === "INVOICING.INVOICE.PAID") {
        const invoiceId = event.resource?.invoice?.id;

        if (invoiceId) {
            const [order] = await db.select().from(orders).where(eq(orders.paypalInvoiceId, invoiceId));

            if (order && order.status !== "paid") {
                await db.update(orders).set({ status: "paid" }).where(eq(orders.id, order.id));
                await notifyPaid(order);
            }
        }
    }

    return json({ ok: true });
}

Bun.serve({
    port: 3000,
    routes: {
        "/orders": {
            POST: handleOrder,
            OPTIONS: () => new Response(null, { status: 204, headers: CORS_HEADERS }),
        },
        "/paypal/webhook": {
            POST: handlePaypalWebhook,
        },
    },
    fetch: () => new Response("Not found", { status: 404 }),
});

console.log("Bun server running on http://localhost:3000");
