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
          const isPrimary = index === 0 // Only first card gets special styling
          const isSecondary = index === 1 // Second card gets different styling

          return (
            <Card
              key={stat.title}
              className={`relative overflow-hidden border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                isPrimary
                  ? 'bg-gradient-to-br from-slate-900 to-slate-800 text-white border-slate-700 shadow-xl'
                  : isSecondary
                    ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white border-blue-500 shadow-lg'
                    : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm'
              }`}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className={`text-sm font-medium tracking-wide ${
                  isPrimary ? 'text-slate-300' : isSecondary ? 'text-blue-100' : 'text-gray-600'
                }`}>
                  {stat.title}
                </CardTitle>
                <div className={`p-2.5 rounded-xl ${
                  isPrimary
                    ? 'bg-white/10 backdrop-blur-sm'
                    : isSecondary
                      ? 'bg-white/15 backdrop-blur-sm'
                      : 'bg-gray-50 border border-gray-100'
                }`}>
                  <Icon className={`h-5 w-5 ${
                    isPrimary ? 'text-white' : isSecondary ? 'text-white' : 'text-gray-700'
                  }`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold mb-3 tracking-tight ${
                  isPrimary ? 'text-white' : isSecondary ? 'text-white' : 'text-gray-900'
                }`}>
                  {stat.value}
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Badge
                    variant={stat.changeType === "positive" ? "default" : "destructive"}
                    className={`text-xs font-medium px-2 py-1 ${
                      isPrimary
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                        : isSecondary
                          ? 'bg-white/20 text-white border-white/30'
                          : stat.changeType === "positive"
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : stat.changeType === "warning"
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-red-50 text-red-700 border-red-200'
                    }`}
                  >
                    {stat.change}
                  </Badge>
                  <span className={`text-xs ${
                    isPrimary ? 'text-slate-400' : isSecondary ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {stat.description}
                  </span>
                </div>
              </CardContent>
              {/* Subtle decorative element */}
              <div className={`absolute top-0 right-0 w-20 h-20 opacity-10 ${
                isPrimary ? 'bg-white' : isSecondary ? 'bg-white' : 'bg-gray-900'
              } rounded-full -translate-y-10 translate-x-10`} />
            </Card>
          )
        })}
      </div>
    </div>
  )
}
