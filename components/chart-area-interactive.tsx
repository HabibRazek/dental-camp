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
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{formatDate(label)}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.name === 'Revenue' ? formatCurrency(entry.value) : entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <CardTitle>Sales Performance</CardTitle>
        <CardDescription>
          <span className="@[540px]/card:block hidden">
            Track your e-commerce metrics and sales trends
          </span>
          <span className="@[540px]/card:hidden">Sales metrics</span>
        </CardDescription>
        <div className="absolute right-4 top-4 flex gap-2">
          <Select value={viewType} onValueChange={setViewType}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overview">Overview</SelectItem>
              <SelectItem value="revenue">Revenue</SelectItem>
              <SelectItem value="orders">Orders</SelectItem>
            </SelectContent>
          </Select>

          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15d">Last 15 days</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
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
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorCustomers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
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
                    stroke="#3b82f6"
                    fill="url(#colorRevenue)"
                    name="Revenue"
                  />
                  <Area
                    type="monotone"
                    dataKey="orders"
                    stackId="2"
                    stroke="#10b981"
                    fill="url(#colorOrders)"
                    name="Orders"
                  />
                </>
              )}

              {viewType === "revenue" && (
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  fill="url(#colorRevenue)"
                  name="Revenue"
                />
              )}

              {viewType === "orders" && (
                <>
                  <Area
                    type="monotone"
                    dataKey="orders"
                    stroke="#10b981"
                    fill="url(#colorOrders)"
                    name="Orders"
                  />
                  <Area
                    type="monotone"
                    dataKey="customers"
                    stroke="#f59e0b"
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
