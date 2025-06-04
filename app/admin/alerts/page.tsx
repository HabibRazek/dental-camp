"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  AlertTriangle,
  Package,
  TrendingDown,
  Clock,
  RefreshCw,
  CheckCircle,
  XCircle,
  Bell,
  Archive,
  RotateCcw
} from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import Link from "next/link"

interface Product {
  id: string
  name: string
  sku: string
  stockQuantity: number
  minStockLevel: number
  price: number
  category: {
    name: string
  }
}

interface AlertItem {
  id: string
  type: 'LOW_STOCK' | 'OUT_OF_STOCK' | 'EXPIRING_SOON' | 'SYSTEM'
  title: string
  message: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  product?: Product
  createdAt: string
  isRead: boolean
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertItem[]>([])
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [alertStates, setAlertStates] = useState<{[key: string]: {isRead: boolean, isDismissed: boolean}}>({})

  // Load alert states from localStorage
  useEffect(() => {
    const savedStates = localStorage.getItem('alertStates')
    if (savedStates) {
      setAlertStates(JSON.parse(savedStates))
    }
  }, [])

  // Save alert states to localStorage
  const saveAlertStates = (newStates: {[key: string]: {isRead: boolean, isDismissed: boolean}}) => {
    setAlertStates(newStates)
    localStorage.setItem('alertStates', JSON.stringify(newStates))
  }

  useEffect(() => {
    fetchAlerts()
    fetchLowStockProducts()
  }, [])



