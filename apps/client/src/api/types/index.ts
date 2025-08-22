import type { Gallery as PayloadGallery, Media as PayloadMedia } from "@cms/payload-types";

export type PaginatedApiResponse<T> = {
    docs: T[];
    hasNextPage: boolean;
    hasPrevPage: boolean;
    limit: number;
    nextPage: number | null;
    page: number;
    pagingCounter: number;
    prevPage: number | null;
    totalDocs: number;
    totalPages: number;
};

// * We ensure url, width and height are present with AfterChange hook in Media.ts
export type Media = Omit<PayloadMedia, "url" | "thumbnailURL" | "width" | "height"> & {
    width: number;
    height: number;
    url: string;
    thumbnailURL: string;
};

// * Default depth of 2 ensures we get full image
export type Gallery = Omit<PayloadGallery, "image"> & {
    image: Media;
};
