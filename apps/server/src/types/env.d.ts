/* eslint-disable @typescript-eslint/consistent-type-definitions */
declare module "bun" {
    interface Env {
        BOT_TOKEN: string;
        DATABASE_URL: string;

        OWNER_CHAT_ID: number;
        DESIGNER_CHAT_ID: number;
        PRINTER_CHAT_ID: number;
        FACTORY_CHAT_ID: number;

        GOOGLE_CLIENT_ID: string;
        GOOGLE_CLIENT_SECRET: string;
        GOOGLE_REFRESH_TOKEN: string;
    }
}
