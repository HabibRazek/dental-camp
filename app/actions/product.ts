// app/actions/product.ts
"use server";

import { prisma } from "@/lib/prisma";
import { ProductSchema } from "@/schemas/product";
import { revalidatePath } from "next/cache";

export async function createProduct(prevState: FormData, formData: FormData) {
  const rawData = {
    name: formData.get("name"),
    category: formData.get("category"),
    price: parseFloat(formData.get("price") as string),
    discount: formData.get("discount") 
      ? parseFloat(formData.get("discount") as string)
      : undefined,
    stock: parseInt(formData.get("stock") as string),
    description: formData.get("description"),
    technicalDetails: formData.get("technicalDetails") || undefined,
    images: JSON.parse(formData.get("images") as string),
    recommendedFor: JSON.parse(formData.get("recommendedFor") as string) || [],
    verifiedBy: JSON.parse(formData.get("verifiedBy") as string) || [],
  };

  const validatedData = ProductSchema.safeParse(rawData);

  if (!validatedData.success) {
    return {
      errors: validatedData.error.flatten().fieldErrors,
      message: "Validation failed",
    };
  }

  try {
    await prisma.product.create({
      data: {
        name: validatedData.data.name,
        category: validatedData.data.category,
        price: validatedData.data.price,
        discount: validatedData.data.discount,
        stock: validatedData.data.stock,
        description: validatedData.data.description,
        technicalDetails: validatedData.data.technicalDetails,
        images: validatedData.data.images,
        recommendedFor: validatedData.data.recommendedFor,
        verifiedBy: validatedData.data.verifiedBy,
      },
    });

    revalidatePath("/products");
    return { success: true, message: "Product created successfully" };
  } catch (error) {
    console.error("Database Error:", error);
    return { message: "Failed to create product" };
  }
}