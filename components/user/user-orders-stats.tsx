"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { 
  ShoppingBag, 
  Clock, 
  Truck, 
  CheckCircle,
  Package
} from "lucide-react"

interface OrderStats {
  total: number
  pending: number
  processing: number
  shipped: number
  delivered: number
}

interface UserOrdersStatsProps {
  userId: string
}

export function UserOrdersStats({ userId }: UserOrdersStatsProps) {
  const [stats, setStats] = React.useState<OrderStats>({
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0
  })
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    fetchOrderStats()
  }, [userId])

  const fetchOrderStats = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/user/orders?userId=${userId}&limit=1`)
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats || {
          total: 0,
          pending: 0,
          processing: 0,
          shipped: 0,
          delivered: 0
        })
      }
    } catch (error) {
      console.error('Error fetching order stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: "Total Orders",
      value: stats.total,
      icon: ShoppingBag,
      bgColor: "from-white to-blue-50/30",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: Clock,
      bgColor: "from-white to-yellow-50/30",
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600"
    },
    {
      title: "Shipped",
      value: stats.shipped,
      icon: Truck,
      bgColor: "from-white to-purple-50/30",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600"
    },
    {
      title: "Delivered",
      value: stats.delivered,
      icon: CheckCircle,
      bgColor: "from-white to-green-50/30",
      iconBg: "bg-green-100",
      iconColor: "text-green-600"
    }
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border border-gray-200/50 shadow-lg bg-gradient-to-br from-white to-gray-50/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg animate-pulse">
                  <div className="h-5 w-5 bg-gray-300 rounded"></div>
                </div>
                <div>
                  <div className="h-4 w-16 bg-gray-200 rounded animate-pulse mb-1"></div>
                  <div className="h-6 w-8 bg-gray-300 rounded animate-pulse"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {statCards.map((card) => (
        <Card key={card.title} className={`border border-gray-200/50 shadow-lg bg-gradient-to-br ${card.bgColor}`}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 ${card.iconBg} rounded-lg`}>
                <card.icon className={`h-5 w-5 ${card.iconColor}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
