const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function testLogin() {
  try {
    console.log('🔐 Testing login functionality...')
    
    // Test users with passwords
    const testCases = [
      { email: 'admin@example.com', password: 'admin123456' },
      { email: 'admin@dental-camp.com', password: 'admin123' },
      { email: 'habibrazeg23@gmail.com', password: 'password123' }, // Common password
      { email: 'ghaithslama26@gmail.com', password: 'password123' }, // Common password
    ]

    for (const testCase of testCases) {
      console.log(`\n🧪 Testing login for: ${testCase.email}`)
      
      // Get user from database
      const user = await prisma.user.findUnique({
        where: { email: testCase.email },
        select: {
          id: true,
          name: true,
          email: true,
          password: true,
          role: true,
          isActive: true
        }
      })

      if (!user) {
        console.log(`   ❌ User not found`)
        continue
      }

      if (!user.password) {
        console.log(`   ❌ User has no password (OAuth user)`)
        continue
      }

      if (!user.isActive) {
        console.log(`   ❌ User account is disabled`)
        continue
      }

      // Test password
      const isValidPassword = await bcrypt.compare(testCase.password, user.password)
      
      if (isValidPassword) {
        console.log(`   ✅ Login SUCCESS - Password matches!`)
        console.log(`      User: ${user.name} (${user.role})`)
      } else {
        console.log(`   ❌ Login FAILED - Password does not match`)
        console.log(`      Stored hash: ${user.password.substring(0, 30)}...`)
      }
    }

    console.log('\n🔍 Checking all users with passwords...')
    
    const usersWithPasswords = await prisma.user.findMany({
      where: {
        password: {
          not: null
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    })

    console.log(`\n📊 Found ${usersWithPasswords.length} users with passwords:`)
    
    usersWithPasswords.forEach((user, index) => {
      console.log(`\n${index + 1}. ${user.email}`)
      console.log(`   Name: ${user.name}`)
      console.log(`   Role: ${user.role}`)
      console.log(`   Active: ${user.isActive}`)
      console.log(`   Hash: ${user.password.substring(0, 30)}...`)
      console.log(`   Created: ${user.createdAt}`)
    })

    console.log('\n✅ Login test complete!')
    
  } catch (error) {
    console.error('❌ Error testing login:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testLogin()
