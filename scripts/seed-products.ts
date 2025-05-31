import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding products...')

  // First, ensure categories exist
  const categories = await prisma.category.findMany()
  if (categories.length === 0) {
    console.log('No categories found. Please run seed-categories.ts first.')
    return
  }

  const equipmentCategory = categories.find(c => c.slug === 'dental-equipment')
  const instrumentsCategory = categories.find(c => c.slug === 'instruments')
  const consumablesCategory = categories.find(c => c.slug === 'consumables')
  const imagingCategory = categories.find(c => c.slug === 'imaging')

  const products = [
    {
      name: 'Premium Dental Chair Unit',
      description: 'Ergonomic design with programmable positions and integrated delivery system. Features LED lighting, seamless upholstery, and advanced patient comfort systems.',
      sku: 'DCU-001',
      slug: 'premium-dental-chair-unit',
      price: 4899.99,
      comparePrice: 5499.99,
      stockQuantity: 15,
      lowStockThreshold: 5,
      trackQuantity: true,
      weight: 150.5,
      images: ['/images/dental-equipment.jpg'],
      thumbnail: '/images/dental-equipment.jpg',
      tags: ['programmable', 'LED lighting', 'ergonomic', 'premium'],
      status: 'PUBLISHED',
      isActive: true,
      isFeatured: true,
      categoryId: equipmentCategory?.id,
      metaTitle: 'Premium Dental Chair Unit - Professional Dental Equipment',
      metaDescription: 'High-quality dental chair with programmable positions, LED lighting, and ergonomic design for optimal patient comfort.',
    },
    {
      name: 'Advanced Digital X-Ray System',
      description: 'High-resolution imaging with reduced radiation exposure and instant results. Perfect for modern dental practices focused on patient safety and diagnostic precision.',
      sku: 'DXR-002',
      slug: 'advanced-digital-xray-system',
      price: 12499.99,
      comparePrice: 13999.99,
      stockQuantity: 8,
      lowStockThreshold: 3,
      trackQuantity: true,
      weight: 85.0,
      images: ['/images/dental-equipment.jpg'],
      thumbnail: '/images/dental-equipment.jpg',
      tags: ['digital', 'low radiation', 'HD imaging', 'instant results'],
      status: 'PUBLISHED',
      isActive: true,
      isFeatured: true,
      categoryId: imagingCategory?.id,
      metaTitle: 'Advanced Digital X-Ray System - Dental Imaging Equipment',
      metaDescription: 'State-of-the-art digital X-ray system with reduced radiation and instant high-resolution imaging.',
    },
    {
      name: 'Class B Autoclave Sterilizer',
      description: 'Medical-grade sterilization with multiple cycles for all instrument types. 23L capacity with LCD display and automatic cycle selection.',
      sku: 'ACS-003',
      slug: 'class-b-autoclave-sterilizer',
      price: 3299.99,
      stockQuantity: 25,
      lowStockThreshold: 10,
      trackQuantity: true,
      weight: 45.2,
      images: ['/images/dental-equipment.jpg'],
      thumbnail: '/images/dental-equipment.jpg',
      tags: ['sterilization', 'medical grade', '23L capacity', 'LCD display'],
      status: 'PUBLISHED',
      isActive: true,
      isFeatured: false,
      categoryId: equipmentCategory?.id,
      metaTitle: 'Class B Autoclave Sterilizer - Medical Grade Sterilization',
      metaDescription: 'Professional autoclave sterilizer with multiple cycles and 23L capacity for complete instrument sterilization.',
    },
    {
      name: 'Surgical Instrument Kit',
      description: 'Complete set of surgical-grade stainless steel instruments for various procedures. Includes forceps, elevators, and specialized tools.',
      sku: 'SIK-004',
      slug: 'surgical-instrument-kit',
      price: 899.99,
      stockQuantity: 50,
      lowStockThreshold: 15,
      trackQuantity: true,
      weight: 2.5,
      images: ['/images/dental-equipment.jpg'],
      thumbnail: '/images/dental-equipment.jpg',
      tags: ['surgical steel', 'complete set', 'autoclavable', 'professional'],
      status: 'PUBLISHED',
      isActive: true,
      isFeatured: false,
      categoryId: instrumentsCategory?.id,
      metaTitle: 'Surgical Instrument Kit - Professional Dental Instruments',
      metaDescription: 'Complete surgical-grade stainless steel instrument kit for dental procedures.',
    },
    {
      name: 'LED Dental Operatory Light',
      description: 'Shadow-free illumination with adjustable intensity and color temperature. No-touch controls and 5-year warranty included.',
      sku: 'DOL-005',
      slug: 'led-dental-operatory-light',
      price: 2199.99,
      comparePrice: 2499.99,
      stockQuantity: 20,
      lowStockThreshold: 8,
      trackQuantity: true,
      weight: 12.8,
      images: ['/images/dental-equipment.jpg'],
      thumbnail: '/images/dental-equipment.jpg',
      tags: ['LED', 'shadow-free', 'adjustable intensity', 'no-touch controls'],
      status: 'PUBLISHED',
      isActive: true,
      isFeatured: true,
      categoryId: equipmentCategory?.id,
      metaTitle: 'LED Dental Operatory Light - Professional Dental Lighting',
      metaDescription: 'Advanced LED operatory light with shadow-free illumination and adjustable settings.',
    },
    {
      name: 'Premium Composite Resin Kit',
      description: 'Universal shade composite system for anterior and posterior restorations. 16 shades with high polishability and low shrinkage.',
      sku: 'CRK-006',
      slug: 'premium-composite-resin-kit',
      price: 149.99,
      stockQuantity: 100,
      lowStockThreshold: 25,
      trackQuantity: true,
      weight: 0.8,
      images: ['/images/dental-equipment.jpg'],
      thumbnail: '/images/dental-equipment.jpg',
      tags: ['16 shades', 'universal', 'high polish', 'low shrinkage'],
      status: 'PUBLISHED',
      isActive: true,
      isFeatured: true,
      categoryId: consumablesCategory?.id,
      metaTitle: 'Premium Composite Resin Kit - Dental Restoration Materials',
      metaDescription: 'Universal composite resin system with 16 shades for all restoration needs.',
    },
    {
      name: 'Ultrasonic Scaler Pro',
      description: 'Professional ultrasonic scaler with multiple tip options and adjustable power settings. Ideal for periodontal therapy and prophylaxis.',
      sku: 'USP-007',
      slug: 'ultrasonic-scaler-pro',
      price: 1899.99,
      stockQuantity: 30,
      lowStockThreshold: 10,
      trackQuantity: true,
      weight: 3.2,
      images: ['/images/dental-equipment.jpg'],
      thumbnail: '/images/dental-equipment.jpg',
      tags: ['ultrasonic', 'multiple tips', 'adjustable power', 'periodontal'],
      status: 'PUBLISHED',
      isActive: true,
      isFeatured: false,
      categoryId: equipmentCategory?.id,
      metaTitle: 'Ultrasonic Scaler Pro - Professional Dental Scaling',
      metaDescription: 'Advanced ultrasonic scaler with multiple tips and adjustable power for periodontal therapy.',
    },
    {
      name: 'Digital Impression Scanner',
      description: 'Intraoral scanner for precise digital impressions. Fast scanning speed with high accuracy and seamless CAD/CAM integration.',
      sku: 'DIS-008',
      slug: 'digital-impression-scanner',
      price: 18999.99,
      comparePrice: 21999.99,
      stockQuantity: 5,
      lowStockThreshold: 2,
      trackQuantity: true,
      weight: 1.8,
      images: ['/images/dental-equipment.jpg'],
      thumbnail: '/images/dental-equipment.jpg',
      tags: ['digital impressions', 'intraoral', 'CAD/CAM', 'high accuracy'],
      status: 'PUBLISHED',
      isActive: true,
      isFeatured: true,
      categoryId: imagingCategory?.id,
      metaTitle: 'Digital Impression Scanner - Intraoral Scanning Technology',
      metaDescription: 'Professional intraoral scanner for precise digital impressions and CAD/CAM integration.',
    },
  ]

  for (const product of products) {
    const existingProduct = await prisma.product.findUnique({
      where: { sku: product.sku }
    })

    if (!existingProduct) {
      const { categoryId, status, ...productData } = product;
      await prisma.product.create({
        data: {
          ...productData,
          status: status as "DRAFT" | "PUBLISHED" | "ARCHIVED",
          publishedAt: new Date(),
          ...(categoryId && {
            category: {
              connect: { id: categoryId }
            }
          })
        }
      })
      console.log(`Created product: ${product.name}`)
    } else {
      console.log(`Product already exists: ${product.name}`)
    }
  }

  console.log('Products seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
