import { DATABASE_URL } from "@env";
import { drizzle } from "drizzle-orm/node-postgres";

export const db = drizzle(DATABASE_URL);
