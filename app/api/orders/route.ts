import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

// GET /api/orders - Get all orders with pagination
export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      )
    }

    // Get pagination parameters from URL
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''

    // Calculate offset for pagination
    const offset = (page - 1) * limit

    // Build where clause
    let whereClause: any = {}

    // Check if user is admin
    if (session.user.role !== 'ADMIN') {
      // For regular users, return only their orders
      if (!session.user.email) {
        return NextResponse.json(
          { error: "Email utilisateur non trouvé" },
          { status: 400 }
        )
      }
      whereClause.customerEmail = session.user.email as string
    }

    // Add search filter
    if (search) {
      whereClause.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { customerName: { contains: search, mode: 'insensitive' } },
        { customerEmail: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Add status filter
    if (status && status !== 'all') {
      whereClause.status = status
    }

    // Get total count for pagination
    const totalCount = await prisma.order.count({
      where: whereClause
    })

    // Get orders with pagination
    const orders = await prisma.order.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc'
      },
      skip: offset,
      take: limit
    })

    // Transform orders to match the expected format
    const transformedOrders = orders.map(order => ({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      items: order.items as any[], // JSON field
      customer: {
        id: order.customerId || '',
        firstName: order.customerName.split(' ')[0] || '',
        lastName: order.customerName.split(' ').slice(1).join(' ') || '',
        email: order.customerEmail,
        phone: order.customerPhone || ''
      },
      shipping: {
        address: order.shippingAddress,
        city: order.shippingCity,
        postalCode: order.shippingPostalCode || '',
        country: order.shippingCountry
      },
      delivery: {
        method: 'contact', // Since we removed delivery options
        price: 0,
        notes: order.deliveryNotes || ''
      },
      payment: {
        method: order.paymentMethod,
        status: order.paymentStatus,
        proofImage: order.paymentProofImage
      },
      totals: {
        subtotal: Number(order.subtotal),
        delivery: 0,
        total: Number(order.total)
      },
      notes: order.notes || '',
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString()
    }))

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    return NextResponse.json({
      success: true,
      orders: transformedOrders,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasNextPage,
        hasPrevPage
      }
    })

  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    )
  }
}

