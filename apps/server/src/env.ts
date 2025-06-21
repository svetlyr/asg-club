declare module "bun" {
    interface Env {
        BOT_TOKEN: string;
        DATABASE_URL: string;
        OWNER_CHAT_ID: number;
        DESIGNER_CHAT_ID: number;
        PRINTER_CHAT_ID: number;
    }
}
