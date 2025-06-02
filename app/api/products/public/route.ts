import { NextRequest, NextResponse } from "next/server";

// Product type for consistency
interface ProductResponse {
  id: string;
  name: string;
  description: string;
  sku: string;
  slug: string;
  price: string;
  comparePrice: string;
  stockQuantity: number;
  lowStockThreshold: number;
  trackQuantity: boolean;
  thumbnail: string | null;
  images: string[];
  isFeatured: boolean;
  status: string;
  isActive: boolean;
  tags: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  dimensions: any;
  createdAt: string;
}

// Mock products data for when database is not available
const mockProducts: ProductResponse[] = [
  {
    id: '1',
    name: 'Composite Dentaire Premium',
    description: 'Composite haute qualité pour restaurations esthétiques durables',
    sku: 'COMP-PREM-001',
    slug: 'composite-dentaire-premium',
    price: '269.99',
    comparePrice: '329.99',
    stockQuantity: 25,
    lowStockThreshold: 10,
    trackQuantity: true,
    thumbnail: null,
    images: [] as string[],
    isFeatured: true,
    status: 'PUBLISHED',
    isActive: true,
    tags: 'composite, restauration, esthétique',
    category: {
      id: '1',
      name: 'Composite & Adhésif',
      slug: 'composite-adhesif'
    },
    dimensions: null,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Kit Instruments Chirurgicaux',
    description: 'Set complet d\'instruments en acier inoxydable pour chirurgie dentaire',
    sku: 'KIT-CHIR-001',
    slug: 'kit-instruments-chirurgicaux',
    price: '899.99',
    comparePrice: '1049.99',
    stockQuantity: 15,
    lowStockThreshold: 10,
    trackQuantity: true,
    thumbnail: null,
    images: [] as string[],
    isFeatured: true,
    status: 'PUBLISHED',
    isActive: true,
    tags: 'instruments, chirurgie, acier',
    category: {
      id: '2',
      name: 'Instruments Dentaires',
      slug: 'instruments'
    },
    dimensions: null,
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Lampe LED Polymérisation',
    description: 'Lampe LED haute puissance pour polymérisation rapide et efficace',
    sku: 'LED-POLY-001',
    slug: 'lampe-led-polymerisation',
    price: '599.99',
    comparePrice: '749.99',
    stockQuantity: 8,
    lowStockThreshold: 10,
    trackQuantity: true,
    thumbnail: null,
    images: [] as string[],
    isFeatured: true,
    status: 'PUBLISHED',
    isActive: true,
    tags: 'led, polymérisation, lampe',
    category: {
      id: '3',
      name: 'Équipement Médical',
      slug: 'equipement'
    },
    dimensions: null,
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Autoclave Stérilisation',
    description: 'Autoclave professionnel pour stérilisation complète des instruments',
    sku: 'AUTO-STER-001',
    slug: 'autoclave-sterilisation',
    price: '1299.99',
    comparePrice: '1499.99',
    stockQuantity: 12,
    lowStockThreshold: 10,
    trackQuantity: true,
    thumbnail: null,
    images: [] as string[],
    isFeatured: false,
    status: 'PUBLISHED',
    isActive: true,
    tags: 'autoclave, stérilisation, hygiène',
    category: {
      id: '4',
      name: 'Stérilisation',
      slug: 'sterilisation'
    },
    dimensions: null,
    createdAt: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Autoclave Classe B',
    description: 'Stérilisateur professionnel avec cycles automatiques',
    sku: 'AUTO-CLASSB-001',
    slug: 'autoclave-classe-b',
    price: '3899.99',
    comparePrice: '4499.99',
    stockQuantity: 5,
    lowStockThreshold: 10,
    trackQuantity: true,
    thumbnail: null,
    images: [] as string[],
    isFeatured: true,
    status: 'PUBLISHED',
    isActive: true,
    tags: 'autoclave, stérilisation, classe-b',
    category: {
      id: '4',
      name: 'Stérilisation',
      slug: 'sterilisation'
    },
    dimensions: null,
    createdAt: new Date().toISOString()
  },
  {
    id: '6',
    name: 'Caméra Intra-Orale',
    description: 'Caméra haute définition pour diagnostic précis et documentation',
    sku: 'CAM-INTRA-001',
    slug: 'camera-intra-orale',
    price: '2699.99',
    comparePrice: '3299.99',
    stockQuantity: 20,
    lowStockThreshold: 10,
    trackQuantity: true,
    thumbnail: null,
    images: [] as string[],
    isFeatured: false,
    status: 'PUBLISHED',
    isActive: true,
    tags: 'caméra, diagnostic, intra-orale',
    category: {
      id: '5',
      name: 'Diagnostic',
      slug: 'diagnostic'
    },
    dimensions: null,
    createdAt: new Date().toISOString()
  },
  {
    id: '7',
    name: 'Seringues Anesthésie',
    description: 'Seringues jetables pour anesthésie locale, stériles et sécurisées',
    sku: 'SER-ANESTH-001',
    slug: 'seringues-anesthesie',
    price: '74.99',
    comparePrice: '89.99',
    stockQuantity: 100,
    lowStockThreshold: 10,
    trackQuantity: true,
    thumbnail: null,
    images: [] as string[],
    isFeatured: false,
    status: 'PUBLISHED',
    isActive: true,
    tags: 'seringues, anesthésie, jetables',
    category: {
      id: '6',
      name: 'Anesthésie',
      slug: 'anesthesie'
    },
    dimensions: null,
    createdAt: new Date().toISOString()
  }
];

