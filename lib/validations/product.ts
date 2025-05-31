import { z } from "zod"

// Product status enum
export const ProductStatusEnum = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"])

// Dimensions schema
export const DimensionsSchema = z.object({
  length: z.number().positive().optional(),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
  unit: z.enum(["cm", "in"]).default("cm"),
})

// Base product schema
export const ProductSchema = z.object({
  name: z.string().min(1, "Product name is required").max(255),
  description: z.string().optional(),
  sku: z.string().min(1, "SKU is required").max(100),
  slug: z.string().min(1, "Slug is required").max(255),
  
  // Pricing
  price: z.number().positive("Price must be positive"),
  costPrice: z.number().min(0).optional(),
  comparePrice: z.number().min(0).optional(),
  
  // Inventory
  stockQuantity: z.number().int().min(0, "Stock quantity cannot be negative").default(0),
  lowStockThreshold: z.number().int().min(0).default(10),
  trackQuantity: z.boolean().default(true),
  
  // Physical properties
  weight: z.number().min(0).optional(),
  dimensions: DimensionsSchema.optional(),
  
  // Media
  images: z.array(z.string().url()).default([]),
  thumbnail: z.string().url().optional(),
  
  // SEO & Organization
  tags: z.array(z.string()).default([]),
  metaTitle: z.string().max(60).optional(),
  metaDescription: z.string().max(160).optional(),
  
  // Status
  status: ProductStatusEnum.default("DRAFT"),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  
  // Relationships
  categoryId: z.string().optional(),
})

// Create product schema (for API)
export const CreateProductSchema = ProductSchema.omit({
  slug: true, // Auto-generated from name
})

// Update product schema
export const UpdateProductSchema = ProductSchema.partial().extend({
  id: z.string().cuid(),
})

// Product query schema (for filtering/searching)
export const ProductQuerySchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  category: z.string().optional(),
  status: ProductStatusEnum.optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  minPrice: z.number().positive().optional(),
  maxPrice: z.number().positive().optional(),
  sortBy: z.enum(["name", "price", "createdAt", "updatedAt", "stockQuantity"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
})

// Category schemas
export const CategorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(100),
  description: z.string().optional(),
  slug: z.string().min(1, "Slug is required").max(100),
  isActive: z.boolean().default(true),
})

export const CreateCategorySchema = CategorySchema.omit({
  slug: true, // Auto-generated from name
})

export const UpdateCategorySchema = CategorySchema.partial().extend({
  id: z.string().cuid(),
})

// Type exports
export type Product = z.infer<typeof ProductSchema>
export type CreateProduct = z.infer<typeof CreateProductSchema>
export type UpdateProduct = z.infer<typeof UpdateProductSchema>
export type ProductQuery = z.infer<typeof ProductQuerySchema>
export type ProductStatus = z.infer<typeof ProductStatusEnum>
export type Dimensions = z.infer<typeof DimensionsSchema>

export type Category = z.infer<typeof CategorySchema>
export type CreateCategory = z.infer<typeof CreateCategorySchema>
export type UpdateCategory = z.infer<typeof UpdateCategorySchema>
