import { type OrderRow, products } from "./config";

const BASE_URL = process.env.PAYPAL_ENV === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";

const CURRENCY = process.env.PAYPAL_CURRENCY ?? "EUR";

let cachedToken: { value: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
    if (cachedToken && cachedToken.expiresAt > Date.now()) return cachedToken.value;

    const credentials = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString(
        "base64",
    );

    const response = await fetch(`${BASE_URL}/v1/oauth2/token`, {
        method: "POST",
        headers: {
            Authorization: `Basic ${credentials}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials",
    });

    if (!response.ok) throw new Error(`PayPal auth failed: ${response.status} ${await response.text()}`);

    const data = (await response.json()) as { access_token: string; expires_in: number };

    // * Refresh a minute before actual expiry
    cachedToken = { value: data.access_token, expiresAt: Date.now() + (data.expires_in - 60) * 1000 };
    return cachedToken.value;
}

async function api(path: string, body: unknown): Promise<Response> {
    const token = await getAccessToken();

    return fetch(`${BASE_URL}${path}`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });
}

function money(value: number): { currency_code: string; value: string } {
    return { currency_code: CURRENCY, value: value.toFixed(2) };
}

/** Creates a PayPal invoice with a line per pipeline stage and emails it to the customer. Returns the invoice id. */
export async function createAndSendInvoice(order: OrderRow): Promise<string> {
    const items: { name: string; quantity: string; unit_amount: ReturnType<typeof money> }[] = [];

    if (order.designPrice !== null) {
        items.push({ name: "Design work", quantity: "1", unit_amount: money(order.designPrice) });
    }
    if (order.productionPrice !== null) {
        items.push({
            name: `${products[order.product].label} — production`,
            quantity: "1",
            unit_amount: money(order.productionPrice),
        });
    }
    if (order.markup !== null) {
        items.push({ name: "Service fee", quantity: "1", unit_amount: money(order.markup) });
    }

    const createResponse = await api("/v2/invoicing/invoices", {
        detail: {
            currency_code: CURRENCY,
            reference: `order-${order.id}`,
            note: `Order #${order.id} — ${products[order.product].label}`,
        },
        primary_recipients: [
            {
                billing_info: {
                    name: { given_name: order.firstName, surname: order.lastName },
                    email_address: order.email,
                },
            },
        ],
        items,
    });

    if (!createResponse.ok) {
        throw new Error(`PayPal invoice creation failed: ${createResponse.status} ${await createResponse.text()}`);
    }

    const created = (await createResponse.json()) as { id?: string; href?: string };
    const invoiceId = created.id ?? created.href?.split("/").pop();

    if (!invoiceId) throw new Error("PayPal invoice creation returned no id");

    const sendResponse = await api(`/v2/invoicing/invoices/${invoiceId}/send`, {});

    if (!sendResponse.ok) {
        throw new Error(`PayPal invoice send failed: ${sendResponse.status} ${await sendResponse.text()}`);
    }

    return invoiceId;
}

type WebhookHeaders = Record<string, string | undefined>;

/** Verifies the webhook signature through PayPal's verification endpoint. Never throws — invalid on any failure. */
export async function verifyWebhookSignature(headers: WebhookHeaders, event: unknown): Promise<boolean> {
    try {
        const response = await api("/v1/notification/verify-webhook-signature", {
            auth_algo: headers["paypal-auth-algo"],
            cert_url: headers["paypal-cert-url"],
            transmission_id: headers["paypal-transmission-id"],
            transmission_sig: headers["paypal-transmission-sig"],
            transmission_time: headers["paypal-transmission-time"],
            webhook_id: process.env.PAYPAL_WEBHOOK_ID,
            webhook_event: event,
        });

        if (!response.ok) return false;

        const result = (await response.json()) as { verification_status?: string };
        return result.verification_status === "SUCCESS";
    } catch (error) {
        console.error("PayPal webhook verification failed:", error);
        return false;
    }
}
