import type { Env as ServerEnv } from "../env/client";
import type { Env as ClientEnv } from "../env/server";

export type Env = ServerEnv & ClientEnv;

export declare const env: Env;
