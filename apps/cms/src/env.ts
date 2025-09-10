import { z } from "zod";
import { createEnv } from "@t3-oss/env-nextjs";

const env = createEnv({
    server: {
        PAYLOAD_SECRET: z.string(),
        PORT: z.coerce.number().default(3001),

        DATABASE_URL: z.string(),
        R2_BUCKET_URL: z.string(),
        R2_BUCKET_NAME: z.string(),
        R2_ACCESS_KEY_ID: z.string(),
        R2_SECRET_ACCESS_KEY: z.string(),
    },
    client: {
        // NEXT_PUBLIC_PUBLISHABLE_KEY: z.string().min(1),
    },
    experimental__runtimeEnv: {
        DATABASE_URL: process.env.DATABASE_URL,
    },
});

export default env;
