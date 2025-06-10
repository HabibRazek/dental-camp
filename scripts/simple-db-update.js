const { PrismaClient } = require('@prisma/client')

async function simpleUpdate() {
  const prisma = new PrismaClient()
  
  try {
    console.log('Testing database connection...')
    
    // Test basic connection
    const userCount = await prisma.user.count()
    console.log(`✅ Connected! Found ${userCount} users in database`)
    
    // Try to add the backupCodes field
    console.log('Adding backupCodes field...')
    await prisma.$executeRaw`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "backupCodes" TEXT;`
    console.log('✅ backupCodes field added successfully!')
    
    // Test if we can now query the field
    const user = await prisma.user.findFirst({
      select: {
        id: true,
        email: true,
        backupCodes: true
      }
    })
    
    console.log('✅ Field verification successful!')
    console.log('🎉 Backup codes feature is now ready!')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

simpleUpdate()
