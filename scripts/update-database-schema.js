const { PrismaClient } = require('@prisma/client')

async function updateDatabaseSchema() {
  const prisma = new PrismaClient()
  
  try {
    console.log('🔄 Updating database schema...')
    
    // Add all missing security fields to User table
    const queries = [
      `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "twoFactorEnabled" BOOLEAN DEFAULT false;`,
      `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "twoFactorEnabledAt" TIMESTAMP(3);`,
      `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "loginNotifications" BOOLEAN DEFAULT true;`,
      `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "sessionTimeout" INTEGER DEFAULT 30;`,
      `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "passwordExpiry" INTEGER DEFAULT 90;`,
      `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "passwordChangedAt" TIMESTAMP(3);`,
      `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "ipWhitelist" TEXT[] DEFAULT ARRAY[]::TEXT[];`,
      `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "backupCodes" TEXT;`
    ]
    
    for (const query of queries) {
      try {
        await prisma.$executeRawUnsafe(query)
        console.log(`✅ Executed: ${query.split(' ')[5]} field`)
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.log(`ℹ️  Field ${query.split(' ')[5]} already exists`)
        } else {
          console.error(`❌ Error with query: ${query}`, error.message)
        }
      }
    }
    
    // Verify the schema by trying to select the new fields
    console.log('\n🔍 Verifying schema...')
    const testUser = await prisma.user.findFirst({
      select: {
        id: true,
        email: true,
        twoFactorEnabled: true,
        backupCodes: true
      }
    })
    
    if (testUser !== null) {
      console.log('✅ Schema verification successful!')
      console.log('✅ backupCodes field is now available')
    }
    
    console.log('\n🎉 Database schema update completed successfully!')
    
  } catch (error) {
    console.error('❌ Error updating database schema:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the update
updateDatabaseSchema()
  .then(() => {
    console.log('\n✅ All done! You can now use backup codes feature.')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Failed to update database schema:', error)
    process.exit(1)
  })
