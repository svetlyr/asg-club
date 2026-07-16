import type { orders, productIds } from "./db/schema";

export type OrderRow = typeof orders.$inferSelect;
export type ProductId = (typeof productIds)[number];

export type ProductionRole = "printer" | "factory";

type ProductConfig =
    // * Terminal design work — designer prices it, no production stage
    | { label: string; kind: "design" }
    // * Owner handles the order manually — email only, no pipeline
    | { label: string; kind: "manual" }
    // * Regular product — optional design stage, then priced by a production specialist
    | { label: string; kind: "production"; production: ProductionRole };

export const products = {
    design: { label: "Custom Design", kind: "design" },
    stickers: { label: "Stickers / Decals", kind: "production", production: "printer" },
    posters: { label: "Posters / Banners", kind: "production", production: "printer" },
    // TODO: T-Shirts and Mugs are routed to factory for now — revisit
    tshirts: { label: "T-Shirts", kind: "production", production: "factory" },
    mugs: { label: "Mugs", kind: "production", production: "factory" },
    pins: { label: "Jacket Pins", kind: "production", production: "factory" },
    keychains: { label: "Keychains", kind: "production", production: "factory" },
    badges: { label: "Metal Badges & Medals", kind: "production", production: "factory" },
    merch: { label: "Custom Merch", kind: "manual" },
} as const satisfies Record<ProductId, ProductConfig>;

export type Stage = "design" | "production" | "markup";

type StageInput = Pick<OrderRow, "product" | "needsDesign" | "designPrice" | "productionPrice" | "markup">;

/** Sequential pipeline: [design?] -> production -> owner markup. Returns the current unpriced stage. */
export function stageFor(order: StageInput): Stage | null {
    const config = products[order.product];

    if (config.kind === "manual") return null;
    if ((config.kind === "design" || order.needsDesign) && order.designPrice === null) return "design";
    if (config.kind === "production" && order.productionPrice === null) return "production";
    if (order.markup === null) return "markup";

    return null;
}
