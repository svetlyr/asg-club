import { z } from "@zod/mini";

export const orderSchema = z.object({
    email: z.email(),
    fullname: z.string().check(z.minLength(6), z.maxLength(20)),
    tel: z.e164(),
    serviceType: z.enum(["Decals", "Jacket Pins", "Merch"]),
    description: z.string().check(z.maxLength(20)),
    quantity: z.number().check(z.positive(), z.maximum(20)),
    dimensions: z.number().check(z.positive()),
    unitType: z.enum(["cm", "inch"]),
    comments: z.string(),
});

export type OrderSchema = z.infer<typeof orderSchema>;

export const basicDetailsSchema = z.pick(orderSchema, { email: true, fullname: true, tel: true });
export type BasicDetailsSchema = z.infer<typeof basicDetailsSchema>;

export const serviceDetailsSchema = z.pick(orderSchema, {
    serviceType: true,
    description: true,
    quantity: true,
    dimensions: true,
    unitType: true,
});
export type ServiceDetailsSchema = z.infer<typeof serviceDetailsSchema>;
