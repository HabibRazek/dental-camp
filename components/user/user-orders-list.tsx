"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  Eye,
  Calendar,
  CreditCard,
  MapPin,
  ShoppingBag
} from "lucide-react"
import { useSettings } from "@/contexts/settings-context"
import { OrderDetailsModal } from "./order-details-modal"
import { useCart } from "@/contexts/CartContext"
import { toast } from "sonner"
import { Pagination, PageSizeSelector } from "@/components/ui/pagination"

interface Order {
  id: string
  orderNumber: string
  status: string
  items: any[]
  customer: {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
  }
  totals: {
    subtotal: number
    delivery: number
    total: number
  }
  shippingAddress: string
  shippingCity: string
  shippingPostalCode: string
  shippingCountry: string
  paymentMethod: string
  paymentStatus: string
  createdAt: string
}

interface UserOrdersListProps {
  userId: string
}

export function UserOrdersList({ userId }: UserOrdersListProps) {
  const [orders, setOrders] = React.useState<Order[]>([])
  const [loading, setLoading] = React.useState(true)
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = React.useState(false)
  const { formatCurrency } = useSettings()
  const { addItem } = useCart()

  // Pagination state
  const [currentPage, setCurrentPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(5)
  const [totalPages, setTotalPages] = React.useState(1)
  const [totalCount, setTotalCount] = React.useState(0)

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    fetchUserOrders(page, pageSize)
  }

  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setCurrentPage(1) // Reset to first page when changing page size
    fetchUserOrders(1, size)
  }

  React.useEffect(() => {
    fetchUserOrders()
  }, [userId])

  const fetchUserOrders = async (page = currentPage, limit = pageSize) => {
    try {
      setLoading(true)
      console.log('🔄 Fetching orders for user:', userId, 'page:', page, 'limit:', limit)

      // Build query parameters
      const params = new URLSearchParams({
        userId,
        page: page.toString(),
        limit: limit.toString()
      })

      const response = await fetch(`/api/user/orders?${params}`)
      console.log('📡 API Response status:', response.status)

      if (response.ok) {
        const data = await response.json()
        console.log('📦 Received orders data:', data)
        setOrders(data.orders || [])

        // Update pagination state
        if (data.pagination) {
          setCurrentPage(data.pagination.currentPage)
          setTotalPages(data.pagination.totalPages)
          setTotalCount(data.pagination.totalCount)
        }
      } else {
        console.error('Failed to fetch user orders, status:', response.status)
        const errorData = await response.text()
        console.error('Error response:', errorData)
        setOrders([])
      }
    } catch (error) {
      console.error('Error fetching user orders:', error)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return <Clock className="h-4 w-4" />
      case 'PROCESSING':
        return <Package className="h-4 w-4" />
      case 'SHIPPED':
        return <Truck className="h-4 w-4" />
      case 'DELIVERED':
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'DELIVERED':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order)
    setIsDetailsModalOpen(true)
  }

  const handleReorder = (order: Order) => {
    // Add all items from the order to cart
    let itemsAdded = 0
    order.items.forEach((item) => {
      try {
        addItem({
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image || '',
          slug: item.slug || '',
          stockQuantity: 999 // Assume available for reorder
        })
        itemsAdded++
      } catch (error) {
        console.error('Error adding item to cart:', error)
      }
    })

    if (itemsAdded > 0) {
      toast.success(`${itemsAdded} item${itemsAdded > 1 ? 's' : ''} added to cart!`)
    } else {
      toast.error('Failed to add items to cart')
    }
  }

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading your orders...</p>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="p-12 text-center">
        <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Orders Yet</h3>
        <p className="text-gray-600 mb-6">
          You haven't placed any orders yet. Start shopping to see your orders here!
        </p>
        <Button asChild>
          <a href="/catalog">Browse Products</a>
        </Button>
      </div>
    )
  }

  return (
    <div className="divide-y divide-gray-100">
      {orders.map((order) => {
        // Get first item for display
        const firstItem = order.items && order.items.length > 0 ? order.items[0] : null
        const itemCount = order.items ? order.items.length : 0

        return (
          <div key={order.id} className="p-6 hover:bg-gray-50/50 transition-colors duration-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              
              {/* Order Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-gray-900">
                    Order #{order.orderNumber}
                  </h3>
                  <Badge className={`${getStatusColor(order.status)} font-semibold`}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(order.status)}
                      {order.status}
                    </div>
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Ordered: {formatDate(order.createdAt)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    <span>
                      {itemCount} item{itemCount !== 1 ? 's' : ''}
                      {firstItem && ` - ${firstItem.name}`}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    <span>{order.paymentMethod} - {order.paymentStatus}</span>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {order.shippingAddress}, {order.shippingCity} {order.shippingPostalCode}, {order.shippingCountry}
                  </span>
                </div>
              </div>

              {/* Order Total & Actions */}
              <div className="flex flex-col lg:items-end gap-3">
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(order.totals.total)} TND
                  </p>
                  <p className="text-sm text-gray-600">
                    Total ({formatCurrency(order.totals.subtotal)} + {formatCurrency(order.totals.delivery)} delivery)
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(order)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReorder(order)}
                    className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                  >
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Reorder
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )
      })}

      {/* Pagination */}
      {orders.length > 0 && totalPages > 1 && (
        <div className="p-6 border-t border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <PageSizeSelector
              pageSize={pageSize}
              onPageSizeChange={handlePageSizeChange}
              options={[5, 10, 20]}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalCount={totalCount}
              limit={pageSize}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false)
          setSelectedOrder(null)
        }}
        onReorder={handleReorder}
      />
    </div>
  )
}
