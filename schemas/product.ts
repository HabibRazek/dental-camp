// schemas/product.ts
import { z } from "zod";

export const ProductSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  category: z.string().min(1, "Category is required").max(50),
  price: z.number().min(0.01, "Price must be at least $0.01"),
  discount: z.number().min(0).max(100).optional(),
  stock: z.number().min(0, "Quantity cannot be negative").int(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  technicalDetails: z.string().optional(),
  images: z.array(z.string().url()).min(1, "At least one image is required"),
  recommendedFor: z.array(z.string().min(1).max(50)).optional(),
  verifiedBy: z.array(z.string().min(1).max(50)).optional(),
});

export type ProductFormValues = z.infer<typeof ProductSchema>;