  // Auto-refresh alerts every 2 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchAlerts()
      fetchLowStockProducts()
    }, 120000) // 2 minutes

    return () => clearInterval(interval)
  }, [])

  const fetchAlerts = async () => {
    try {
      // Fetch alerts from the new API
      const response = await fetch('/api/alerts')

      if (!response.ok) {
        throw new Error(`Failed to fetch alerts: ${response.status}`)
      }

      const data = await response.json()
      let fetchedAlerts = data.alerts || []

      // Get current alert states from localStorage
      const currentStates = JSON.parse(localStorage.getItem('alertStates') || '{}')

      // Apply persistent states and filter out dismissed alerts
      const visibleAlerts = fetchedAlerts
        .map((alert: AlertItem) => {
          const savedState = currentStates[alert.id]
          if (savedState) {
            return {
              ...alert,
              isRead: savedState.isRead,
              isDismissed: savedState.isDismissed
            }
          }
          return alert
        })
        .filter((alert: AlertItem) => {
          const savedState = currentStates[alert.id]
          return !savedState?.isDismissed // Only show non-dismissed alerts
        })

      setAlerts(visibleAlerts)

      if (process.env.NODE_ENV === 'development') {
        console.log('🚨 Alerts loaded:', visibleAlerts.length)
        console.log('🚨 Dismissed alerts:', Object.keys(currentStates).filter(id => currentStates[id]?.isDismissed))
      }
    } catch (error) {
      console.error('Failed to fetch alerts:', error)
      toast.error('Failed to load alerts')
    }
  }

  const fetchLowStockProducts = async () => {
    setLoading(true)
    try {
      // Use the catalog API with stock filter for low stock products
      const response = await fetch('/api/products/catalog?stock=low_stock&limit=50')

      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      const lowStock = data.products || []

      // Also get out of stock products
      const outOfStockResponse = await fetch('/api/products/catalog?stock=out_of_stock&limit=50')
      if (outOfStockResponse.ok) {
        const outOfStockData = await outOfStockResponse.json()
        const outOfStock = outOfStockData.products || []

        // Combine low stock and out of stock products
        setLowStockProducts([...lowStock, ...outOfStock])
      } else {
        setLowStockProducts(lowStock)
      }

      if (process.env.NODE_ENV === 'development') {
        console.log('🚨 Low Stock Products:', lowStock.length)
      }
    } catch (error) {
      console.error('Failed to fetch low stock products:', error)
      toast.error('Failed to load low stock products')
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = (alertId: string) => {
    // Update local state
    setAlerts(prev => prev.map(alert =>
      alert.id === alertId ? { ...alert, isRead: true } : alert
    ))

    // Save to localStorage
    const currentStates = JSON.parse(localStorage.getItem('alertStates') || '{}')
    const newStates = {
      ...currentStates,
      [alertId]: { isRead: true, isDismissed: false }
    }
    localStorage.setItem('alertStates', JSON.stringify(newStates))
    setAlertStates(newStates)

    // Dispatch custom event to update sidebar badge
    window.dispatchEvent(new CustomEvent('alertsUpdated'))

    toast.success('Alert marked as read')
  }

  const dismissAlert = (alertId: string) => {
    // Remove from local state immediately
    setAlerts(prev => prev.filter(alert => alert.id !== alertId))

    // Save dismissed state to localStorage
    const currentStates = JSON.parse(localStorage.getItem('alertStates') || '{}')
    const newStates = {
      ...currentStates,
      [alertId]: { isRead: true, isDismissed: true }
    }
    localStorage.setItem('alertStates', JSON.stringify(newStates))
    setAlertStates(newStates)

    // Dispatch custom event to update sidebar badge
    window.dispatchEvent(new CustomEvent('alertsUpdated'))

    toast.success('Alert dismissed')
  }

  const markAllAsRead = () => {
    // Update local state
    setAlerts(prev => prev.map(alert => ({ ...alert, isRead: true })))

    // Save all as read to localStorage
    const newStates = { ...alertStates }
    alerts.forEach(alert => {
      newStates[alert.id] = { ...newStates[alert.id], isRead: true, isDismissed: false }
    })
    saveAlertStates(newStates)

    toast.success('All alerts marked as read')
  }

  // Clear dismissed alerts (cleanup function)
  const clearDismissedAlerts = () => {
    const newStates = { ...alertStates }
    Object.keys(newStates).forEach(alertId => {
      if (newStates[alertId]?.isDismissed) {
        delete newStates[alertId]
      }
    })
    saveAlertStates(newStates)
    toast.success('Dismissed alerts cleared from storage')
  }

  // Restore dismissed alerts
  const restoreDismissedAlerts = () => {
    const newStates = { ...alertStates }
    Object.keys(newStates).forEach(alertId => {
      if (newStates[alertId]?.isDismissed) {
        newStates[alertId].isDismissed = false
      }
    })
    saveAlertStates(newStates)
    fetchAlerts() // Refresh to show restored alerts
    toast.success('Dismissed alerts restored')
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-red-100 text-red-800 border-red-200'
      case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'LOW': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return <XCircle className="h-4 w-4 text-red-600" />
      case 'HIGH': return <AlertTriangle className="h-4 w-4 text-orange-600" />
      case 'MEDIUM': return <Clock className="h-4 w-4 text-yellow-600" />
      case 'LOW': return <CheckCircle className="h-4 w-4 text-blue-600" />
      default: return <Bell className="h-4 w-4 text-gray-600" />
    }
  }

  const getStockBadgeColor = (stock: number) => {
    if (stock === 0) return 'bg-red-500 text-white'
    if (stock <= 2) return 'bg-red-100 text-red-800'
    if (stock <= 5) return 'bg-orange-100 text-orange-800'
    return 'bg-green-100 text-green-800'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const unreadCount = alerts.filter(alert => !alert.isRead).length
  const criticalCount = alerts.filter(alert => alert.severity === 'CRITICAL').length

  return (
    <DashboardLayout
      title="Alerts & Notifications"
      description="Monitor system alerts, low stock warnings, and important notifications"
    >
      <div className="space-y-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-l-4 border-l-red-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{criticalCount}</div>
                <p className="text-xs text-muted-foreground">Require immediate attention</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="border-l-4 border-l-orange-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                <Package className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{lowStockProducts.length}</div>
                <p className="text-xs text-muted-foreground">Products need restocking</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unread Alerts</CardTitle>
                <Bell className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{unreadCount}</div>
                <p className="text-xs text-muted-foreground">New notifications</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Recent Alerts
                  </CardTitle>
                  <CardDescription>Latest system notifications and warnings</CardDescription>
                </div>
                <div className="flex gap-2">
                  {unreadCount > 0 && (
                    <Button variant="outline" onClick={markAllAsRead}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark All Read
                    </Button>
                  )}
                  <Button variant="outline" onClick={fetchAlerts}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>

                  {Object.values(alertStates).some(state => state.isDismissed) && (
                    <Button variant="outline" onClick={restoreDismissedAlerts}>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Restore Dismissed
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <p className="text-gray-600">No alerts at the moment</p>
                    <p className="text-sm text-gray-500">All systems are running smoothly</p>
                  </div>
                ) : (
                  alerts.map((alert) => (
                    <Alert key={alert.id} className={`${alert.isRead ? 'opacity-60' : ''} transition-opacity`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          {getSeverityIcon(alert.severity)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{alert.title}</h4>
                              <Badge className={`${getSeverityColor(alert.severity)} text-xs`}>
                                {alert.severity}
                              </Badge>
                              {!alert.isRead && (
                                <Badge className="bg-blue-500 text-white text-xs">NEW</Badge>
                              )}
                            </div>
                            <AlertDescription className="text-sm">
                              {alert.message}
                            </AlertDescription>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatDate(alert.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {!alert.isRead && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => markAsRead(alert.id)}
                            >
                              Mark Read
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => dismissAlert(alert.id)}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Alert>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Low Stock Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Low Stock Products
                  </CardTitle>
                  <CardDescription>Products that need immediate restocking</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Link href="/reports/products?stock=low_stock">
                    <Button variant="outline">
                      <Package className="h-4 w-4 mr-2" />
                      View All
                    </Button>
                  </Link>
                  <Button variant="outline" onClick={fetchLowStockProducts}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
                  <span className="ml-2">Loading products...</span>
                </div>
              ) : lowStockProducts.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-gray-600">All products are well stocked</p>
                  <p className="text-sm text-gray-500">No low stock alerts</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {lowStockProducts.map((product) => (
                    <Card key={product.id} className="border-l-4 border-l-orange-500">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">{product.name}</h4>
                              <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                              <p className="text-xs text-gray-500">Category: {product.category?.name}</p>
                            </div>
                            <Badge className={`${getStockBadgeColor(product.stockQuantity)} text-xs`}>
                              {product.stockQuantity === 0 ? 'OUT OF STOCK' : `${product.stockQuantity} left`}
                            </Badge>
                          </div>

                          <div className="flex items-center justify-between pt-2">
                            <span className="text-sm font-medium text-green-600">
                              {new Intl.NumberFormat('fr-TN', {
                                style: 'currency',
                                currency: 'TND',
                                minimumFractionDigits: 2
                              }).format(product.price)}
                            </span>
                            <Link href={`/admin/products/${product.id}/edit`}>
                              <Button size="sm" variant="outline">
                                Restock
                              </Button>
                            </Link>
                          </div>

                          {product.stockQuantity === 0 && (
                            <Alert className="mt-2">
                              <AlertTriangle className="h-4 w-4" />
                              <AlertDescription className="text-xs">
                                This product is completely out of stock and unavailable for purchase.
                              </AlertDescription>
                            </Alert>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
