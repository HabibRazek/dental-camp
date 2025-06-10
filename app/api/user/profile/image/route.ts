import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { PrismaClient } from "@prisma/client"

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

    // For now, we'll simulate the upload process
    // In a real app, you'd upload to a cloud storage service like AWS S3, Cloudinary, etc.
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Generate a mock URL (in real app, this would be the actual uploaded image URL)
    const mockImageUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.email}&backgroundColor=b6e3f4,c0aede,d1d4f9&timestamp=${Date.now()}`

    console.log('✅ Profile image uploaded successfully:', mockImageUrl)

    // Update the user's profile image in the database
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email as string },
      data: { image: mockImageUrl }
    })

    console.log('📸 User image updated in database:', updatedUser.image)

    return NextResponse.json({
      success: true,
      message: "Profile image uploaded successfully",
      imageUrl: mockImageUrl
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
