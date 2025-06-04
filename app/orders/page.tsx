"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { OrdersTable } from "@/components/orders/orders-table"
import { UserOrdersView } from "@/components/orders/user-orders-view"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { toast } from "sonner"
import { Loader2, ShoppingBag, TrendingUp, Clock, CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageLoader } from "@/components/ui/loader"

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
  const { data: session, status } = useSession()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    totalValue: 0
  })

  const isAdmin = session?.user?.role === 'ADMIN'

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
        const fetchedOrders = data.orders || []
        setOrders(fetchedOrders)
        
        // Calculate stats
        const total = fetchedOrders.length
        const pending = fetchedOrders.filter((order: Order) => 
          ['PENDING', 'CONFIRMED', 'PROCESSING'].includes(order.status)
        ).length
        const completed = fetchedOrders.filter((order: Order) => 
          order.status === 'DELIVERED'
        ).length
        const totalValue = fetchedOrders.reduce((sum: number, order: Order) => 
          sum + order.totals.total, 0
        )
        
        setStats({ total, pending, completed, totalValue })
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

  const handleStatusChange = async (orderId: string, status: string) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId, status }),
      })

      if (response.ok) {
        toast.success('Order status updated successfully')
        fetchOrders() // Refresh the orders list
      } else {
        throw new Error('Failed to update order status')
      }
    } catch (error) {
      console.error('Error updating order status:', error)
      toast.error('Failed to update order status')
    }
  }

  useEffect(() => {
    if (session?.user) {
      fetchOrders()
    }
  }, [session])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-TN', {
      style: 'currency',
      currency: 'TND'
    }).format(price)
  }

  // Handle authentication states
  if (status === "loading") {
    return <PageLoader />
  }

  if (!session?.user) {
    redirect("/auth/signin")
  }

  if (loading) {
    return (
      <DashboardLayout
        title={isAdmin ? 'Gestion des Commandes' : 'Mes Commandes'}
        description={isAdmin
          ? 'Gérez toutes les commandes clients, suivez les livraisons et mettez à jour les statuts'
          : 'Consultez l\'historique de vos commandes et suivez leur statut de livraison'
        }
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-lg text-gray-600">Chargement de vos commandes...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout
        title={isAdmin ? 'Gestion des Commandes' : 'Mes Commandes'}
        description={isAdmin
          ? 'Gérez toutes les commandes clients, suivez les livraisons et mettez à jour les statuts'
          : 'Consultez l\'historique de vos commandes et suivez leur statut de livraison'
        }
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600 mb-4 text-lg">Erreur: {error}</p>
            <button
              onClick={fetchOrders}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Réessayer
            </button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      title={isAdmin ? 'Gestion des Commandes' : 'Mes Commandes'}
      description={isAdmin
        ? 'Gérez toutes les commandes clients, suivez les livraisons et mettez à jour les statuts'
        : 'Consultez l\'historique de vos commandes et suivez leur statut de livraison'
      }
    >

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              Total Commandes
            </CardTitle>
            <div className="p-2 bg-blue-100 rounded-lg">
              <ShoppingBag className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 mb-1">{stats.total}</div>
            <p className="text-xs text-gray-600 font-medium">
              {isAdmin ? 'Toutes les commandes' : 'Vos commandes'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-orange-50 to-orange-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              En Cours
            </CardTitle>
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 mb-1">{stats.pending}</div>
            <p className="text-xs text-gray-600 font-medium">
              En attente de traitement
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-green-50 to-green-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              Livrées
            </CardTitle>
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 mb-1">{stats.completed}</div>
            <p className="text-xs text-gray-600 font-medium">
              Commandes terminées
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-purple-50 to-purple-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              Valeur Totale
            </CardTitle>
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 mb-1">{formatPrice(stats.totalValue)}</div>
            <p className="text-xs text-gray-600 font-medium">
              Chiffre d'affaires
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Orders Content */}
      <Card className="border-0 shadow-sm bg-white/95 backdrop-blur-sm">
        <CardContent className="p-6">
          {isAdmin ? (
            <OrdersTable
              data={orders}
              onStatusChange={handleStatusChange}
              onRefresh={fetchOrders}
            />
          ) : (
            <UserOrdersView
              data={orders}
              onRefresh={fetchOrders}
            />
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
