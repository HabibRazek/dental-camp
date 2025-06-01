// Environment variables validation for production
export function validateEnvironment() {
  const requiredEnvVars = [
    'AUTH_SECRET',
    'DATABASE_URL',
    'NEXTAUTH_URL',
  ]

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName])

  if (missingVars.length > 0) {
    console.error('Missing required environment variables:', missingVars)
    throw new Error(`Missing environment variables: ${missingVars.join(', ')}`)
  }

  // Log environment info (without sensitive data)
  console.log('Environment check passed')
  console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL)
  console.log('NODE_ENV:', process.env.NODE_ENV)
}

// Auto-validate on import in production
if (process.env.NODE_ENV === 'production') {
  validateEnvironment()
}
