import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
    clientPrefix: "PUBLIC_",
    client: {
        PUBLIC_BALLS: z.string(),
    },
    runtimeEnv: import.meta.env,
    emptyStringAsUndefined: true,
});

export type Env = typeof env;
