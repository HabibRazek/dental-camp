import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ProductStatus } from "@prisma/client";

export async function POST() {
  try {
    // First, create some categories if they don't exist
    const categories = await Promise.all([
      prisma.category.upsert({
        where: { slug: "dental-chairs" },
        update: {},
        create: {
          name: "Dental Chairs",
          slug: "dental-chairs",
          description: "Professional dental chairs and patient seating",
          isActive: true,
        },
      }),
      prisma.category.upsert({
        where: { slug: "dental-instruments" },
        update: {},
        create: {
          name: "Dental Instruments",
          slug: "dental-instruments", 
          description: "High-quality dental instruments and tools",
          isActive: true,
        },
      }),
      prisma.category.upsert({
        where: { slug: "dental-equipment" },
        update: {},
        create: {
          name: "Dental Equipment",
          slug: "dental-equipment",
          description: "Advanced dental equipment and machinery",
          isActive: true,
        },
      }),
    ]);

    // Sample products data
    const sampleProducts = [
      {
        name: "Professional Dental Chair Model X1",
        slug: "professional-dental-chair-x1",
        description: "State-of-the-art dental chair with advanced positioning and comfort features. Perfect for modern dental practices.",
        price: 15000,
        comparePrice: 18000,
        sku: "DC-X1-001",
        status: ProductStatus.PUBLISHED,
        isActive: true,
        isFeatured: true,
        stockQuantity: 5,
        categoryId: categories[0].id,
        thumbnail: "/images/dental-chair-1.jpg",
        images: ["/images/dental-chair-1.jpg", "/images/dental-chair-2.jpg"],
        tags: ["dental chair", "professional", "comfort"],
      },
      {
        name: "Digital X-Ray System Pro",
        slug: "digital-xray-system-pro",
        description: "High-resolution digital X-ray system with advanced imaging capabilities and reduced radiation exposure.",
        price: 25000,
        comparePrice: 30000,
        sku: "XR-PRO-001",
        status: ProductStatus.PUBLISHED,
        isActive: true,
        isFeatured: true,
        stockQuantity: 3,
        categoryId: categories[2].id,
        thumbnail: "/images/xray-system.jpg",
        images: ["/images/xray-system.jpg"],
        tags: ["x-ray", "digital", "imaging"],
      },
      {
        name: "Dental Handpiece Set Premium",
        slug: "dental-handpiece-set-premium",
        description: "Premium dental handpiece set with high-speed and low-speed options. Ergonomic design for extended use.",
        price: 3500,
        comparePrice: 4200,
        sku: "HP-PREM-001",
        status: ProductStatus.PUBLISHED,
        isActive: true,
        isFeatured: false,
        stockQuantity: 12,
        categoryId: categories[1].id,
        thumbnail: "/images/handpiece-set.jpg",
        images: ["/images/handpiece-set.jpg"],
        tags: ["handpiece", "premium", "ergonomic"],
      },
      {
        name: "LED Dental Light Ultra Bright",
        slug: "led-dental-light-ultra-bright",
        description: "Ultra-bright LED dental light with adjustable intensity and color temperature. Shadow-free illumination.",
        price: 2800,
        sku: "LED-UB-001",
        status: ProductStatus.PUBLISHED,
        isActive: true,
        isFeatured: false,
        stockQuantity: 8,
        categoryId: categories[2].id,
        thumbnail: "/images/dental-light.jpg",
        images: ["/images/dental-light.jpg"],
        tags: ["LED", "light", "bright"],
      },
      {
        name: "Dental Sterilizer Autoclave",
        slug: "dental-sterilizer-autoclave",
        description: "Professional autoclave sterilizer for dental instruments. Fast cycle times and reliable sterilization.",
        price: 4500,
        comparePrice: 5500,
        sku: "ST-AUTO-001",
        status: ProductStatus.PUBLISHED,
        isActive: true,
        isFeatured: true,
        stockQuantity: 6,
        categoryId: categories[2].id,
        thumbnail: "/images/autoclave.jpg",
        images: ["/images/autoclave.jpg"],
        tags: ["sterilizer", "autoclave", "safety"],
      },
      {
        name: "Dental Impression Materials Kit",
        slug: "dental-impression-materials-kit",
        description: "Complete kit of dental impression materials including alginate, silicone, and accessories.",
        price: 450,
        sku: "IM-KIT-001",
        status: ProductStatus.PUBLISHED,
        isActive: true,
        isFeatured: false,
        stockQuantity: 25,
        categoryId: categories[1].id,
        thumbnail: "/images/impression-kit.jpg",
        images: ["/images/impression-kit.jpg"],
        tags: ["impression", "materials", "kit"],
      },
      {
        name: "Dental Compressor Silent Pro",
        slug: "dental-compressor-silent-pro",
        description: "Silent dental air compressor with oil-free operation. Reliable and quiet performance for dental offices.",
        price: 3200,
        sku: "COMP-SP-001",
        status: ProductStatus.PUBLISHED,
        isActive: true,
        isFeatured: false,
        stockQuantity: 4,
        categoryId: categories[2].id,
        thumbnail: "/images/compressor.jpg",
        images: ["/images/compressor.jpg"],
        tags: ["compressor", "silent", "oil-free"],
      },
      {
        name: "Dental Surgical Instruments Set",
        slug: "dental-surgical-instruments-set",
        description: "Complete set of dental surgical instruments made from high-grade stainless steel. Precision crafted.",
        price: 1200,
        comparePrice: 1500,
        sku: "SI-SET-001",
        status: ProductStatus.PUBLISHED,
        isActive: true,
        isFeatured: false,
        stockQuantity: 15,
        categoryId: categories[1].id,
        thumbnail: "/images/surgical-set.jpg",
        images: ["/images/surgical-set.jpg"],
        tags: ["surgical", "instruments", "stainless steel"],
      },
    ];

    // Create products
    const createdProducts = [];
    for (const productData of sampleProducts) {
      const existingProduct = await prisma.product.findUnique({
        where: { slug: productData.slug },
      });

      if (!existingProduct) {
        const product = await prisma.product.create({
          data: productData,
        });
        createdProducts.push(product);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Created ${createdProducts.length} products and ${categories.length} categories`,
      createdProducts: createdProducts.length,
      categories: categories.length,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Failed to seed products", details: error },
      { status: 500 }
    );
  }
}
