// app/actions/product.ts
"use server";

import prisma from '@/lib/prisma'
import { ProductCreatorSchema } from '@/schemas/product';

import { z } from "zod";




export async function createProduct(formData:z.infer<typeof ProductCreatorSchema>) {
  try{
    const validatedData = ProductCreatorSchema.safeParse(formData);
  if(!validatedData.success) {
    console.error("Validation Error:", validatedData.error.format());
    return { message: "Validation failed", errors: validatedData.error.format() };
  }
  console.log("Validated Data:", validatedData.data);

  try {
    await prisma.product.create({
      data: {
        name: validatedData.data.identity.name,
        category: validatedData.data.identity.category,
        
        recommendedFor: validatedData.data.identity.recommendedFor,
        verifiedBy: validatedData.data.identity.verifiedBy,
        price: validatedData.data.pricing.price,

        primaryDescription: validatedData.data.descreptions.primary,
        technicalDescription: validatedData.data.descreptions.technical,
        images: validatedData.data.images,
        hasPromotion: validatedData.data.pricing.hasPromotion,
        promotion: validatedData.data.pricing.promotion,
        quantity: validatedData.data.pricing.quantity,
      },
    });

    // revalidatePath("/products");
    return { success: true, message: "Product created successfully" };
  } catch (error) {
    console.error("Database Error:", error);
    return { message: "Failed to create product" };
  }
  }catch (error) {  
    console.error("Unexpected Error:", error);
    return { message: "An unexpected error occurred",errors: "Somthing happend while adding new product" };
  }
  
}