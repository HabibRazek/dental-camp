const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkUsers() {
  try {
    console.log('🔍 Checking users in database...')
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        password: true,
        createdAt: true
      }
    })

    console.log(`\n📊 Found ${users.length} users:`)
    
    users.forEach((user, index) => {
      console.log(`\n${index + 1}. User: ${user.email}`)
      console.log(`   Name: ${user.name}`)
      console.log(`   Role: ${user.role}`)
      console.log(`   Active: ${user.isActive}`)
      console.log(`   Has Password: ${user.password ? 'YES' : 'NO'}`)
      console.log(`   Password Hash: ${user.password ? user.password.substring(0, 20) + '...' : 'None'}`)
      console.log(`   Created: ${user.createdAt}`)
    })

    console.log('\n✅ User check complete!')
    
  } catch (error) {
    console.error('❌ Error checking users:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkUsers()
