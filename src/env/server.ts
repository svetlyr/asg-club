import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
    server: {
        SOCIAL_TIKTOK: z.string().url(),
        SOCIAL_YOUTUBE: z.string().url(),
        SOCIAL_FACEBOOK: z.string().url(),
        SOCIAL_INSTAGRAM: z.string().url(),
    },
    runtimeEnv: process.env,
    emptyStringAsUndefined: true,
});

export type Env = typeof env;
