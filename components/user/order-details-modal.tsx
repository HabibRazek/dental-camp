"use client"

import React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  Calendar,
  CreditCard,
  MapPin,
  User,
  Phone,
  Mail,
  ShoppingCart,
  Copy
} from "lucide-react"
import { useSettings } from "@/contexts/settings-context"
import { toast } from "sonner"

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

interface OrderDetailsModalProps {
  order: Order | null
  isOpen: boolean
  onClose: () => void
  onReorder?: (order: Order) => void
}

export function OrderDetailsModal({ order, isOpen, onClose, onReorder }: OrderDetailsModalProps) {
  const { formatCurrency } = useSettings()

  if (!order) return null

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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(order.orderNumber)
    toast.success('Order number copied to clipboard!')
  }

  const handleReorder = () => {
    if (onReorder) {
      onReorder(order)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <Package className="h-6 w-6 text-blue-600" />
            Order Details
          </DialogTitle>
          <DialogDescription>
            Complete information about your order
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-bold text-gray-900">
                  Order #{order.orderNumber}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyOrderNumber}
                  className="h-6 w-6 p-0"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(order.createdAt)}</span>
                </div>
                <Badge className={`${getStatusColor(order.status)} font-semibold`}>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(order.status)}
                    {order.status}
                  </div>
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(order.totals.total)}
              </p>
              <p className="text-sm text-gray-600">Total Amount</p>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Order Items ({order.items.length})
            </h4>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Package className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h5 className="font-semibold text-gray-900">{item.name}</h5>
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity} × {formatCurrency(item.price)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Customer & Shipping Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Information */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer Information
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-gray-500" />
                  <span>{order.customer.firstName} {order.customer.lastName}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>{order.customer.email}</span>
                </div>
                {order.customer.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{order.customer.phone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Shipping Information */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Shipping Address
              </h4>
              <div className="space-y-2 text-gray-700">
                <p>{order.shippingAddress}</p>
                <p>{order.shippingCity} {order.shippingPostalCode}</p>
                <p>{order.shippingCountry}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Payment & Totals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Payment Information */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Information
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-medium">{order.paymentMethod}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Payment Status:</span>
                  <Badge variant={order.paymentStatus === 'PAID' ? 'default' : 'secondary'}>
                    {order.paymentStatus}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Order Totals */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span>{formatCurrency(order.totals.subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Delivery:</span>
                  <span>{formatCurrency(order.totals.delivery)}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>{formatCurrency(order.totals.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Close
            </Button>
            <Button
              onClick={handleReorder}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Reorder Items
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
