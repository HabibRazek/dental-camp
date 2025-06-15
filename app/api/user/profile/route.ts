import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// GET /api/user/profile - Get user profile data
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }



    // Get user from database - only select fields that definitely exist
    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
        emailVerified: true
      }
    })

    // Try to get additional fields if they exist
    let phone = ''
    let bio = ''

    try {
      const userWithExtras = await prisma.user.findUnique({
        where: { email: session.user.email as string },
        select: {
          phone: true,
          bio: true
        }
      })
      phone = userWithExtras?.phone || ''
      bio = userWithExtras?.bio || ''
    } catch (extraFieldsError) {

      // Fields don't exist yet, use empty strings
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Parse name into first and last name
    const nameParts = user.name?.split(' ') || []
    const firstName = nameParts[0] || ''
    const lastName = nameParts.slice(1).join(' ') || ''

    const profileData = {
      id: user.id,
      firstName,
      lastName,
      email: user.email,
      phone: phone,
      bio: bio,
      image: user.image,
      role: user.role,
      createdAt: user.createdAt,
      emailVerified: user.emailVerified
    }



    return NextResponse.json({
      success: true,
      profile: profileData
    })

  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// PUT /api/user/profile - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { firstName, lastName, email, phone, bio } = await request.json()



    // Combine first and last name
    const fullName = `${firstName} ${lastName}`.trim()

    // Update user in database - only update fields that exist
    let updateData: any = {
      name: fullName,
      email: email
    }

    // Try to update phone and bio if fields exist
    try {
      // Test if fields exist by trying to select them first
      await prisma.user.findFirst({
        where: { email: session.user.email as string },
        select: { phone: true, bio: true }
      })

      // If no error, fields exist, so we can update them
      updateData.phone = phone || null
      updateData.bio = bio || null

      // Fields exist, can update them
    } catch (fieldError) {
      // Fields don't exist, skip them
    }

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email as string },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
        emailVerified: true
      }
    })



    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      profile: updatedUser
    })

  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
