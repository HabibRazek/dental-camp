import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create categories
  const categories = [
    {
      name: 'Composite & Adhésif',
      description: 'Matériaux de restauration dentaire de haute qualité pour des soins esthétiques durables',
      slug: 'composite-adhesif',
      icon: 'heart',
      color: '#3B82F6',
      displayOrder: 1,
      metaTitle: 'Composite et Adhésif Dentaire - Dental Camp',
      metaDescription: 'Découvrez notre gamme de composites et adhésifs dentaires de qualité professionnelle'
    },
    {
      name: 'Instruments Dentaires',
      description: 'Instruments de précision en acier inoxydable pour tous vos besoins cliniques',
      slug: 'instruments',
      icon: 'scissors',
      color: '#60A5FA',
      displayOrder: 2,
      metaTitle: 'Instruments Dentaires Professionnels - Dental Camp',
      metaDescription: 'Large sélection d\'instruments dentaires de précision pour professionnels'
    },
    {
      name: 'Équipement Médical',
      description: 'Technologies avancées et équipements modernes pour votre cabinet dentaire',
      slug: 'equipement',
      icon: 'zap',
      color: '#93C5FD',
      displayOrder: 3,
      metaTitle: 'Équipement Médical Dentaire - Dental Camp',
      metaDescription: 'Équipements dentaires de pointe pour moderniser votre pratique'
    },
    {
      name: 'Stérilisation',
      description: 'Solutions complètes d\'hygiène et stérilisation pour un environnement sûr',
      slug: 'sterilisation',
      icon: 'shield',
      color: '#BFDBFE',
      displayOrder: 4,
      metaTitle: 'Matériel de Stérilisation - Dental Camp',
      metaDescription: 'Systèmes de stérilisation professionnels pour cabinets dentaires'
    },
    {
      name: 'Diagnostic',
      description: 'Outils de diagnostic de pointe pour des examens précis et détaillés',
      slug: 'diagnostic',
      icon: 'microscope',
      color: '#DBEAFE',
      displayOrder: 5,
      metaTitle: 'Outils de Diagnostic Dentaire - Dental Camp',
      metaDescription: 'Équipements de diagnostic avancés pour examens dentaires précis'
    },
    {
      name: 'Anesthésie',
      description: 'Produits anesthésiques et accessoires pour le confort de vos patients',
      slug: 'anesthesie',
      icon: 'syringe',
      color: '#EFF6FF',
      displayOrder: 6,
      metaTitle: 'Produits d\'Anesthésie Dentaire - Dental Camp',
      metaDescription: 'Gamme complète de produits anesthésiques pour soins dentaires'
    }
  ]

  console.log('📂 Creating categories...')
  const createdCategories = []
  for (const categoryData of categories) {
    const category = await prisma.category.upsert({
      where: { slug: categoryData.slug },
      update: categoryData,
      create: categoryData,
    })
    createdCategories.push(category)
    console.log(`✅ Created/Updated category: ${category.name}`)
  }

  // Create products
  const products = [
    {
      name: 'Composite Dentaire Premium Z350 XT',
      description: 'Composite universel nanoparticulaire pour restaurations esthétiques antérieures et postérieures. Excellente résistance à l\'usure et polissage exceptionnel.',
      sku: 'COMP-Z350-A2',
      slug: 'composite-z350-xt-a2',
      price: 269.99,
      comparePrice: 329.99,
      stockQuantity: 50,
      tags: ['composite', 'restauration', 'esthétique', 'nanoparticulaire'],
      status: 'PUBLISHED',
      isFeatured: true,
      categoryId: createdCategories[0].id,
      metaTitle: 'Composite Z350 XT - Restauration Esthétique',
      metaDescription: 'Composite dentaire premium pour restaurations durables et esthétiques'
    },
    {
      name: 'Kit Instruments Chirurgicaux Complet',
      description: 'Set professionnel de 15 instruments chirurgicaux en acier inoxydable. Comprend pinces, ciseaux, sondes et porte-aiguilles de qualité chirurgicale.',
      sku: 'INST-CHIR-15',
      slug: 'kit-instruments-chirurgicaux',
      price: 899.99,
      comparePrice: 1049.99,
      stockQuantity: 25,
      tags: ['instruments', 'chirurgie', 'acier', 'professionnel'],
      status: 'PUBLISHED',
      isFeatured: true,
      categoryId: createdCategories[1].id,
      metaTitle: 'Kit Instruments Chirurgicaux - Dental Camp',
      metaDescription: 'Set complet d\'instruments chirurgicaux professionnels en acier inoxydable'
    },
    {
      name: 'Lampe LED Polymérisation BlueLED',
      description: 'Lampe LED haute puissance 1200 mW/cm² pour polymérisation rapide et efficace. Batterie longue durée et design ergonomique.',
      sku: 'LED-BLUE-1200',
      slug: 'lampe-led-polymerisation',
      price: 599.99,
      comparePrice: 749.99,
      stockQuantity: 15,
      tags: ['led', 'polymérisation', 'lampe', 'batterie'],
      status: 'PUBLISHED',
      isFeatured: true,
      categoryId: createdCategories[2].id,
      metaTitle: 'Lampe LED Polymérisation - Dental Camp',
      metaDescription: 'Lampe LED professionnelle pour polymérisation rapide et efficace'
    },
    {
      name: 'Autoclave Classe B 18L',
      description: 'Autoclave professionnel classe B avec cycles pré-programmés. Stérilisation complète des instruments creux, poreux et emballés.',
      sku: 'AUTO-B18-PRO',
      slug: 'autoclave-classe-b-18l',
      price: 3899.99,
      comparePrice: 4499.99,
      stockQuantity: 8,
      tags: ['autoclave', 'stérilisation', 'classe-b', 'professionnel'],
      status: 'PUBLISHED',
      isFeatured: true,
      categoryId: createdCategories[3].id,
      metaTitle: 'Autoclave Classe B 18L - Dental Camp',
      metaDescription: 'Autoclave professionnel pour stérilisation complète des instruments'
    },
    {
      name: 'Caméra Intra-Orale HD',
      description: 'Caméra intra-orale haute définition avec éclairage LED intégré. Interface USB plug-and-play compatible avec tous logiciels.',
      sku: 'CAM-IO-HD-USB',
      slug: 'camera-intra-orale-hd',
      price: 2699.99,
      comparePrice: 3299.99,
      stockQuantity: 12,
      tags: ['caméra', 'diagnostic', 'intra-orale', 'hd'],
      status: 'PUBLISHED',
      isFeatured: false,
      categoryId: createdCategories[4].id,
      metaTitle: 'Caméra Intra-Orale HD - Dental Camp',
      metaDescription: 'Caméra haute définition pour diagnostic précis et documentation'
    },

    {
      name: 'Seringues Anesthésie Jetables (100 pcs)',
      description: 'Seringues jetables stériles pour anesthésie locale. Aiguille fine 27G, graduation précise, emballage individuel stérile.',
      sku: 'SER-ANES-27G-100',
      slug: 'seringues-anesthesie-jetables',
      price: 74.99,
      comparePrice: 89.99,
      stockQuantity: 200,
      tags: ['seringues', 'anesthésie', 'jetables', 'stériles'],
      status: 'PUBLISHED',
      isFeatured: false,
      categoryId: createdCategories[5].id,
      metaTitle: 'Seringues Anesthésie Jetables - Dental Camp',
      metaDescription: 'Seringues jetables stériles pour anesthésie locale dentaire'
    }
  ]

  console.log('🦷 Creating products...')
  for (const productData of products) {
    const product = await prisma.product.upsert({
      where: { sku: productData.sku },
      update: {
        ...productData,
        publishedAt: new Date()
      },
      create: {
        ...productData,
        publishedAt: new Date()
      },
    })
    console.log(`✅ Created/Updated product: ${product.name}`)
  }

  console.log('🎉 Database seeding completed successfully!')
  console.log(`📊 Created ${createdCategories.length} categories and ${products.length} products`)
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
