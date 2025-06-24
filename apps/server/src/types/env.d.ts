/* eslint-disable @typescript-eslint/consistent-type-definitions */
// TODO: runtime and buildtime validation
declare module "bun" {
    interface Env {
        BOT_TOKEN: string;
        OWNER_CHAT_ID: number;
        DESIGNER_CHAT_ID: number;
        PRINTER_CHAT_ID: number;
    }
}
