import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { headers } from "next/headers"

// Contact message validation schema
const ContactMessageSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  subject: z.string().min(1, "Subject is required").max(200, "Subject must be less than 200 characters"),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000, "Message must be less than 2000 characters"),
  source: z.string().optional().default("landing_page")
})

// GET /api/contact - Get all contact messages (Admin only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search')

    const where: any = {}
    
    if (status && status !== 'all') {
      where.status = status.toUpperCase()
    }
    
    if (priority && priority !== 'all') {
      where.priority = priority.toUpperCase()
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } }
      ]
    }

    const [messages, totalCount] = await Promise.all([
      prisma.contactMessage.findMany({
        where,
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'desc' }
        ],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.contactMessage.count({ where })
    ])

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      messages,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    })

  } catch (error) {
    console.error('Error fetching contact messages:', error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST /api/contact - Create a new contact message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const messageData = ContactMessageSchema.parse(body)

    // Get client IP and user agent
    const headersList = await headers()
    const forwarded = headersList.get("x-forwarded-for")
    const realIp = headersList.get("x-real-ip")
    const ipAddress = forwarded?.split(',')[0] || realIp || 'unknown'
    const userAgent = headersList.get("user-agent") || 'unknown'

    // Determine priority based on keywords in subject/message
    let priority = 'NORMAL'
    const urgentKeywords = ['urgent', 'emergency', 'asap', 'immediately', 'critical']
    const highKeywords = ['important', 'priority', 'soon', 'quickly']
    
    const textToCheck = `${messageData.subject} ${messageData.message}`.toLowerCase()
    
    if (urgentKeywords.some(keyword => textToCheck.includes(keyword))) {
      priority = 'URGENT'
    } else if (highKeywords.some(keyword => textToCheck.includes(keyword))) {
      priority = 'HIGH'
    }

    // Create the contact message
    const contactMessage = await prisma.contactMessage.create({
      data: {
        ...messageData,
        priority: priority as any,
        ipAddress,
        userAgent,
      }
    })

    // TODO: Send notification email to admin
    // TODO: Send auto-reply email to customer

    return NextResponse.json(
      {
        success: true,
        message: "Your message has been sent successfully. We'll get back to you soon!",
        id: contactMessage.id
      },
      { status: 201 }
    )

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: "Invalid message data", 
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      )
    }

    console.error('Error creating contact message:', error)
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 }
    )
  }
}
