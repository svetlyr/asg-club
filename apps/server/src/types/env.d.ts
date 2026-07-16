declare module "bun" {
    // * Must stay an interface — declaration merging into Bun's Env
    interface Env {
        BOT_TOKEN: string;
        DATABASE_PATH?: string;
        MIGRATIONS_DIR?: string;

        OWNER_CHAT_ID: string;
        DESIGNER_CHAT_ID: string;
        PRINTER_CHAT_ID: string;
        FACTORY_CHAT_ID: string;

        RESEND_API_KEY: string;
        MAIL_FROM: string;
        OWNER_EMAIL: string;

        PAYPAL_CLIENT_ID: string;
        PAYPAL_CLIENT_SECRET: string;
        PAYPAL_WEBHOOK_ID: string;
        PAYPAL_ENV: "sandbox" | "live";
        PAYPAL_CURRENCY?: string;
    }
}
