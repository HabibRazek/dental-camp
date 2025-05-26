import { NextRequest, NextResponse } from "next/server"
import { createUserSchema } from "@/lib/zod"
import { createUser, userExists } from "@/lib/db"
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

    return NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        }
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Signup error:", error)

    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid input data", details: error.errors },
        { status: 400 }
      )
    }

    if (error instanceof Error) {
      // Handle specific database errors
      if (error.message.includes("Unique constraint")) {
        return NextResponse.json(
          { error: "User with this email already exists" },
          { status: 400 }
        )
      }
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
