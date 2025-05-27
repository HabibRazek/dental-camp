"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDate } from "@/lib/utils"

// Sample order data
const recentOrders = [
  {
    id: "ORD-001",
    customerName: "Dr. Alice Johnson",
    email: "alice.johnson@dentalclinic.com",
    avatar: "",
    orderDate: "2024-01-15",
    product: "Digital X-Ray Sensor",
    status: "Delivered",
    amount: "$3,200",
  },
  {
    id: "ORD-002",
    customerName: "Dr. Bob Smith",
    email: "bob.smith@oralcare.com",
    avatar: "",
    orderDate: "2024-01-14",
    product: "Dental Handpiece Set",
    status: "Shipped",
    amount: "$1,850",
  },
  {
    id: "ORD-003",
    customerName: "Dr. Carol Davis",
    email: "carol.davis@familydental.com",
    avatar: "",
    orderDate: "2024-01-13",
    product: "LED Curing Light",
    status: "Pending",
    amount: "$680",
  },
  {
    id: "ORD-004",
    customerName: "Dr. David Wilson",
    email: "david.wilson@orthodontics.com",
    avatar: "",
    orderDate: "2024-01-12",
    product: "Dental Chair Unit",
    status: "Delivered",
    amount: "$12,500",
  },
  {
    id: "ORD-005",
    customerName: "Dr. Eva Brown",
    email: "eva.brown@pediatricdental.com",
    avatar: "",
    orderDate: "2024-01-11",
    product: "Sterilization Equipment",
    status: "Shipped",
    amount: "$2,150",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "Delivered":
      return "default"
    case "Shipped":
      return "secondary"
    case "Pending":
      return "outline"
    default:
      return "outline"
  }
}

export function DataTable() {
  return (
    <div className="px-4 lg:px-6">
      <Card className="border border-gray-200/50 shadow-xl bg-gradient-to-br from-white to-gray-50/30 backdrop-blur-sm overflow-hidden">
        <CardHeader className="border-b border-gray-100/50 bg-gradient-to-r from-white to-gray-50/50 pb-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col space-y-2">
              <CardTitle className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                <div className="w-2 h-8 bg-gradient-to-b from-blue-600 to-blue-500 rounded-full"></div>
                Recent Orders
              </CardTitle>
              <CardDescription className="text-gray-600 font-medium">
                Latest orders from dental professionals and clinics
              </CardDescription>
            </div>

            {/* Quick stats */}
            <div className="hidden md:flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{recentOrders.length}</div>
                <div className="text-xs text-gray-500 font-medium">Total Orders</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-700">
                  {recentOrders.filter(o => o.status === 'Delivered').length}
                </div>
                <div className="text-xs text-gray-500 font-medium">Delivered</div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-gray-50/80 to-gray-100/50 hover:from-gray-50 hover:to-gray-100/80 border-b border-gray-200/50">
                  <TableHead className="font-bold text-gray-800 py-4 px-6">
                    <div className="flex items-center gap-2">
                      👤 Customer
                    </div>
                  </TableHead>
                  <TableHead className="font-bold text-gray-800">
                    <div className="flex items-center gap-2">
                      📦 Product
                    </div>
                  </TableHead>
                  <TableHead className="font-bold text-gray-800">
                    <div className="flex items-center gap-2">
                      📅 Order Date
                    </div>
                  </TableHead>
                  <TableHead className="font-bold text-gray-800">
                    <div className="flex items-center gap-2">
                      🚚 Status
                    </div>
                  </TableHead>
                  <TableHead className="text-right font-bold text-gray-800 pr-6">
                    <div className="flex items-center justify-end gap-2">
                      💰 Amount
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order, index) => (
                  <TableRow
                    key={order.id}
                    className="group hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/30 transition-all duration-300 border-b border-gray-100/50 cursor-pointer"
                  >
                    <TableCell className="font-medium py-6 px-6">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12 ring-2 ring-blue-200 group-hover:ring-blue-400 transition-all duration-300 shadow-sm">
                          <AvatarImage src={order.avatar} alt={order.customerName} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 font-bold text-sm">
                            {order.customerName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <div className="font-bold text-gray-900 group-hover:text-blue-900 transition-colors">
                            {order.customerName}
                          </div>
                          <div className="text-sm text-gray-500 group-hover:text-blue-600 transition-colors font-medium">
                            {order.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
                      <div className="max-w-[200px]">
                        <div className="font-bold text-gray-900">{order.product}</div>
                        <div className="text-xs text-gray-500 mt-1">Order #{order.id}</div>
                      </div>
                    </TableCell>

                    <TableCell className="text-gray-600 group-hover:text-gray-800 transition-colors font-medium">
                      <div className="flex flex-col">
                        <span>{formatDate(order.orderDate)}</span>
                        <span className="text-xs text-gray-400">
                          {new Date(order.orderDate).toLocaleDateString('en-US', { weekday: 'short' })}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={getStatusColor(order.status)}
                        className={`font-bold px-3 py-1.5 rounded-full transition-all duration-300 group-hover:scale-105 ${
                          order.status === 'Delivered'
                            ? 'bg-blue-100 text-blue-800 border-blue-200 shadow-blue-100 shadow-sm'
                            : order.status === 'Shipped'
                              ? 'bg-blue-200 text-blue-900 border-blue-300 shadow-blue-100 shadow-sm'
                              : 'bg-blue-50 text-blue-700 border-blue-200 shadow-blue-100 shadow-sm'
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          {order.status === 'Delivered' && '✅'}
                          {order.status === 'Shipped' && '🚚'}
                          {order.status === 'Pending' && '⏳'}
                          {order.status}
                        </div>
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right font-black text-gray-900 text-xl pr-6 group-hover:text-blue-900 transition-colors">
                      <div className="flex flex-col items-end">
                        <span>{order.amount}</span>
                        <span className="text-xs text-gray-400 font-normal">USD</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
