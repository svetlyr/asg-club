import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";

import env from "@env";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Gallery } from "./collections/Gallery";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { sqliteAdapter } from "@payloadcms/db-sqlite";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
    secret: env.PAYLOAD_SECRET,
    admin: {
        meta: {
            // * disable Dark Reader extension
            other: { "darkreader-lock": "true" },
        },
        user: Users.slug,
        importMap: {
            baseDir: path.resolve(dirname),
        },
    },
    editor: lexicalEditor({}),
    collections: [Users, Media, Gallery],

    typescript: {
        outputFile: path.resolve(dirname, "payload-types.ts"),
    },
    db: sqliteAdapter({
        client: {
            url: env.DATABASE_URL,
        },
    }),

    sharp,
    plugins: [],
});
