"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { OrdersTable } from "@/components/orders/orders-table"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export interface Order {
  id: string
  orderNumber: string
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  items: {
    id: string
    name: string
    price: number
    quantity: number
    image: string
    slug: string
  }[]
  customer: {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
  }
  shipping: {
    address: string
    city: string
    postalCode: string
    country: string
  }
  delivery: {
    method: string
    price: number
  }
  payment: {
    method: string
    status: string
    proofImage?: string | null
  }
  totals: {
    subtotal: number
    delivery: number
    total: number
  }
  notes: string
  createdAt: string
  updatedAt: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/orders')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.success) {
        setOrders(data.orders || [])
      } else {
        throw new Error(data.error || 'Failed to fetch orders')
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      setError(error instanceof Error ? error.message : 'Failed to fetch orders')
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          status: newStatus
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update order status')
      }

      const data = await response.json()
      
      if (data.success) {
        // Update the order in the local state
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.id === orderId 
              ? { ...order, status: newStatus as any, updatedAt: new Date().toISOString() }
              : order
          )
        )
        toast.success('Order status updated successfully')
      } else {
        throw new Error(data.error || 'Failed to update order status')
      }
    } catch (error) {
      console.error('Error updating order status:', error)
      toast.error('Failed to update order status')
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  if (loading) {
    return (
      <DashboardLayout
        title="Orders"
        description="Manage customer orders and track fulfillment"
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout
        title="Orders"
        description="Manage customer orders and track fulfillment"
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error: {error}</p>
            <button
              onClick={fetchOrders}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      title="Orders"
      description="Manage customer orders, track fulfillment, and update order status"
    >
      <OrdersTable
        data={orders}
        onStatusChange={handleStatusChange}
        onRefresh={fetchOrders}
      />
    </DashboardLayout>
  )
}
