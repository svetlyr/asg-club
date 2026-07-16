const { env } = process;

const DATABASE_PATH = env.DATABASE_PATH ?? "orders.db";

export { DATABASE_PATH, env as default };
