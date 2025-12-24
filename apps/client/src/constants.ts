export type UnitTypeKey = keyof typeof unitTypes;
export type MeasurementKey = (typeof _measurementKeys)[number];

const _measurementKeys = ["dimensions", "size"] as const;
export const sizes = ["XS", "S", "M", "L", "XL", "XXL"] as const;
export const schemaUnitTypes = [...["EU", "US", "cm", "inch"]] as const;
export const unitTypes = { size: ["EU", "US"], dimensions: ["cm", "inch"] } as const;
export const fileTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"] as const;

export const serviceTypes = [
    "Graphic Design",
    "Stickers/Decals",
    "Jacket Pins",
    "Wall Posters/Banners",
    "T-Shirts",
    "Mugs",
    "Metal Badges and Medals",
    "Keychains",
    "Custom Merch",
    "Premade Merch",
] as const;
export type ServiceType = (typeof serviceTypes)[number];

// prettier-ignore
export const additionalFields = {
    "Graphic Design":           [],
    "Stickers/Decals":          ["quantity", "width", "height"],
    "Jacket Pins":              ["quantity", "width", "height"],
    "Wall Posters/Banners":     ["quantity", "width", "height"],
    "T-Shirts":                 ["quantity", "size"],
    "Mugs":                     ["quantity"],
    "Keychains":                ["quantity", "width", "height"],
    "Metal Badges and Medals":  ["quantity", "width", "height"],
    "Custom Merch":             ["quantity"],
    "Premade Merch":            [],
} as const;
export type AdditionalFields = typeof additionalFields;
