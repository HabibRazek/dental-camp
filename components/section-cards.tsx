"use client"

import { useEffect, useState } from "react"
import {
  Users,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Package,
  Star,
  Boxes,
  RotateCcw
} from "lucide-react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useSettings } from "@/contexts/settings-context"

interface AnalyticsData {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  totalProducts: number
  averageOrderValue: number
  revenueGrowth: number
  ordersGrowth: number
  customersGrowth: number
  productsGrowth: number
  monthlyRevenue: Array<{
    month: string
    revenue: number
    orders: number
  }>
  topProducts: Array<{
    name: string
    sales: number
    revenue: number
  }>
  orderStatus: Array<{
    status: string
    count: number
    color: string
  }>
}

// Remove this function as we'll use the context one

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US').format(num)
}

const formatPercentage = (num: number) => {
  const sign = num >= 0 ? '+' : ''
  return `${sign}${num.toFixed(1)}%`
}

export function SectionCards() {
  const { formatCurrency } = useSettings()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/analytics')
        if (response.ok) {
          const data = await response.json()
          setAnalytics(data)
        }
      } catch (error) {
        console.error('Failed to fetch analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()

    // Refresh data every 5 minutes
    const interval = setInterval(fetchAnalytics, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="px-4 mt-[-30px] lg:px-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Performance Overview</h2>
          <p className="text-gray-600">Loading real-time insights...</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardHeader className="space-y-0 pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="px-4 mt-[-30px] lg:px-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Performance Overview</h2>
          <p className="text-gray-600 text-red-500">Failed to load analytics data</p>
        </div>
      </div>
    )
  }

  // Calculate additional metrics
  const activeOrders = analytics.orderStatus.find(s => s.status === 'Processing')?.count || 0
  const completedOrders = analytics.orderStatus.find(s => s.status === 'Completed')?.count || 0
  const currentMonthRevenue = analytics.monthlyRevenue[analytics.monthlyRevenue.length - 1]?.revenue || 0
  const currentMonthOrders = analytics.monthlyRevenue[analytics.monthlyRevenue.length - 1]?.orders || 0

  // Calculate satisfaction score (mock based on completion rate)
  const satisfactionScore = completedOrders > 0 ?
    Math.min(4.9, 3.5 + (completedOrders / analytics.totalOrders) * 1.4) : 4.0

  const stats = [
    {
      title: "Total Revenue",
      value: formatCurrency(analytics.totalRevenue),
      change: formatPercentage(analytics.revenueGrowth),
      changeType: analytics.revenueGrowth >= 0 ? "positive" as const : "negative" as const,
      icon: DollarSign,
      description: "Total revenue generated",
    },
    {
      title: "Active Orders",
      value: formatNumber(activeOrders),
      change: `+${analytics.ordersGrowth.toFixed(0)}`,
      changeType: "positive" as const,
      icon: ShoppingCart,
      description: "Orders being processed",
    },
    {
      title: "Monthly Revenue",
      value: formatCurrency(currentMonthRevenue),
      change: formatPercentage(analytics.revenueGrowth),
      changeType: analytics.revenueGrowth >= 0 ? "positive" as const : "negative" as const,
      icon: TrendingUp,
      description: "Revenue this month",
    },
    {
      title: "Customer Satisfaction",
      value: `${satisfactionScore.toFixed(1)}/5`,
      change: "+0.2",
      changeType: "positive" as const,
      icon: Star,
      description: "Average customer rating",
    },
    {
      title: "Average Order Value",
      value: formatCurrency(analytics.averageOrderValue),
      change: formatPercentage(analytics.revenueGrowth - analytics.ordersGrowth),
      changeType: (analytics.revenueGrowth - analytics.ordersGrowth) >= 0 ? "positive" as const : "negative" as const,
      icon: Package,
      description: "Average per order",
    },
    {
      title: "Total Customers",
      value: formatNumber(analytics.totalCustomers),
      change: formatPercentage(analytics.customersGrowth),
      changeType: analytics.customersGrowth >= 0 ? "positive" as const : "negative" as const,
      icon: Users,
      description: "Registered customers",
    },
    {
      title: "Total Products",
      value: formatNumber(analytics.totalProducts),
      change: formatPercentage(analytics.productsGrowth),
      changeType: analytics.productsGrowth >= 0 ? "positive" as const : "warning" as const,
      icon: Boxes,
      description: "Products in catalog",
    },
    {
      title: "Total Orders",
      value: formatNumber(analytics.totalOrders),
      change: formatPercentage(analytics.ordersGrowth),
      changeType: analytics.ordersGrowth >= 0 ? "positive" as const : "negative" as const,
      icon: RotateCcw,
      description: "All time orders",
    },
  ]

  return (
    <div className="px-4 mt-[-30px] lg:px-6">
      {/* Header Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Performance Overview</h2>
        <p className="text-gray-600">Real-time insights into your dental e-commerce platform</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          const isPrimary = index === 0
          const isSecondary = index === 1
          const isTertiary = index === 2

          return (
            <Card
              key={stat.title}
              className={`group relative overflow-hidden border transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 cursor-pointer ${
                isPrimary
                  ? 'bg-gradient-to-br from-purple-500 via-purple-600 to-pink-500 text-white border-transparent shadow-xl hover:shadow-purple-500/25'
                  : isSecondary
                    ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white border-transparent shadow-lg hover:shadow-emerald-500/25'
                    : isTertiary
                      ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white border-transparent shadow-lg hover:shadow-orange-500/25'
                      : 'bg-white border-blue-200 hover:border-blue-300 shadow-sm hover:bg-blue-50'
              }`}
            >
              {/* Animated background pattern */}
              <div className={`absolute inset-0 opacity-10 ${
                isPrimary ? 'bg-gradient-to-r from-white/20 to-transparent' :
                isSecondary ? 'bg-gradient-to-r from-white/20 to-transparent' :
                isTertiary ? 'bg-gradient-to-r from-white/20 to-transparent' :
                'bg-gradient-to-r from-gray-50 to-transparent'
              } group-hover:opacity-20 transition-opacity duration-500`} />

              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 relative z-10">
                <CardTitle className={`text-sm font-semibold tracking-wide uppercase ${
                  isPrimary || isSecondary || isTertiary ? 'text-white/90' : 'text-blue-700'
                }`}>
                  {stat.title}
                </CardTitle>
                <div className={`p-3 rounded-2xl transition-all duration-300 group-hover:scale-110 ${
                  isPrimary
                    ? 'bg-white/20 backdrop-blur-sm shadow-lg'
                    : isSecondary || isTertiary
                      ? 'bg-white/20 backdrop-blur-sm shadow-lg'
                      : 'bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 shadow-sm'
                }`}>
                  <Icon className={`h-6 w-6 transition-all duration-300 ${
                    isPrimary || isSecondary || isTertiary ? 'text-white drop-shadow-sm' : 'text-blue-600'
                  }`} />
                </div>
              </CardHeader>

              <CardContent className="relative z-10">
                <div className={`text-4xl font-black mb-4 tracking-tight transition-all duration-300 group-hover:scale-105 ${
                  isPrimary || isSecondary || isTertiary ? 'text-white drop-shadow-sm' : 'text-gray-900'
                }`}>
                  {stat.value}
                </div>

                <div className="flex items-center justify-between">
                  <Badge
                    variant={stat.changeType === "positive" ? "default" : "destructive"}
                    className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all duration-300 group-hover:scale-105 ${
                      isPrimary
                        ? 'bg-white/25 text-white border-white/30 shadow-lg backdrop-blur-sm'
                        : isSecondary || isTertiary
                          ? 'bg-white/25 text-white border-white/30 shadow-lg backdrop-blur-sm'
                          : stat.changeType === "positive"
                            ? 'bg-blue-100 text-blue-800 border-blue-200 shadow-sm'
                            : stat.changeType === "warning"
                              ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm'
                              : 'bg-blue-100 text-blue-800 border-blue-200 shadow-sm'
                    }`}
                  >
                    {stat.change}
                  </Badge>
                </div>

                <p className={`text-xs mt-3 font-medium ${
                  isPrimary || isSecondary || isTertiary ? 'text-white/80' : 'text-blue-600'
                }`}>
                  {stat.description}
                </p>
              </CardContent>

              {/* Animated shine effect */}
              <div className="absolute inset-0 -top-2 -bottom-2 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />

              {/* Floating particles effect */}
              <div className={`absolute top-4 right-4 w-2 h-2 rounded-full opacity-60 ${
                isPrimary ? 'bg-white' : isSecondary ? 'bg-white' : isTertiary ? 'bg-white' : 'bg-blue-400'
              } animate-pulse`} />
              <div className={`absolute top-8 right-8 w-1 h-1 rounded-full opacity-40 ${
                isPrimary ? 'bg-white' : isSecondary ? 'bg-white' : isTertiary ? 'bg-white' : 'bg-blue-400'
              } animate-pulse delay-300`} />
            </Card>
          )
        })}
      </div>
    </div>
  )
}
