"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { RefreshCw, TrendingUp, TrendingDown } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface ChartData {
  date: string
  revenue: number
  orders: number
  customers: number
}

interface AnalyticsData {
  monthlyRevenue: Array<{
    month: string
    revenue: number
    orders: number
  }>
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  revenueGrowth: number
  ordersGrowth: number
}

export function ChartAreaInteractive() {
  const [selectedMonth, setSelectedMonth] = React.useState<string>("all")
  const [analytics, setAnalytics] = React.useState<AnalyticsData | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [lastUpdated, setLastUpdated] = React.useState<Date>(new Date())

  const fetchAnalytics = React.useCallback(async () => {
    try {
      setLoading(true)
      // Always fetch 12 months of data
      const response = await fetch(`/api/analytics?timeRange=1y`)
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
        setLastUpdated(new Date())
      } else {
        // Set fallback data
        setAnalytics({
          monthlyRevenue: [],
          totalRevenue: 0,
          totalOrders: 0,
          totalCustomers: 0,
          revenueGrowth: 0,
          ordersGrowth: 0
        })
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
      // Set fallback data on error
      setAnalytics({
        monthlyRevenue: [],
        totalRevenue: 0,
        totalOrders: 0,
        totalCustomers: 0,
        revenueGrowth: 0,
        ordersGrowth: 0
      })
    } finally {
      setLoading(false)
    }
  }, []) // Remove timeRange dependency since we always fetch 12 months

  React.useEffect(() => {
    fetchAnalytics()

    // Auto-refresh every 2 minutes
    const interval = setInterval(fetchAnalytics, 2 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchAnalytics])

  // Generate chart data ONLY from REAL database data - NO hardcoded data
  const chartData = React.useMemo(() => {
    console.log('📊 Processing REAL chart data from analytics:', analytics)

    // If no real data, return empty array (no fake data)
    if (!analytics?.monthlyRevenue || analytics.monthlyRevenue.length === 0) {
      console.log('⚠️ No real data available - showing empty chart')
      return []
    }

    // Process ONLY REAL revenue data from database
    const processedData = analytics.monthlyRevenue
      .filter(item => item.revenue > 0) // Only show months with actual revenue
      .map((item) => {
        const revenue = Number(item.revenue) || 0

        // Extract month and year from the month string (e.g., "Jan 2024")
        const monthParts = item.month.split(' ')
        const monthName = monthParts[0]
        const year = monthParts[1] || new Date().getFullYear()

        console.log(`💰 REVENUE DATA: ${item.month} - Revenue: ${revenue} TND`)

        return {
          date: item.date || new Date().toISOString().split('T')[0],
          revenue: revenue,
          month: monthName,
          fullMonth: `${monthName} ${year}`,
          displayName: item.month
        }
      })

    console.log('✅ Processed REAL chart data:', processedData.length, 'months with actual data')

    // Filter by selected month if not "all"
    if (selectedMonth !== "all") {
      const filtered = processedData.filter(item => item.fullMonth === selectedMonth)
      console.log(`🔍 Filtered to selected month "${selectedMonth}":`, filtered.length, 'items')
      return filtered
    }

    return processedData
  }, [analytics, selectedMonth])

  // Get available months ONLY from REAL data - NO hardcoded months
  const availableMonths = React.useMemo(() => {
    // If no real data, return empty array (no fake months)
    if (!analytics?.monthlyRevenue || analytics.monthlyRevenue.length === 0) {
      console.log('⚠️ No real data - no months available for selection')
      return []
    }

    // Extract months ONLY from real analytics data that has actual revenue
    return analytics.monthlyRevenue
      .filter(item => item.revenue > 0) // Only months with real revenue
      .map((item) => {
        const monthParts = item.month.split(' ')
        const monthName = monthParts[0]
        const year = monthParts[1] || new Date().getFullYear()

        // Convert short month to long month name
        const monthDate = new Date(`${monthName} 1, ${year}`)
        return monthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      })
  }, [analytics])

  const formatCurrency = (value: number) => {
    return `${value.toLocaleString()} TND`
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-2xl p-4 shadow-2xl ring-1 ring-black/5">
          <p className="font-bold text-gray-900 mb-3 text-sm">{label}</p>
          <div className="space-y-2">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full shadow-sm"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm font-medium text-gray-700">{entry.name}</span>
                </div>
                <span className="font-bold text-gray-900 text-sm">
                  {entry.name === 'Revenue (TND)' ? formatCurrency(entry.value) : entry.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )
    }
    return null
  }

  if (loading && !analytics) {
    return (
      <Card className="@container/card border border-gray-200/50 shadow-xl bg-gradient-to-br from-white to-gray-50/30 backdrop-blur-sm">
        <CardHeader className="border-b border-gray-100/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-gradient-to-b from-blue-600 to-blue-500 rounded-full"></div>
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">Sales Performance</CardTitle>
                <CardDescription>Loading real-time data...</CardDescription>
              </div>
            </div>
            <RefreshCw className="h-5 w-5 animate-spin text-blue-600" />
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[350px] bg-gray-100 rounded-lg animate-pulse"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="@container/card border border-gray-200/50 shadow-xl bg-gradient-to-br from-white to-gray-50/30 backdrop-blur-sm">
      <CardHeader className="relative border-b border-gray-100/50 bg-gradient-to-r from-white to-gray-50/50">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
              <div className="w-2 h-8 bg-gradient-to-b from-blue-600 to-blue-500 rounded-full"></div>
              Revenue Performance
              {analytics && (
                <Badge variant="outline" className="ml-2 text-xs">
                  {analytics.revenueGrowth >= 0 ? (
                    <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1 text-red-600" />
                  )}
                  {analytics.revenueGrowth.toFixed(1)}%
                </Badge>
              )}
            </CardTitle>

          </div>
          <CardDescription className="text-gray-600 font-medium flex items-center justify-between">
            <span>
              <span className="@[540px]/card:block hidden">
                Real-time revenue analytics and performance insights for your dental e-commerce platform
              </span>
              <span className="@[540px]/card:hidden">Revenue analytics dashboard</span>
            </span>
            <span className="text-xs text-gray-500">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          </CardDescription>
        </div>

        <div className="absolute right-6 top-6">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-48 border-blue-200 bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 shadow-sm">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent className="border-blue-200 bg-white/95 backdrop-blur-md">
              <SelectItem value="all" className="hover:bg-blue-50">📊 All Months</SelectItem>
              {availableMonths.map((month) => (
                <SelectItem key={month} value={month} className="hover:bg-blue-50">
                  📅 {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {analytics && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {analytics.totalRevenue.toLocaleString()} TND
              </div>
              <div className="text-sm text-gray-600">Total Revenue</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {analytics.totalOrders.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Orders</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {analytics.totalCustomers.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Customers</div>
            </div>
          </div>
        )}


        <div className="h-[350px] w-full">
          {chartData.length === 0 ? (
            <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <div className="text-center">
                <div className="text-6xl mb-4">💰</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Revenue Data Available</h3>
                <p className="text-gray-600 mb-4">
                  Revenue chart will display when you have orders with revenue in your database.
                </p>
                <p className="text-sm text-gray-500">
                  Add some orders with revenue to see dynamic revenue performance here.
                </p>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="month"
                  className="text-muted-foreground"
                />
                <YAxis
                  className="text-muted-foreground"
                  tickFormatter={(value) => `${value.toLocaleString()} TND`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />

                {/* Only show revenue from REAL data */}
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2563eb"
                  fill="url(#colorRevenue)"
                  name="Revenue (TND)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
