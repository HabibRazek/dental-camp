import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/products/slug/[slug] - Get a single product by slug for public display
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    const product = await prisma.product.findUnique({
      where: { 
        slug,
        status: "PUBLISHED",
        isActive: true,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Parse dimensions if it exists
    const productWithParsedDimensions = {
      ...product,
      dimensions: product.dimensions ? JSON.parse(product.dimensions) : null,
    };

    // Get related products from the same category
    const relatedProducts = await prisma.product.findMany({
      where: {
        status: "PUBLISHED",
        isActive: true,
        categoryId: product.categoryId,
        id: {
          not: product.id,
        },
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      take: 4,
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      product: productWithParsedDimensions,
      relatedProducts,
    });
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
