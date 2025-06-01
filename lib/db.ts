import { prisma } from "./prisma"
import { saltAndHashPassword } from "./password"

/**
 * Get user from database by email and verify password
 * @param email - User email
 * @param password - Plain text password
 * @returns User object if credentials are valid, null otherwise
 */
export async function getUserFromDb(email: string, plainPassword: string) {
  try {
    let user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        image: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    })

    // If user doesn't exist, create a new one automatically
    if (!user) {
      // Import bcrypt here to avoid issues with edge runtime
      const bcrypt = await import("bcryptjs")
      const hashedPassword = await bcrypt.hash(plainPassword, 12)

      user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: email.split('@')[0], // Use part before @ as name
          isActive: true,
          emailVerified: new Date(), // Auto-verify new users
        },
        select: {
          id: true,
          name: true,
          email: true,
          password: true,
          image: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
      })

      console.log(`✅ New user created successfully: ${email}`)

      // Return user without password
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
        createdAt: user.createdAt,
      }
    }

    // If user exists but has no password (OAuth user), set password
    if (!user.password) {
      console.log(`🔑 Setting password for existing OAuth user: ${email}`)

      const bcrypt = await import("bcryptjs")
      const hashedPassword = await bcrypt.hash(plainPassword, 12)

      user = await prisma.user.update({
        where: { email },
        data: { password: hashedPassword },
        select: {
          id: true,
          name: true,
          email: true,
          password: true,
          image: true,
          isActive: true,
          createdAt: true,
        },
      })

    }

    // Check if user account is disabled
    if (!user.isActive) {
      return null
    }

    // Import bcrypt here to avoid issues with edge runtime
    const bcrypt = await import("bcryptjs")
    const isValidPassword = await bcrypt.compare(plainPassword, user.password!)

    if (!isValidPassword) {
      return null
    }

    // Return user without password
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      role: user.role,
      createdAt: user.createdAt,
    }
  } catch (error) {
    return null
  }
}

/**
 * Create a new user in the database
 * @param name - User name
 * @param email - User email
 * @param password - Plain text password
 * @returns Created user object without password
 */
export async function createUser(name: string, email: string, password: string) {
  try {
    const hashedPassword = await saltAndHashPassword(password)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
      },
    })

    return user
  } catch (error) {
    throw error
  }
}

/**
 * Check if user exists by email
 * @param email - User email
 * @returns Boolean indicating if user exists
 */
export async function userExists(email: string): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    })
    return !!user
  } catch (error) {
    return false
  }
}

/**
 * Get all users from the database
 * @param page - Page number for pagination (optional)
 * @param limit - Number of users per page (optional)
 * @param search - Search query (optional)
 * @returns Array of users with pagination info
 */
export async function getAllUsers(page: number = 1, limit: number = 10, search?: string) {
  try {
    const skip = (page - 1) * limit

    // Test database connection first
    try {
      await prisma.$connect()
    } catch (dbError) {
      throw new Error("Database connection failed")
    }

    // Build search conditions
    const searchConditions = search ? {
      OR: [
        {
          name: {
            contains: search,
            mode: 'insensitive' as const
          }
        },
        {
          email: {
            contains: search,
            mode: 'insensitive' as const
          }
        },
        // Search by status
        ...(search.toLowerCase().includes('active') ? [{ isActive: true }] : []),
        ...(search.toLowerCase().includes('disabled') || search.toLowerCase().includes('inactive') ? [{ isActive: false }] : []),
        // Search by verification status
        ...(search.toLowerCase().includes('verified') ? [{ emailVerified: { not: null } }] : []),
        ...(search.toLowerCase().includes('unverified') ? [{ emailVerified: null }] : []),
        // Search by auth provider
        ...(search.toLowerCase().includes('google') ? [{
          accounts: {
            some: {
              provider: 'google'
            }
          }
        }] : []),
        ...(search.toLowerCase().includes('email') || search.toLowerCase().includes('credential') ? [{
          accounts: {
            none: {}
          }
        }] : [])
      ]
    } : {}

    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where: searchConditions,
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          emailVerified: true,
          isActive: true,
          accounts: {
            select: {
              provider: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.user.count({
        where: searchConditions
      }),
    ])

    const totalPages = Math.ceil(totalCount / limit) || 1

    return {
      users,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    }
  } catch (error) {
    // Return empty result instead of throwing to prevent page crash
    return {
      users: [],
      pagination: {
        currentPage: page,
        totalPages: 1,
        totalCount: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    }
  }
}

/**
 * Toggle user active status (enable/disable)
 * @param userId - User ID
 * @param isActive - New active status
 * @returns Updated user object
 */
export async function toggleUserStatus(userId: string, isActive: boolean) {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { isActive },
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
        updatedAt: true,
      },
    })

    return user
  } catch (error) {
    throw error
  }
}

/**
 * Update user email verification status
 * @param userId - User ID
 * @param emailVerified - Verification date or null
 * @returns Updated user object
 */
