import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Get all products regardless of status
    const allProducts = await prisma.product.findMany({
      include: {
        category: true,
      },
    });

    // Get published products
    const publishedProducts = await prisma.product.findMany({
      where: {
        status: "PUBLISHED",
        isActive: true,
      },
      include: {
        category: true,
      },
    });

    // Get all categories
    const categories = await prisma.category.findMany();

    return NextResponse.json({
      totalProducts: allProducts.length,
      publishedProducts: publishedProducts.length,
      totalCategories: categories.length,
      allProducts: allProducts.map(p => ({
        id: p.id,
        name: p.name,
        status: p.status,
        isActive: p.isActive,
        category: p.category?.name || 'No category'
      })),
      publishedProductsList: publishedProducts.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        category: p.category?.name || 'No category'
      })),
      categories: categories.map(c => ({
        id: c.id,
        name: c.name,
        isActive: c.isActive
      }))
    });
  } catch (error) {
    console.error("Debug error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error },
      { status: 500 }
    );
  }
}
