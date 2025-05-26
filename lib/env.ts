// Environment variable validation
export function validateEnv() {
  const requiredEnvVars = [
    'DATABASE_URL',
    'AUTH_SECRET',
  ]

  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  )

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`
    )
  }
}

// Only validate in production or when explicitly requested
if (process.env.NODE_ENV === 'production' || process.env.VALIDATE_ENV === 'true') {
  validateEnv()
}
