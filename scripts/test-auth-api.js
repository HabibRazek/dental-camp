const fetch = require('node-fetch')

async function testAuthAPI() {
  try {
    console.log('🔐 Testing NextAuth API...')
    
    // Test credentials
    const testCredentials = [
      { email: 'admin@example.com', password: 'admin123456' },
      { email: 'admin@dental-camp.com', password: 'admin123' },
      { email: 'wrong@email.com', password: 'wrongpassword' },
    ]

    for (const creds of testCredentials) {
      console.log(`\n🧪 Testing login for: ${creds.email}`)
      
      try {
        // Simulate the signin request
        const response = await fetch('http://localhost:3000/api/auth/callback/credentials', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            email: creds.email,
            password: creds.password,
            csrfToken: 'test-token', // In real app, this would be fetched
            callbackUrl: 'http://localhost:3000/auth/success',
            json: 'true'
          })
        })

        console.log(`   Response status: ${response.status}`)
        
        if (response.ok) {
          const data = await response.text()
          console.log(`   ✅ Login SUCCESS`)
          console.log(`   Response: ${data.substring(0, 100)}...`)
        } else {
          const error = await response.text()
          console.log(`   ❌ Login FAILED`)
          console.log(`   Error: ${error.substring(0, 100)}...`)
        }
        
      } catch (error) {
        console.log(`   ❌ Request ERROR: ${error.message}`)
      }
    }

    console.log('\n✅ Auth API test complete!')
    
  } catch (error) {
    console.error('❌ Error testing auth API:', error)
  }
}

testAuthAPI()
