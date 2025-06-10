const { PrismaClient } = require('@prisma/client')

async function addBackupCodesField() {
  const prisma = new PrismaClient()
  
  try {
    console.log('Adding backupCodes field to User table...')
    
    // Try to add the column using raw SQL
    await prisma.$executeRaw`
      ALTER TABLE "User" 
      ADD COLUMN IF NOT EXISTS "backupCodes" TEXT;
    `
    
    console.log('✅ Successfully added backupCodes field')
    
    // Also add other security fields if they don't exist
    await prisma.$executeRaw`
      ALTER TABLE "User" 
      ADD COLUMN IF NOT EXISTS "twoFactorEnabled" BOOLEAN DEFAULT false;
    `
    
    await prisma.$executeRaw`
      ALTER TABLE "User" 
      ADD COLUMN IF NOT EXISTS "twoFactorEnabledAt" TIMESTAMP(3);
    `
    
    await prisma.$executeRaw`
      ALTER TABLE "User" 
      ADD COLUMN IF NOT EXISTS "loginNotifications" BOOLEAN DEFAULT true;
    `
    
    await prisma.$executeRaw`
      ALTER TABLE "User" 
      ADD COLUMN IF NOT EXISTS "sessionTimeout" INTEGER DEFAULT 30;
    `
    
    await prisma.$executeRaw`
      ALTER TABLE "User" 
      ADD COLUMN IF NOT EXISTS "passwordExpiry" INTEGER DEFAULT 90;
    `
    
    await prisma.$executeRaw`
      ALTER TABLE "User" 
      ADD COLUMN IF NOT EXISTS "passwordChangedAt" TIMESTAMP(3);
    `
    
    await prisma.$executeRaw`
      ALTER TABLE "User" 
      ADD COLUMN IF NOT EXISTS "ipWhitelist" TEXT[] DEFAULT ARRAY[]::TEXT[];
    `
    
    console.log('✅ Successfully added all security fields')
    
  } catch (error) {
    console.error('❌ Error adding fields:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addBackupCodesField()
