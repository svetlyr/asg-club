/* eslint-disable @typescript-eslint/consistent-type-definitions */
// TODO: runtime and buildtime validation
declare module "bun" {
    interface Env {
        BOT_TOKEN: string;

        OWNER_CHAT_ID: number;
        DESIGNER_CHAT_ID: number;
        PRINTER_CHAT_ID: number;
        FACTORY_CHAT_ID: number;

        POSTGRES_DB: string;
        POSTGRES_PORT: number;
        POSTGRES_USER: string;
        POSTGRES_PASSWORD: string;
        POSTGRES_HOSTNAME: string;

        GOOGLE_CLIENT_ID: string;
        GOOGLE_CLIENT_SECRET: string;
        GOOGLE_REFRESH_TOKEN: string;
    }
}
