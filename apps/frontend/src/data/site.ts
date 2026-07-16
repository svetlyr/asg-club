export const site = {
    brand: "ASG-CLUB",
    sub: "CUSTOM MERCH CO.",
    headline: "Premium Custom Merch, Crafted to Your Specifications",
    tagline:
        "Small-batch custom gear for riders, makers, and clubs. You bring the idea — we engineer it into something built to last.",
    // TODO: replace placeholders before release
    email: "hello@asg-club.com",
    phone: "+00 000 000 000",
    hours: "Mon–Fri · 9–17",
};

export const stats = [
    { label: "Production", value: "Small-batch" },
    { label: "Catalogue", value: "9 product lines" },
    { label: "Approval", value: "Mockup first" },
    { label: "Payment", value: "PayPal / Bank" },
];

export interface Product {
    id: string;
    name: string;
    desc: string;
    /** SVG path data, 24x24 viewBox, stroked */
    paths: string[];
}

export const products: Product[] = [
    {
        id: "design",
        name: "Custom Design",
        desc: "Bespoke artwork & layout",
        paths: ["M3 21l3.6-.7L20.3 6.2a2 2 0 0 0-2.8-2.8L3.7 17.2 3 21z", "M14.5 6.5l3 3"],
    },
    {
        id: "stickers",
        name: "Stickers / Decals",
        desc: "Die-cut & vinyl",
        paths: ["M5 4h10v9l-6 6H5z", "M15 13H9v6"],
    },
    {
        id: "pins",
        name: "Jacket Pins",
        desc: "Enamel & metal pins",
        paths: [
            "M9.4 3.1a5.4 5.4 0 1 0 0 10.8 5.4 5.4 0 0 0 0-10.8z",
            "M9.4 6.9a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2z",
            "M12.9 12.3 20.3 19.7",
        ],
    },
    {
        id: "posters",
        name: "Posters / Banners",
        desc: "Large-format prints",
        paths: ["M4 4h16v16H4z", "M4 16l4.5-4.5 3 3 4-4 4.5 4.5"],
    },
    {
        id: "tshirts",
        name: "T-Shirts",
        desc: "Screen & DTG print",
        paths: ["M8.5 4 4 7l2 3 2-1.2V20h8V8.8L18 10l2-3-4.5-3a3.5 3.5 0 0 1-7 0z"],
    },
    {
        id: "mugs",
        name: "Mugs",
        desc: "Ceramic, full wrap",
        paths: ["M5 7h11v8a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3z", "M16 9h2a2 2 0 0 1 0 5h-2"],
    },
    {
        id: "keychains",
        name: "Keychains",
        desc: "Metal & acrylic",
        paths: ["M7.5 21a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11z", "M11.4 11.4 21 2", "M15.5 7.5l3 3L22 7l-3-3"],
    },
    {
        id: "badges",
        name: "Metal Badges & Medals",
        desc: "Cast & engraved",
        paths: ["M12 4l2.3 4.7 5.2.8-3.8 3.6.9 5.1L12 15.8 7.4 18.3l.9-5.1L4.5 9.5l5.2-.8z"],
    },
    {
        id: "merch",
        name: "Custom Merch",
        desc: "Anything else — just ask",
        paths: ["M3 8l9-4 9 4-9 4z", "M3 8v8l9 4 9-4V8", "M12 12v8"],
    },
];

export const steps = [
    {
        num: "01",
        title: "Select & describe",
        body: "Pick your product type, upload reference photos, and tell us exactly what you need — sizes, quantities, finishes.",
    },
    {
        num: "02",
        title: "Approve & pay",
        body: "We send back a custom mockup and a quote. Approve it, then settle up via PayPal or bank transfer.",
    },
    {
        num: "03",
        title: "Receive your gear",
        body: "We produce your order with care and ship it out — high-quality merch built to your specification.",
    },
];

export const credits = [
    { name: "Daniel", url: "https://github.com/pokens" },
    { name: "Radu", url: "https://github.com/svetlyr" },
];
