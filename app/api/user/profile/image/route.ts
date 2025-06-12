import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { PrismaClient } from "@prisma/client"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

const prisma = new PrismaClient()

// POST /api/user/profile/image - Upload profile image
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log('📸 Processing profile image upload for user:', session.user.email)

    const formData = await request.formData()
    const file = formData.get('image') as File

    if (!file) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: "Invalid file type. Please upload a JPEG, PNG, or WebP image." 
      }, { status: 400 })
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: "File too large. Please upload an image smaller than 5MB." 
      }, { status: 400 })
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'profiles')
    try {
      await mkdir(uploadsDir, { recursive: true })
    } catch (error) {
      // Directory might already exist, that's fine
    }

    // Generate unique filename
    const timestamp = Date.now()
    const fileExtension = file.name.split('.').pop() || 'jpg'
    const fileName = `profile-${session.user.email?.replace(/[^a-zA-Z0-9]/g, '_')}-${timestamp}.${fileExtension}`
    const filePath = path.join(uploadsDir, fileName)

    // Save file to disk
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Create URL for the uploaded image
    const imageUrl = `/uploads/profiles/${fileName}`

    console.log('✅ Profile image saved successfully:', imageUrl, 'size:', file.size, 'bytes')

    // Update the user's profile image in the database
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email as string },
      data: { image: imageUrl }
    })

    console.log('📸 User image updated in database')

    return NextResponse.json({
      success: true,
      message: "Profile image uploaded successfully",
      imageUrl: imageUrl
    })

  } catch (error) {
    console.error("Error uploading profile image:", error)
    return NextResponse.json(
      { error: "Failed to upload profile image" },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