// GET /api/products/public - Get published products for public display
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const featured = searchParams.get("featured") === "true";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    let filteredProducts: ProductResponse[] = [...mockProducts];
    let usingDatabase = false;

    // Try to use database if available
    try {
      const { prisma } = await import("@/lib/prisma")

      const skip = (page - 1) * limit;

      // Build where clause
      const where: any = {
        status: "PUBLISHED",
        isActive: true,
      };

      if (category && category !== "all") {
        where.category = {
          slug: category,
        };
      }

      if (search) {
        where.OR = [
          {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            tags: {
              hasSome: [search],
            },
          },
        ];
      }

      if (featured) {
        where.isFeatured = true;
      }

      // Build orderBy clause
      const orderBy: any = {};
      if (sortBy === "price") {
        orderBy.price = sortOrder;
      } else if (sortBy === "name") {
        orderBy.name = sortOrder;
      } else {
        orderBy.createdAt = sortOrder;
      }

      // Get products with pagination
      const [dbProducts, totalCount] = await Promise.all([
        prisma.product.findMany({
          where,
          include: {
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
          orderBy,
          skip,
          take: limit,
        }),
        prisma.product.count({ where }),
      ]);

      if (dbProducts && dbProducts.length > 0) {
        filteredProducts = dbProducts.map((product) => ({
          id: product.id,
          name: product.name,
          description: product.description || '',
          sku: product.sku,
          slug: product.slug,
          price: product.price.toString(),
          comparePrice: product.comparePrice?.toString() || '',
          stockQuantity: product.stockQuantity,
          lowStockThreshold: product.lowStockThreshold,
          trackQuantity: product.trackQuantity,
          thumbnail: product.thumbnail,
          images: product.images || [],
          isFeatured: product.isFeatured,
          status: product.status.toString(),
          isActive: product.isActive,
          tags: Array.isArray(product.tags) ? product.tags.join(', ') : (product.tags || ''),
          category: product.category || { id: '', name: 'Uncategorized', slug: 'uncategorized' },
          dimensions: product.dimensions ? JSON.parse(product.dimensions) : null,
          createdAt: product.createdAt.toISOString(),
        }));
        usingDatabase = true;
        console.log(`✅ Loaded ${dbProducts.length} products from database`);

        // Return database results with proper pagination
        return NextResponse.json({
          success: true,
          products: filteredProducts,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
            totalCount,
            hasNextPage: page < Math.ceil(totalCount / limit),
            hasPreviousPage: page > 1,
          },
          message: "Products retrieved from database successfully",
          source: "database"
        });
      } else {
        console.log("📝 No products found in database, using mock data");
      }
    } catch (dbError) {
      console.log("🔄 Database not available, using mock data:", dbError instanceof Error ? dbError.message : 'Unknown error');
    }

    // Use mock data with filtering
    // Filter by category
    if (category && category !== "all") {
      filteredProducts = filteredProducts.filter(p => p.category.slug === category);
    }

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.tags.toLowerCase().includes(searchLower)
      );
    }

    // Filter by featured
    if (featured) {
      filteredProducts = filteredProducts.filter(p => p.isFeatured);
    }

    // Sort products
    filteredProducts.sort((a, b) => {
      if (sortBy === "price") {
        const aPrice = parseFloat(a.price);
        const bPrice = parseFloat(b.price);
        return sortOrder === "asc" ? aPrice - bPrice : bPrice - aPrice;
      } else if (sortBy === "name") {
        return sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      } else {
        return sortOrder === "asc" ?
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime() :
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    // Apply pagination
    const totalCount = filteredProducts.length;
    const totalPages = Math.ceil(totalCount / limit);
    const skip = (page - 1) * limit;
    const paginatedProducts = filteredProducts.slice(skip, skip + limit);

    return NextResponse.json({
      success: true,
      products: paginatedProducts,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
      message: "Products retrieved successfully (using mock data)",
      source: "mock"
    });
  } catch (error) {
    console.error("Error fetching public products:", error);

    // Return mock data as fallback
    return NextResponse.json({
      success: true,
      products: mockProducts.slice(0, 6), // Return first 6 as fallback
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalCount: mockProducts.length,
        hasNextPage: false,
        hasPreviousPage: false,
      },
      message: "Products retrieved successfully (fallback data)"
    });
  }
}
