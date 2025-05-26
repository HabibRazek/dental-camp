/**
 * Salt and hash a password
 * @param password - Plain text password
 * @returns Hashed password
 */
export async function saltAndHashPassword(password: string): Promise<string> {
  const bcrypt = await import("bcryptjs")
  const saltRounds = 12
  return await bcrypt.hash(password, saltRounds)
}

/**
 * Verify a password against a hash
 * @param password - Plain text password
 * @param hashedPassword - Hashed password from database
 * @returns Boolean indicating if password is correct
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const bcrypt = await import("bcryptjs")
  return await bcrypt.compare(password, hashedPassword)
}
