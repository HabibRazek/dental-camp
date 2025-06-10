"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Bell, 
  ShoppingCart, 
  Users, 
  MessageSquare, 
  Package,
  AlertTriangle,
  CheckCircle,
  Clock,
  X
} from "lucide-react"
import { formatDate } from "@/lib/utils"

interface Notification {
  id: string
  type: 'order' | 'user' | 'message' | 'product' | 'system'
  title: string
  description: string
  timestamp: Date
  read: boolean
  urgent: boolean
}

export function RealTimeNotifications() {
  const [notifications, setNotifications] = React.useState<Notification[]>([])
  const [loading, setLoading] = React.useState(true)

  // Get dismissed notifications from localStorage
  const getDismissedNotifications = (): Set<string> => {
    if (typeof window === 'undefined') return new Set()
    try {
      const stored = localStorage.getItem('DISMISSED_NOTIFICATIONS_PERMANENT')
      return stored ? new Set(JSON.parse(stored)) : new Set()
    } catch {
      return new Set()
    }
  }

  // Save dismissed notification to localStorage
  const saveDismissedNotification = (id: string) => {
    if (typeof window === 'undefined') return
    try {
      const dismissed = getDismissedNotifications()
      dismissed.add(id)
      localStorage.setItem('DISMISSED_NOTIFICATIONS_PERMANENT', JSON.stringify([...dismissed]))
      console.log('✅ SAVED DISMISSED:', id)
    } catch (error) {
      console.warn('Failed to save dismissed notification:', error)
    }
  }

  const fetchNotifications = React.useCallback(async () => {
    try {
      setLoading(true)

      // Get current dismissed notifications
      const dismissed = getDismissedNotifications()
      console.log('📋 Currently dismissed:', [...dismissed])

      // Fetch data from multiple endpoints
      const [ordersRes, usersRes, messagesRes] = await Promise.all([
        fetch('/api/orders?limit=5'),
        fetch('/api/customers?limit=5'),
        fetch('/api/contact?limit=5')
      ])

      const [orders, users, messages] = await Promise.all([
        ordersRes.ok ? ordersRes.json() : { orders: [] },
        usersRes.ok ? usersRes.json() : { users: [] },
        messagesRes.ok ? messagesRes.json() : { messages: [] }
      ])

      const newNotifications: Notification[] = []

      // Add order notifications - SKIP if dismissed
      orders.orders?.slice(0, 3).forEach((order: any) => {
        const notificationId = `order-${order.id}`
        if (!dismissed.has(notificationId)) {
          newNotifications.push({
            id: notificationId,
            type: 'order',
            title: 'New Order Received',
            description: `Order #${order.orderNumber} from ${order.customerName || 'Customer'}`,
            timestamp: new Date(order.createdAt),
            read: false,
            urgent: order.status === 'PENDING'
          })
        } else {
          console.log('🚫 SKIPPED dismissed order:', notificationId)
        }
      })

      // Add user notifications - SKIP if dismissed
      users.users?.slice(0, 2).forEach((user: any) => {
        const isRecent = new Date(user.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)
        if (isRecent) {
          const notificationId = `user-${user.id}`
          if (!dismissed.has(notificationId)) {
            newNotifications.push({
              id: notificationId,
              type: 'user',
              title: 'New User Registration',
              description: `${user.name} joined the platform`,
              timestamp: new Date(user.createdAt),
              read: false,
              urgent: false
            })
          } else {
            console.log('🚫 SKIPPED dismissed user:', notificationId)
          }
        }
      })

      // Add message notifications - SKIP if dismissed
      messages.messages?.slice(0, 2).forEach((message: any) => {
        if (message.status === 'UNREAD') {
          const notificationId = `message-${message.id}`
          if (!dismissed.has(notificationId)) {
            newNotifications.push({
              id: notificationId,
              type: 'message',
              title: 'New Contact Message',
              description: `Message from ${message.name}: ${message.subject}`,
              timestamp: new Date(message.createdAt),
              read: false,
              urgent: message.priority === 'HIGH' || message.priority === 'URGENT'
            })
          } else {
            console.log('🚫 SKIPPED dismissed message:', notificationId)
          }
        }
      })

      // Sort by timestamp (newest first)
      newNotifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

      setNotifications(newNotifications.slice(0, 8))
      console.log('📢 Showing notifications:', newNotifications.length)
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchNotifications()
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchNotifications, 30 * 1000)
    return () => clearInterval(interval)
  }, [fetchNotifications])

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
  }

  const removeNotification = (id: string) => {
    console.log('🗑️ REMOVING NOTIFICATION:', id)

    // Remove from current display
    setNotifications(prev => prev.filter(notif => notif.id !== id))

    // Save to localStorage permanently
    saveDismissedNotification(id)

    console.log('✅ NOTIFICATION PERMANENTLY DISMISSED:', id)
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'order':
        return ShoppingCart
      case 'user':
        return Users
      case 'message':
        return MessageSquare
      case 'product':
        return Package
      default:
        return Bell
    }
  }

  const getIconColor = (type: string, urgent: boolean) => {
    if (urgent) return "text-red-500"
    
    switch (type) {
      case 'order':
        return "text-blue-500"
      case 'user':
        return "text-green-500"
      case 'message':
        return "text-orange-500"
      case 'product':
        return "text-purple-500"
      default:
        return "text-gray-500"
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="px-4 lg:px-6 mb-8">
      <Card className="border border-gray-200/50 shadow-xl bg-gradient-to-br from-white to-gray-50/30 backdrop-blur-sm">
        <CardHeader className="border-b border-gray-100/50 bg-gradient-to-r from-white to-gray-50/50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                <div className="w-2 h-8 bg-gradient-to-b from-orange-600 to-orange-500 rounded-full"></div>
                Real-time Notifications
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {unreadCount} new
                  </Badge>
                )}
              </CardTitle>
              <CardDescription className="text-gray-600 font-medium">
                Stay updated with the latest activities on your platform
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchNotifications}
                disabled={loading}
              >
                <Bell className={`h-4 w-4 mr-2 ${loading ? 'animate-pulse' : ''}`} />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  console.log('🔄 CLEARING ALL DISMISSED NOTIFICATIONS')
                  if (typeof window !== 'undefined') {
                    localStorage.removeItem('DISMISSED_NOTIFICATIONS_PERMANENT')
                  }
                  fetchNotifications()
                }}
                className="text-xs"
              >
                Reset All
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 animate-pulse">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-12 text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">All caught up!</h3>
              <p className="text-gray-600">No new notifications at the moment.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => {
                const Icon = getIcon(notification.type)
                return (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 transition-colors ${
                      !notification.read ? 'bg-blue-50/50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-full bg-gray-100 ${getIconColor(notification.type, notification.urgent)}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`text-sm font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notification.title}
                          </h4>
                          {notification.urgent && (
                            <AlertTriangle className="h-3 w-3 text-red-500" />
                          )}
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {notification.description}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          {formatDate(notification.timestamp.toISOString())}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            className="h-8 w-8 p-0"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeNotification(notification.id)}
                          className="h-8 w-8 p-0 text-gray-400 hover:text-red-500"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