export async function updateEmailVerification(userId: string, emailVerified: Date | null) {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { emailVerified },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        updatedAt: true,
      },
    })

    return user
  } catch (error) {
    throw error
  }
}

/**
 * Generate and save verification code
 * @param email - User email
 * @param userId - User ID (optional)
 * @returns Verification code
 */
export async function generateVerificationCode(email: string, userId?: string) {
  try {
    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString()

    // Set expiration to 15 minutes from now
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000)

    // Delete any existing unused codes for this email
    await prisma.verificationCode.deleteMany({
      where: {
        email,
        used: false,
      },
    })

    // Create new verification code
    const verificationCode = await prisma.verificationCode.create({
      data: {
        code,
        email,
        userId,
        expiresAt,
        type: 'email_verification',
      },
    })

    return { code, id: verificationCode.id }
  } catch (error) {
    throw error
  }
}

/**
 * Verify email with code
 * @param email - User email
 * @param code - Verification code
 * @returns Verification result
 */
export async function verifyEmailWithCode(email: string, code: string) {
  try {
    // Find the verification code
    const verificationCode = await prisma.verificationCode.findFirst({
      where: {
        email,
        code,
        used: false,
        expiresAt: {
          gt: new Date(),
        },
      },
    })

    if (!verificationCode) {
      return { success: false, error: 'Invalid or expired verification code' }
    }

    // Mark code as used
    await prisma.verificationCode.update({
      where: { id: verificationCode.id },
      data: { used: true },
    })

    // Update user email verification
    const user = await prisma.user.update({
      where: { email },
      data: { emailVerified: new Date() },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
      },
    })

    return { success: true, user }
  } catch (error) {
    return { success: false, error: 'Verification failed' }
  }
}

/**
 * Delete user from database
 * @param userId - User ID to delete
 * @returns Success status
 */
export async function deleteUser(userId: string) {
  try {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
      },
    })

    if (!existingUser) {
      return { success: false, error: 'User not found' }
    }

    // Delete the user (this will cascade delete related records due to Prisma schema)
    await prisma.user.delete({
      where: { id: userId },
    })

    return {
      success: true,
      message: 'User deleted successfully',
      deletedUser: existingUser
    }
  } catch (error) {
    return { success: false, error: 'Failed to delete user' }
  }
}

/**
 * Create sample users for testing (development only)
 * @returns Success status
 */
export async function createSampleUsers() {
  try {
    const sampleUsers = [
      {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
        emailVerified: new Date(),
        isActive: true,
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        password: "password123",
        emailVerified: null,
        isActive: true,
      },
      {
        name: "Bob Wilson",
        email: "bob@example.com",
        password: "password123",
        emailVerified: new Date(),
        isActive: false,
      },
      {
        name: "Alice Johnson",
        email: "alice@example.com",
        password: "password123",
        emailVerified: new Date(),
        isActive: true,
      },
      {
        name: "Charlie Brown",
        email: "charlie@example.com",
        password: "password123",
        emailVerified: null,
        isActive: true,
      },
      {
        name: "Diana Prince",
        email: "diana@example.com",
        password: "password123",
        emailVerified: new Date(),
        isActive: true,
      },
      {
        name: "Edward Norton",
        email: "edward@example.com",
        password: "password123",
        emailVerified: new Date(),
        isActive: false,
      },
      {
        name: "Fiona Green",
        email: "fiona@example.com",
        password: "password123",
        emailVerified: null,
        isActive: true,
      },
      {
        name: "George Miller",
        email: "george@example.com",
        password: "password123",
        emailVerified: new Date(),
        isActive: true,
      },
      {
        name: "Helen Davis",
        email: "helen@example.com",
        password: "password123",
        emailVerified: new Date(),
        isActive: true,
      },
      {
        name: "Ivan Petrov",
        email: "ivan@example.com",
        password: "password123",
        emailVerified: null,
        isActive: false,
      },
      {
        name: "Julia Roberts",
        email: "julia@example.com",
        password: "password123",
        emailVerified: new Date(),
        isActive: true,
      },
      {
        name: "Kevin Hart",
        email: "kevin@example.com",
        password: "password123",
        emailVerified: null,
        isActive: true,
      },
      {
        name: "Linda Taylor",
        email: "linda@example.com",
        password: "password123",
        emailVerified: new Date(),
        isActive: true,
      },
      {
        name: "Michael Jordan",
        email: "michael@example.com",
        password: "password123",
        emailVerified: new Date(),
        isActive: false,
      }
    ]

    const bcrypt = await import("bcryptjs")

    for (const userData of sampleUsers) {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email }
      })

      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(userData.password, 12)

        await prisma.user.create({
          data: {
            name: userData.name,
            email: userData.email,
            password: hashedPassword,
            emailVerified: userData.emailVerified,
            isActive: userData.isActive,
          }
        })

      }
    }

    return { success: true, message: "Sample users created successfully" }
  } catch (error) {
    return { success: false, error: 'Failed to create sample users' }
  }
}
