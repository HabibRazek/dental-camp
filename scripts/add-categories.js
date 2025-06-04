const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const categories = [
  {
    name: "Instrumentation Dentaire",
    description: "Instruments dentaires professionnels pour tous types de soins",
    slug: "instrumentation-dentaire",
    icon: "🦷",
    color: "#3B82F6",
    metaTitle: "Instrumentation Dentaire - Dental Camp",
    metaDescription: "Découvrez notre gamme complète d'instruments dentaires professionnels",
    displayOrder: 1
  },
  {
    name: "Empreinte Dentaire",
    description: "Matériaux et équipements pour prises d'empreintes dentaires",
    slug: "empreinte-dentaire",
    icon: "📋",
    color: "#10B981",
    metaTitle: "Empreinte Dentaire - Dental Camp",
    metaDescription: "Matériaux de qualité pour prises d'empreintes dentaires précises",
    displayOrder: 2
  },
  {
    name: "Composite & Adhésif",
    description: "Composites dentaires et systèmes adhésifs de haute qualité",
    slug: "composite-adhesif",
    icon: "🧪",
    color: "#8B5CF6",
    metaTitle: "Composite & Adhésif - Dental Camp",
    metaDescription: "Composites et adhésifs dentaires pour restaurations esthétiques",
    displayOrder: 3
  },
  {
    name: "Fraises & Polissage Dentaire",
    description: "Fraises dentaires et instruments de polissage professionnels",
    slug: "fraises-polissage-dentaire",
    icon: "⚙️",
    color: "#F59E0B",
    metaTitle: "Fraises & Polissage Dentaire - Dental Camp",
    metaDescription: "Fraises et outils de polissage dentaire de précision",
    displayOrder: 4
  },
  {
    name: "Scellement & Collage",
    description: "Produits de scellement et matériaux de collage dentaire",
    slug: "scellement-collage",
    icon: "🔗",
    color: "#EF4444",
    metaTitle: "Scellement & Collage - Dental Camp",
    metaDescription: "Solutions de scellement et collage pour soins dentaires",
    displayOrder: 5
  }
]

async function addCategories() {
  try {
    console.log('🏗️ Starting to add categories...')
    
    for (const category of categories) {
      console.log(`📂 Adding category: ${category.name}`)
      
      const existingCategory = await prisma.category.findUnique({
        where: { slug: category.slug }
      })
      
      if (existingCategory) {
        console.log(`⚠️ Category ${category.name} already exists, updating...`)
        await prisma.category.update({
          where: { slug: category.slug },
          data: category
        })
      } else {
        await prisma.category.create({
          data: category
        })
        console.log(`✅ Category ${category.name} created successfully`)
      }
    }
    
    console.log('🎉 All categories added successfully!')
    
    // Display all categories
    const allCategories = await prisma.category.findMany({
      orderBy: { displayOrder: 'asc' }
    })
    
    console.log('\n📋 Current categories in database:')
    allCategories.forEach((cat, index) => {
      console.log(`${index + 1}. ${cat.name} (${cat.slug})`)
    })
    
  } catch (error) {
    console.error('❌ Error adding categories:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addCategories()
