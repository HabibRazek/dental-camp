"use client"

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
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const stats = [
  {
    title: "Total Products Sold",
    value: "12,847",
    change: "+18.5%",
    changeType: "positive" as const,
    icon: Package,
    description: "Products sold this month",
  },
  {
    title: "Active Orders",
    value: "156",
    change: "+23",
    changeType: "positive" as const,
    icon: ShoppingCart,
    description: "Orders being processed",
  },
  {
    title: "Monthly Revenue",
    value: "$284,231",
    change: "+12.8%",
    changeType: "positive" as const,
    icon: DollarSign,
    description: "Revenue this month",
  },
  {
    title: "Customer Satisfaction",
    value: "4.8/5",
    change: "+0.2",
    changeType: "positive" as const,
    icon: Star,
    description: "Average customer rating",
  },
  {
    title: "Average Order Value",
    value: "$1,847",
    change: "+$127",
    changeType: "positive" as const,
    icon: TrendingUp,
    description: "Increased from last month",
  },
  {
    title: "Total Customers",
    value: "3,247",
    change: "+8.3%",
    changeType: "positive" as const,
    icon: Users,
    description: "Registered doctors",
  },
  {
    title: "Inventory Status",
    value: "94%",
    change: "12 low stock",
    changeType: "warning" as const,
    icon: Boxes,
    description: "Stock availability",
  },
  {
    title: "Return Rate",
    value: "2.1%",
    change: "-0.3%",
    changeType: "positive" as const,
    icon: RotateCcw,
    description: "Product returns",
  },
]

export function SectionCards() {
  return (
    <div className="px-4 lg:px-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          const isHighlight = index < 2 // First two cards get special styling
          return (
            <Card
              key={stat.title}
              className={`relative overflow-hidden border-0 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                isHighlight
                  ? 'bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white'
                  : 'bg-white hover:bg-blue-50'
              }`}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className={`text-sm font-semibold ${isHighlight ? 'text-blue-100' : 'text-gray-600'}`}>
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${
                  isHighlight
                    ? 'bg-white/20 backdrop-blur-sm'
                    : 'bg-blue-100'
                }`}>
                  <Icon className={`h-5 w-5 ${isHighlight ? 'text-white' : 'text-blue-600'}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold mb-2 ${isHighlight ? 'text-white' : 'text-gray-900'}`}>
                  {stat.value}
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Badge
                    variant={stat.changeType === "positive" ? "default" : "destructive"}
                    className={`text-xs font-medium ${
                      isHighlight
                        ? 'bg-white/20 text-white border-white/30'
                        : stat.changeType === "positive"
                          ? 'bg-green-100 text-green-700 border-green-200'
                          : 'bg-red-100 text-red-700 border-red-200'
                    }`}
                  >
                    {stat.change}
                  </Badge>
                  <span className={`${isHighlight ? 'text-blue-100' : 'text-gray-500'}`}>
                    {stat.description}
                  </span>
                </div>
              </CardContent>
              {/* Decorative gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-r from-transparent to-white/5 pointer-events-none ${
                isHighlight ? 'opacity-100' : 'opacity-0'
              }`} />
            </Card>
          )
        })}
      </div>
    </div>
  )
}
