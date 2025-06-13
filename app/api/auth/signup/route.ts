import { NextRequest, NextResponse } from "next/server"
import { createUserSchema } from "@/lib/zod"
import { createUser, userExists, generateVerificationCode } from "@/lib/db"
import { sendVerificationEmail } from "@/lib/email"
import { ZodError } from "zod"

// Force this API route to use Node.js runtime
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate the request body
    const { name, email, password } = createUserSchema.parse(body)

    // Check if user already exists
    const exists = await userExists(email)
    if (exists) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      )
    }

    // Create the user
    const user = await createUser(name, email, password)

    // Generate and send verification code
    try {
      const { code } = await generateVerificationCode(email, user.id)
      await sendVerificationEmail(email, code, name)
    } catch (emailError) {
      // Don't fail the signup if email sending fails
    }

    return NextResponse.json(
      {
        message: "Utilisateur créé avec succès. Veuillez vérifier votre email pour le code de vérification.",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        requiresVerification: true
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Données d'entrée invalides", details: error.errors },
        { status: 400 }
      )
    }

    if (error instanceof Error) {
      // Handle specific database errors
      if (error.message.includes("Unique constraint")) {
        return NextResponse.json(
          { error: "Un utilisateur avec cet email existe déjà" },
          { status: 400 }
        )
      }
    }

    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}
