import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding categories...')

  const categories = [
    {
      name: 'Dental Equipment',
      description: 'Professional dental equipment and machinery',
      slug: 'dental-equipment',
    },
    {
      name: 'Instruments',
      description: 'Dental instruments and hand tools',
      slug: 'instruments',
    },
    {
      name: 'Consumables',
      description: 'Disposable dental supplies and materials',
      slug: 'consumables',
    },
    {
      name: 'Orthodontics',
      description: 'Orthodontic supplies and equipment',
      slug: 'orthodontics',
    },
    {
      name: 'Endodontics',
      description: 'Root canal and endodontic supplies',
      slug: 'endodontics',
    },
    {
      name: 'Periodontics',
      description: 'Periodontal and gum care products',
      slug: 'periodontics',
    },
    {
      name: 'Prosthetics',
      description: 'Dental prosthetics and restoration materials',
      slug: 'prosthetics',
    },
    {
      name: 'Imaging',
      description: 'X-ray and imaging equipment',
      slug: 'imaging',
    },
  ]

  for (const category of categories) {
    const existingCategory = await prisma.category.findUnique({
      where: { slug: category.slug }
    })

    if (!existingCategory) {
      await prisma.category.create({
        data: category
      })
      console.log(`Created category: ${category.name}`)
    } else {
      console.log(`Category already exists: ${category.name}`)
    }
  }

  console.log('Categories seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
