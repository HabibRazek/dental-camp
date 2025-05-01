
import { z } from "zod";

export const ProductCreatorSchema = z.object({
  identity: z.object({
    name: z.string().min(1, "Name is required"),
    category: z.string().min(1, "Category is required"),
    recommendedFor: z.array(z.string()).optional(),
    verifiedBy: z.array(z.string()).optional(),
  }),
  images: z.array(z.string()).min(1, "At least one image is required"),
  descreptions: z.object({
    primary: z.string().min(1, "Primary description is required"),
    technical: z.string().optional(),
  }),
  pricing: z.object({
    price: z.number().min(0.01, "Price must be at least $0.01"),
    hasPromotion: z.boolean(),
    promotion: z.string().optional(),
    quantity: z.number().min(0, "Quantity cannot be negative"),
  }),
});
