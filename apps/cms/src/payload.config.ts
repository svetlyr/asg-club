import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";

import env from "@env";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Gallery } from "./collections/Gallery";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import { postgresAdapter } from "@payloadcms/db-postgres";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const s3 = s3Storage({
    collections: { media: true },
    config: {
        credentials: {
            accessKeyId: env.R2_ACCESS_KEY_ID,
            secretAccessKey: env.R2_SECRET_ACCESS_KEY,
        },
        region: "auto",
        endpoint: env.R2_BUCKET_URL,
    },
    bucket: env.R2_BUCKET_NAME,
});

export default buildConfig({
    secret: env.PAYLOAD_SECRET,
    admin: {
        components: {
            actions: ["./components/DeployButton.tsx"],
        },
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

    sharp,
    plugins: [s3],
    db: postgresAdapter({
        pool: {
            connectionString: env.DATABASE_URL,
        },
    }),
    typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
});
