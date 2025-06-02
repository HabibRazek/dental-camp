import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { auth } from "@/auth"

// Update message validation schema
const UpdateMessageSchema = z.object({
  status: z.enum(['UNREAD', 'READ', 'IN_PROGRESS', 'RESOLVED', 'ARCHIVED']).optional(),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']).optional(),
  adminResponse: z.string().optional(),
})

// GET /api/contact/[id] - Get a single contact message
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const message = await prisma.contactMessage.findUnique({
      where: { id }
    })

    if (!message) {
      return NextResponse.json(
        { error: "Message not found" },
        { status: 404 }
      )
    }

    // Mark as read if it was unread
    if (message.status === 'UNREAD') {
      await prisma.contactMessage.update({
        where: { id },
        data: { status: 'READ' }
      })
    }

    return NextResponse.json({ message })

  } catch (error) {
    console.error('Error fetching contact message:', error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// PATCH /api/contact/[id] - Update a contact message (Admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const updateData = UpdateMessageSchema.parse(body)

    // Check if message exists
    const existingMessage = await prisma.contactMessage.findUnique({
      where: { id }
    })

    if (!existingMessage) {
      return NextResponse.json(
        { error: "Message not found" },
        { status: 404 }
      )
    }

    // Prepare update data
    const updateFields: any = { ...updateData }
    
    // If adding admin response, set responded metadata
    if (updateData.adminResponse && !existingMessage.adminResponse) {
      updateFields.respondedAt = new Date()
      updateFields.respondedBy = session.user.id
    }

    // Update the message
    const updatedMessage = await prisma.contactMessage.update({
      where: { id },
      data: updateFields
    })

    return NextResponse.json({
      success: true,
      message: "Contact message updated successfully",
      data: updatedMessage
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: "Invalid update data", 
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      )
    }

    console.error('Error updating contact message:', error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// DELETE /api/contact/[id] - Delete a contact message (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id } = await params

    // Check if message exists
    const existingMessage = await prisma.contactMessage.findUnique({
      where: { id }
    })

    if (!existingMessage) {
      return NextResponse.json(
        { error: "Message not found" },
        { status: 404 }
      )
    }

    // Delete the message
    await prisma.contactMessage.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: "Contact message deleted successfully"
    })

  } catch (error) {
    console.error('Error deleting contact message:', error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
