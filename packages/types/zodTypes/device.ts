import { z } from "zod";

export const deviceSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["mobile", "gadget", "audio", "other"]),
  quantity: z.number(),
  manufacturer: z.string(),
  cost_price: z.number(),
  condition: z.enum(["new", "used", "refurbished", "returned"]),
  status: z.enum(["available", "sold", "damaged", "out_of_stock"]),
});

export type Device = z.infer<typeof deviceSchema>;

export const deviceUpdateSchema = z.object({
  name: z.string().optional(),
  type: z.enum(["mobile", "gadget", "audio", "other"]).optional(),
  quantity: z.number().optional(),
  manufacturer: z.string().optional(),
  cost_price: z.number().optional(),
  condition: z.enum(["new", "used", "refurbished"]).optional(),
  status: z
    .enum(["available", "sold", "damaged", "out_of_stock", "returned"])
    .optional(),
});

export type DeviceUpdate = z.infer<typeof deviceUpdateSchema>;