// POST /api/orders - Create new order
export async function POST(request: NextRequest) {
  try {
    console.log("🛒 Order creation request received")

    const session = await auth()
    console.log("🔐 Session:", session ? "authenticated" : "not authenticated")

    if (!session || !session.user || !session.user.email) {
      console.log("❌ No valid session found, returning 401")
      return NextResponse.json(
        { error: "Non autorisé - Veuillez vous connecter pour passer une commande" },
        { status: 401 }
      )
    }

    console.log("✅ User authenticated:", session.user?.email)

    const body = await request.json()
    console.log("📥 Received order data:", JSON.stringify(body, null, 2))

    // Validate required fields
    const { items, customer, shipping, delivery, payment, totals, notes } = body

    if (!items || !customer || !shipping || !payment || !totals) {
      return NextResponse.json(
        { error: "Données manquantes" },
        { status: 400 }
      )
    }

    // Validate items array
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Aucun article dans la commande" },
        { status: 400 }
      )
    }

    // Validate payment proof for bank transfer
    if (payment.method === 'transfer' && !payment.proofImage) {
      console.warn("⚠️ No payment proof provided for bank transfer")
      return NextResponse.json(
        { error: "Justificatif de paiement requis pour le virement bancaire" },
        { status: 400 }
      )
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    // Prepare order items
    const orderItems = items.map((item: any) => ({
      id: item.id,
      name: item.name,
      price: Number(item.price),
      quantity: Number(item.quantity),
      image: item.image || '',
      slug: item.slug || ''
    }))

    // Create order in database
    console.log("💾 Creating order in database...")
    console.log("📊 Order data:", {
      orderNumber,
      customerName: `${customer.firstName} ${customer.lastName}`.trim(),
      customerEmail: customer.email,
      itemsCount: orderItems.length,
      total: Number(totals.total)
    })

    const newOrder = await prisma.order.create({
      data: {
        orderNumber,
        status: 'PENDING',
        customerId: session.user.id,
        customerName: `${customer.firstName} ${customer.lastName}`.trim(),
        customerEmail: session.user.email as string, // Type assertion safe due to validation above
        customerPhone: customer.phone || null,
        shippingAddress: shipping.address,
        shippingCity: shipping.city,
        shippingPostalCode: shipping.postalCode || null,
        shippingCountry: shipping.country || 'Tunisie',
        paymentMethod: payment.method,
        paymentStatus: 'PENDING',
        paymentProofImage: payment.proofImage || null,
        deliveryNotes: delivery?.notes || null,
        subtotal: Number(totals.subtotal),
        total: Number(totals.total),
        notes: notes || null,
        items: orderItems
      }
    })

    // Transform the created order to match the expected format
    const transformedOrder = {
      id: newOrder.id,
      orderNumber: newOrder.orderNumber,
      status: newOrder.status,
      items: newOrder.items as any[],
      customer: {
        id: newOrder.customerId || '',
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: newOrder.customerEmail,
        phone: newOrder.customerPhone || ''
      },
      shipping: {
        address: newOrder.shippingAddress,
        city: newOrder.shippingCity,
        postalCode: newOrder.shippingPostalCode || '',
        country: newOrder.shippingCountry
      },
      delivery: {
        method: 'contact',
        price: 0,
        notes: newOrder.deliveryNotes || ''
      },
      payment: {
        method: newOrder.paymentMethod,
        status: newOrder.paymentStatus,
        proofImage: newOrder.paymentProofImage
      },
      totals: {
        subtotal: Number(newOrder.subtotal),
        delivery: 0,
        total: Number(newOrder.total)
      },
      notes: newOrder.notes || '',
      createdAt: newOrder.createdAt.toISOString(),
      updatedAt: newOrder.updatedAt.toISOString()
    }

    console.log("✅ Order created successfully:", newOrder.orderNumber)
    console.log("📧 Order customer email:", newOrder.customerEmail)
    console.log("👤 Session user email:", session.user.email)

    return NextResponse.json({
      success: true,
      order: transformedOrder,
      message: "Commande créée avec succès"
    })

  } catch (error) {
    console.error("❌ Error creating order:", error)
    console.error("❌ Error details:", {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      name: error instanceof Error ? error.name : 'Unknown error type'
    })
    return NextResponse.json(
      {
        error: "Erreur lors de la création de la commande",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// PUT /api/orders - Update order status (admin only)
export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      )
    }

    const { orderId, status } = await request.json()
    
    if (!orderId || !status) {
      return NextResponse.json(
        { error: "ID de commande et statut requis" },
        { status: 400 }
      )
    }

    // Update order in database
    const updatedOrder = await prisma.order.update({
      where: {
        id: orderId
      },
      data: {
        status,
        updatedAt: new Date()
      }
    })

    if (!updatedOrder) {
      return NextResponse.json(
        { error: "Commande non trouvée" },
        { status: 404 }
      )
    }

    // Transform the updated order to match the expected format
    const transformedOrder = {
      id: updatedOrder.id,
      orderNumber: updatedOrder.orderNumber,
      status: updatedOrder.status,
      items: updatedOrder.items as any[],
      customer: {
        id: updatedOrder.customerId || '',
        firstName: updatedOrder.customerName.split(' ')[0] || '',
        lastName: updatedOrder.customerName.split(' ').slice(1).join(' ') || '',
        email: updatedOrder.customerEmail,
        phone: updatedOrder.customerPhone || ''
      },
      shipping: {
        address: updatedOrder.shippingAddress,
        city: updatedOrder.shippingCity,
        postalCode: updatedOrder.shippingPostalCode || '',
        country: updatedOrder.shippingCountry
      },
      delivery: {
        method: 'contact',
        price: 0,
        notes: updatedOrder.deliveryNotes || ''
      },
      payment: {
        method: updatedOrder.paymentMethod,
        status: updatedOrder.paymentStatus,
        proofImage: updatedOrder.paymentProofImage
      },
      totals: {
        subtotal: Number(updatedOrder.subtotal),
        delivery: 0,
        total: Number(updatedOrder.total)
      },
      notes: updatedOrder.notes || '',
      createdAt: updatedOrder.createdAt.toISOString(),
      updatedAt: updatedOrder.updatedAt.toISOString()
    }

    console.log("✅ Order status updated:", updatedOrder.orderNumber, "->", status)

    return NextResponse.json({
      success: true,
      order: transformedOrder,
      message: "Statut de commande mis à jour"
    })

  } catch (error) {
    console.error("❌ Error updating order status:", error)
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du statut" },
      { status: 500 }
    )
  }
}
