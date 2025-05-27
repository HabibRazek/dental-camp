"use client"

import { 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp,
  Heart,
  Clock,
  UserCheck,
  AlertTriangle
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
    title: "Total Patients",
    value: "2,847",
    change: "+12.5%",
    changeType: "positive" as const,
    icon: Users,
    description: "Active patients this month",
  },
  {
    title: "Today's Appointments",
    value: "24",
    change: "+3",
    changeType: "positive" as const,
    icon: Calendar,
    description: "Scheduled for today",
  },
  {
    title: "Monthly Revenue",
    value: "$45,231",
    change: "+8.2%",
    changeType: "positive" as const,
    icon: DollarSign,
    description: "Revenue this month",
  },
  {
    title: "Treatment Success Rate",
    value: "94.2%",
    change: "+2.1%",
    changeType: "positive" as const,
    icon: Heart,
    description: "Patient satisfaction",
  },
  {
    title: "Average Wait Time",
    value: "12 min",
    change: "-3 min",
    changeType: "positive" as const,
    icon: Clock,
    description: "Reduced from last month",
  },
  {
    title: "Staff Utilization",
    value: "87%",
    change: "+5%",
    changeType: "positive" as const,
    icon: UserCheck,
    description: "Staff efficiency rate",
  },
  {
    title: "Equipment Status",
    value: "98%",
    change: "2 alerts",
    changeType: "warning" as const,
    icon: AlertTriangle,
    description: "Equipment operational",
  },
  {
    title: "Growth Rate",
    value: "+15.3%",
    change: "vs last quarter",
    changeType: "positive" as const,
    icon: TrendingUp,
    description: "Patient acquisition",
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
