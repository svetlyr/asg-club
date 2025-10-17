import type { Media as MediaType } from "@payload-types";
import type { CollectionAfterChangeHook, CollectionConfig } from "payload";

const ensureUrlExists: CollectionAfterChangeHook<MediaType> = async ({ doc, req }) => {
    if (!doc.url || !doc.width || !doc.height) {
        console.error(
            `Media document with ID: ${doc.id} was saved without url, width or height. Deleting broken record.`,
        );
        await req.payload.delete({ collection: "media", id: doc.id });

        throw new Error(
            `File upload failed: Could not generate url, width or height. The upload has been rolled back.`,
        );
    }

    return doc;
};
export const Media: CollectionConfig = {
    slug: "media",
    access: {
        read: () => true,
        create: ({ req: { user } }) => !!user,
        update: ({ req: { user } }) => !!user,
        delete: ({ req: { user } }) => !!user,
    },
    hooks: {
        afterChange: [ensureUrlExists],
    },

    fields: [
        {
            name: "alt",
            type: "text",
            required: true,
        },
    ],
    upload: {
        staticDir: "media",
        mimeTypes: ["image/jpeg", "image/jpg", "image/png"],
        disableLocalStorage: true,
    },
};
