const serviceTypes = [
    "Graphic Design",
    "Stickers/Decals",
    "Jacket Pins",
    "Wall Posters/Banners",
    "T-Shirts",
    "Mugs",
    "Keychains",
    "Metal Badges and Medals",
    "Custom Merch",
] as const;
type ServiceType = (typeof serviceTypes)[number];

const unitTypes = ["cm", "inch"] as const;
const measurementKeys = ["dimensions"] as const;
const baseServiceFields = ["serviceType", "description"] as const;
const optionalServiceFields = ["quantity", "dimensions", "size"] as const;
const allServiceFields = [...baseServiceFields, ...optionalServiceFields, "unitType"] as const;

type MeasurementKey = (typeof measurementKeys)[number];
type OptionalServiceFields = (typeof optionalServiceFields)[number];

// prettier-ignore
const additionalFields = {
    "Graphic Design":           [],
    "Stickers/Decals":          ["quantity", "dimensions"],
    "Jacket Pins":              ["quantity", "dimensions"],
    "Wall Posters/Banners":     ["quantity", "dimensions"],
    "T-Shirts":                 ["size"],
    "Mugs":                     ["quantity"],
    "Keychains":                ["quantity"],
    "Metal Badges and Medals":  ["quantity"],
    "Custom Merch":             ["quantity"],
} as const satisfies Record<ServiceType, OptionalServiceFields[]>;

type AdditionalFieldKey = (typeof additionalFields)[ServiceType][number];
type ServiceFieldKeys = [...typeof baseServiceFields, ...(typeof additionalFields)[ServiceType]];

export {
    unitTypes,
    serviceTypes,
    type ServiceType,
    measurementKeys,
    type MeasurementKey,
    baseServiceFields,
    allServiceFields,
    additionalFields as additionalServiceFields,
    type ServiceFieldKeys,
    type AdditionalFieldKey,
};
