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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <Badge
                    variant={stat.changeType === "positive" ? "default" : "destructive"}
                    className="text-xs"
                  >
                    {stat.change}
                  </Badge>
                  <span>{stat.description}</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
