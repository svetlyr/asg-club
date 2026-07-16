import { type OrderRow, products } from "./config";

type NewOrder = Pick<
    OrderRow,
    "id" | "firstName" | "lastName" | "email" | "tel" | "product" | "needsDesign" | "description"
>;

/** Notification + record for the owner, sent for every incoming order (via Resend). */
export async function sendOwnerEmail(order: NewOrder, images: File[]): Promise<void> {
    const config = products[order.product];

    const lines = [
        `Order #${order.id}`,
        `Product: ${config.label}`,
        `Design needed: ${config.kind === "design" ? "yes (design only)" : order.needsDesign ? "yes" : "no"}`,
        `Name: ${order.firstName} ${order.lastName}`,
        `Email: ${order.email}`,
        order.tel ? `Phone: ${order.tel}` : null,
        "",
        order.description,
    ].filter((line) => line !== null);

    const attachments = await Promise.all(
        images.map(async (image) => ({
            filename: image.name,
            content: Buffer.from(await image.arrayBuffer()).toString("base64"),
        })),
    );

    const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            from: process.env.MAIL_FROM,
            to: process.env.OWNER_EMAIL,
            subject:
                config.kind === "manual"
                    ? `Manual order #${order.id} — ${config.label}`
                    : `New order #${order.id} — ${config.label}`,
            text: lines.join("\n"),
            attachments,
        }),
    });

    if (!response.ok) {
        throw new Error(`Resend failed: ${response.status} ${await response.text()}`);
    }
}
