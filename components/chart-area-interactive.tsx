"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, ResponsiveContainer, Tooltip, Legend } from "recharts"
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
import { formatDate } from "@/lib/utils"

// Sample e-commerce data
const chartData = [
  { date: "2024-01-01", orders: 45, revenue: 18500, customers: 38, products: 127 },
  { date: "2024-01-02", orders: 52, revenue: 21200, customers: 42, products: 145 },
  { date: "2024-01-03", orders: 48, revenue: 19800, customers: 40, products: 132 },
  { date: "2024-01-04", orders: 61, revenue: 25100, customers: 51, products: 168 },
  { date: "2024-01-05", orders: 55, revenue: 22500, customers: 47, products: 151 },
  { date: "2024-01-06", orders: 67, revenue: 27700, customers: 58, products: 184 },
  { date: "2024-01-07", orders: 43, revenue: 17300, customers: 36, products: 118 },
  { date: "2024-01-08", orders: 58, revenue: 23800, customers: 49, products: 159 },
  { date: "2024-01-09", orders: 64, revenue: 26400, customers: 55, products: 176 },
  { date: "2024-01-10", orders: 59, revenue: 24900, customers: 51, products: 162 },
  { date: "2024-01-11", orders: 72, revenue: 29200, customers: 63, products: 198 },
  { date: "2024-01-12", orders: 68, revenue: 28800, customers: 59, products: 187 },
  { date: "2024-01-13", orders: 71, revenue: 31100, customers: 62, products: 195 },
  { date: "2024-01-14", orders: 65, revenue: 26500, customers: 56, products: 179 },
  { date: "2024-01-15", orders: 78, revenue: 32800, customers: 68, products: 214 },
]

export function ChartAreaInteractive() {
  const [timeRange, setTimeRange] = React.useState("15d")
  const [viewType, setViewType] = React.useState("overview")

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-01-15")
    let daysToSubtract = 15
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value)
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-2xl p-4 shadow-2xl ring-1 ring-black/5">
          <p className="font-bold text-gray-900 mb-3 text-sm">{formatDate(label)}</p>
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
                  {entry.name === 'Revenue' ? formatCurrency(entry.value) : entry.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="@container/card border border-gray-200/50 shadow-xl bg-gradient-to-br from-white to-gray-50/30 backdrop-blur-sm">
      <CardHeader className="relative border-b border-gray-100/50 bg-gradient-to-r from-white to-gray-50/50">
        <div className="flex flex-col space-y-2">
          <CardTitle className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
            <div className="w-2 h-8 bg-gradient-to-b from-blue-600 to-blue-500 rounded-full"></div>
            Sales Performance
          </CardTitle>
          <CardDescription className="text-gray-600 font-medium">
            <span className="@[540px]/card:block hidden">
              Real-time analytics and performance insights for your dental e-commerce platform
            </span>
            <span className="@[540px]/card:hidden">Sales analytics dashboard</span>
          </CardDescription>
        </div>

        <div className="absolute right-6 top-6 flex gap-3">
          <Select value={viewType} onValueChange={setViewType}>
            <SelectTrigger className="w-36 border-blue-200 bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 shadow-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-blue-200 bg-white/95 backdrop-blur-md">
              <SelectItem value="overview" className="hover:bg-blue-50">📊 Overview</SelectItem>
              <SelectItem value="revenue" className="hover:bg-blue-50">💰 Revenue</SelectItem>
              <SelectItem value="orders" className="hover:bg-blue-50">📦 Orders</SelectItem>
            </SelectContent>
          </Select>

          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-36 border-blue-200 bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 shadow-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-blue-200 bg-white/95 backdrop-blur-md">
              <SelectItem value="15d" className="hover:bg-blue-50">📅 Last 15 days</SelectItem>
              <SelectItem value="7d" className="hover:bg-blue-50">🗓️ Last 7 days</SelectItem>
              <SelectItem value="30d" className="hover:bg-blue-50">📆 Last 30 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={filteredData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorCustomers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                className="text-muted-foreground"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />

              {viewType === "overview" && (
                <>
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stackId="1"
                    stroke="#2563eb"
                    fill="url(#colorRevenue)"
                    name="Revenue"
                  />
                  <Area
                    type="monotone"
                    dataKey="orders"
                    stackId="2"
                    stroke="#3b82f6"
                    fill="url(#colorOrders)"
                    name="Orders"
                  />
                </>
              )}

              {viewType === "revenue" && (
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2563eb"
                  fill="url(#colorRevenue)"
                  name="Revenue"
                />
              )}

              {viewType === "orders" && (
                <>
                  <Area
                    type="monotone"
                    dataKey="orders"
                    stroke="#3b82f6"
                    fill="url(#colorOrders)"
                    name="Orders"
                  />
                  <Area
                    type="monotone"
                    dataKey="customers"
                    stroke="#60a5fa"
                    fill="url(#colorCustomers)"
                    name="Customers"
                  />
                </>
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
