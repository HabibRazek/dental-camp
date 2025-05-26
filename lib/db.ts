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
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        image: true,
        createdAt: true,
      },
    })

    if (!user || !user.password) {
      return null
    }

    // Import bcrypt here to avoid issues with edge runtime
    const bcrypt = await import("bcryptjs")
    const isValidPassword = await bcrypt.compare(plainPassword, user.password)

    if (!isValidPassword) {
      return null
    }

    // Return user without password
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      createdAt: user.createdAt,
    }
  } catch (error) {
    console.error("Error getting user from database:", error)
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
    console.error("Error creating user:", error)
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
    console.error("Error checking if user exists:", error)
    return false
  }
}
