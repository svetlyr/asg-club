export type PayloadImage = {
    id: number;
    alt: string;
    updatedAt: string;
    createdAt: string;
    url: string;
    thumbnailURL: string | null;
    filename: string;
    mimeType: string;
    filesize: number;
    width: number;
    height: number;
    focalX: number;
    focalY: number;
};

export type GalleryItem = {
    id: number;
    title: string;
    description: string;
    width: number;
    height: number;
    unit: "cm" | "inch";
    image: PayloadImage;
    updatedAt: string;
    createdAt: string;
};

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
