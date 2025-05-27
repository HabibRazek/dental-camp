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
                  ? 'bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white border-transparent shadow-xl hover:shadow-blue-500/25'
                  : isSecondary
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white border-transparent shadow-lg hover:shadow-blue-500/25'
                    : isTertiary
                      ? 'bg-gradient-to-br from-blue-400 to-blue-500 text-white border-transparent shadow-lg hover:shadow-blue-400/25'
                      : 'bg-white/80 backdrop-blur-sm border-blue-200/50 hover:border-blue-300 shadow-sm hover:bg-blue-50/50'
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
                  isPrimary || isSecondary || isTertiary ? 'text-white/90' : 'text-gray-600'
                }`}>
                  {stat.title}
                </CardTitle>
                <div className={`p-3 rounded-2xl transition-all duration-300 group-hover:scale-110 ${
                  isPrimary
                    ? 'bg-white/20 backdrop-blur-sm shadow-lg'
                    : isSecondary || isTertiary
                      ? 'bg-white/20 backdrop-blur-sm shadow-lg'
                      : 'bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 shadow-sm'
                }`}>
                  <Icon className={`h-6 w-6 transition-all duration-300 ${
                    isPrimary || isSecondary || isTertiary ? 'text-white drop-shadow-sm' : 'text-gray-700'
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
                              ? 'bg-blue-100 text-blue-700 border-blue-200 shadow-sm'
                              : 'bg-blue-100 text-blue-800 border-blue-200 shadow-sm'
                    }`}
                  >
                    {stat.change}
                  </Badge>
                </div>

                <p className={`text-xs mt-3 font-medium ${
                  isPrimary || isSecondary || isTertiary ? 'text-white/80' : 'text-gray-500'
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
