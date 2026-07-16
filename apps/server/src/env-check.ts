// * Imported first in index.ts — fail fast before the bot or db initialize
const REQUIRED_ENV = [
    "BOT_TOKEN",
    "OWNER_CHAT_ID",
    "DESIGNER_CHAT_ID",
    "PRINTER_CHAT_ID",
    "FACTORY_CHAT_ID",
    "RESEND_API_KEY",
    "MAIL_FROM",
    "OWNER_EMAIL",
    "PAYPAL_CLIENT_ID",
    "PAYPAL_CLIENT_SECRET",
    "PAYPAL_WEBHOOK_ID",
    "PAYPAL_ENV",
] as const;

const missing = REQUIRED_ENV.filter((key) => !process.env[key]);

if (missing.length > 0) {
    console.error("Missing environment variables:", missing.join(", "));
    process.exit(1);
}

console.log("Environment variables validated");
