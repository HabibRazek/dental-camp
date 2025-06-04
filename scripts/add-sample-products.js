const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function addSampleProducts() {
  try {
    console.log('🏗️ Starting to add sample products...')
    
    // Get categories first
    const categories = await prisma.category.findMany()
    console.log(`📂 Found ${categories.length} categories`)
    
    if (categories.length === 0) {
      console.log('❌ No categories found. Please add categories first.')
      return
    }

    const sampleProducts = [
      {
        name: "Miroir Dentaire Professionnel",
        description: "Miroir dentaire haute qualité avec manche ergonomique pour examens précis",
        sku: "MIR-001",
        slug: "miroir-dentaire-professionnel",
        price: 25.50,
        stockQuantity: 50,
        lowStockThreshold: 10,
        categoryId: categories.find(c => c.slug === 'instrumentation-dentaire')?.id,
        status: "PUBLISHED",
        isActive: true,
        isFeatured: true,
        images: ["/images/dental-mirror.jpg"],
        thumbnail: "/images/dental-mirror.jpg"
      },
      {
        name: "Alginate Premium pour Empreintes",
        description: "Alginate de haute qualité pour prises d'empreintes dentaires précises et durables",
        sku: "ALG-001",
        slug: "alginate-premium-empreintes",
        price: 45.00,
        stockQuantity: 30,
        lowStockThreshold: 5,
        categoryId: categories.find(c => c.slug === 'empreinte-dentaire')?.id,
        status: "PUBLISHED",
        isActive: true,
        isFeatured: true,
        images: ["/images/alginate.jpg"],
        thumbnail: "/images/alginate.jpg"
      },
      {
        name: "Composite Universel A2",
        description: "Composite dentaire universel teinte A2 pour restaurations esthétiques",
        sku: "COMP-A2-001",
        slug: "composite-universel-a2",
        price: 85.00,
        stockQuantity: 25,
        lowStockThreshold: 5,
        categoryId: categories.find(c => c.slug === 'composite-adhesif')?.id,
        status: "PUBLISHED",
        isActive: true,
        isFeatured: false,
        images: ["/images/composite.jpg"],
        thumbnail: "/images/composite.jpg"
      },
      {
        name: "Fraise Diamantée Ronde",
        description: "Fraise diamantée ronde pour préparations cavitaires précises",
        sku: "FR-DIA-001",
        slug: "fraise-diamantee-ronde",
        price: 15.75,
        stockQuantity: 100,
        lowStockThreshold: 20,
        categoryId: categories.find(c => c.slug === 'fraises-polissage-dentaire')?.id,
        status: "PUBLISHED",
        isActive: true,
        isFeatured: false,
        images: ["/images/diamond-bur.jpg"],
        thumbnail: "/images/diamond-bur.jpg"
      },
      {
        name: "Adhésif Dentaire Universal",
        description: "Système adhésif universel pour collage de restaurations",
        sku: "ADH-UNI-001",
        slug: "adhesif-dentaire-universal",
        price: 120.00,
        stockQuantity: 15,
        lowStockThreshold: 3,
        categoryId: categories.find(c => c.slug === 'scellement-collage')?.id,
        status: "PUBLISHED",
        isActive: true,
        isFeatured: true,
        images: ["/images/adhesive.jpg"],
        thumbnail: "/images/adhesive.jpg"
      },
      {
        name: "Sonde Dentaire Droite",
        description: "Sonde dentaire droite pour exploration et diagnostic",
        sku: "SON-001",
        slug: "sonde-dentaire-droite",
        price: 18.50,
        stockQuantity: 75,
        lowStockThreshold: 15,
        categoryId: categories.find(c => c.slug === 'instrumentation-dentaire')?.id,
        status: "PUBLISHED",
        isActive: true,
        isFeatured: false,
        images: ["/images/dental-probe.jpg"],
        thumbnail: "/images/dental-probe.jpg"
      },
      {
        name: "Kit Polissage Composite",
        description: "Kit complet de polissage pour finitions de composites",
        sku: "POL-KIT-001",
        slug: "kit-polissage-composite",
        price: 65.00,
        stockQuantity: 20,
        lowStockThreshold: 5,
        categoryId: categories.find(c => c.slug === 'fraises-polissage-dentaire')?.id,
        status: "PUBLISHED",
        isActive: true,
        isFeatured: true,
        images: ["/images/polishing-kit.jpg"],
        thumbnail: "/images/polishing-kit.jpg"
      },
      {
        name: "Silicone d'Empreinte Addition",
        description: "Silicone d'addition pour empreintes de précision",
        sku: "SIL-ADD-001",
        slug: "silicone-empreinte-addition",
        price: 95.00,
        stockQuantity: 12,
        lowStockThreshold: 3,
        categoryId: categories.find(c => c.slug === 'empreinte-dentaire')?.id,
        status: "PUBLISHED",
        isActive: true,
        isFeatured: false,
        images: ["/images/silicone.jpg"],
        thumbnail: "/images/silicone.jpg"
      }
    ]

    for (const product of sampleProducts) {
      console.log(`📦 Adding product: ${product.name}`)
      
      const existingProduct = await prisma.product.findUnique({
        where: { sku: product.sku }
      })
      
      if (existingProduct) {
        console.log(`⚠️ Product ${product.name} already exists, skipping...`)
        continue
      }

      await prisma.product.create({
        data: product
      })
      console.log(`✅ Product ${product.name} created successfully`)
    }
    
    console.log('🎉 All sample products added successfully!')
    
    // Display summary
    const totalProducts = await prisma.product.count()
    console.log(`\n📊 Total products in database: ${totalProducts}`)
    
    const productsByCategory = await prisma.product.groupBy({
      by: ['categoryId'],
      _count: {
        id: true
      }
    })
    
    console.log('\n📋 Products by category:')
    for (const group of productsByCategory) {
      const category = categories.find(c => c.id === group.categoryId)
      console.log(`- ${category?.name || 'Uncategorized'}: ${group._count.id} products`)
    }
    
  } catch (error) {
    console.error('❌ Error adding sample products:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addSampleProducts()
