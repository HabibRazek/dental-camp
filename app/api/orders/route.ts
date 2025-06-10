import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

// GET /api/orders - Get all orders (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      )
    }

    let orders

    // Check if user is admin
    if (session.user.role !== 'ADMIN') {
      // For regular users, return only their orders
      if (!session.user.email) {
        return NextResponse.json(
          { error: "Email utilisateur non trouvé" },
          { status: 400 }
        )
      }

      orders = await prisma.order.findMany({
        where: {
          customerEmail: session.user.email
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    } else {
      // For admin, return all orders
      orders = await prisma.order.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      })
    }

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
        status: order.paymentStatus
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

    return NextResponse.json({
      success: true,
      orders: transformedOrders
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

    if (!session) {
      console.log("❌ No session found, returning 401")
      return NextResponse.json(
        { error: "Non autorisé - Veuillez vous connecter pour passer une commande" },
        { status: 401 }
      )
    }

    console.log("✅ User authenticated:", session.user?.email)

    const body = await request.json()

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
        customerEmail: session.user.email, // Use session email for consistency
        customerPhone: customer.phone || null,
        shippingAddress: shipping.address,
        shippingCity: shipping.city,
        shippingPostalCode: shipping.postalCode || null,
        shippingCountry: shipping.country || 'Tunisie',
        paymentMethod: payment.method,
        paymentStatus: 'PENDING',
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
        status: newOrder.paymentStatus
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
    return NextResponse.json(
      { error: "Erreur lors de la création de la commande" },
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
        status: updatedOrder.paymentStatus
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
