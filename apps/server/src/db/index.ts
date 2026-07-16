import { Database } from "bun:sqlite";
import { DATABASE_PATH } from "@env";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";

const sqlite = new Database(DATABASE_PATH, { create: true });
sqlite.run("PRAGMA journal_mode = WAL;");

export const db = drizzle(sqlite);

// * Self-migrating on boot — no separate migrations container needed
migrate(db, { migrationsFolder: process.env.MIGRATIONS_DIR ?? "drizzle" });
