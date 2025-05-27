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
      <Card className="border border-gray-200 shadow-sm bg-white">
        <CardHeader className="border-b border-gray-100 bg-white">
          <CardTitle className="text-xl font-semibold text-gray-900 tracking-tight">Recent Orders</CardTitle>
          <CardDescription className="text-gray-600">
            Latest orders from dental professionals
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50 hover:bg-gray-50/50 border-b border-gray-100">
                <TableHead className="font-semibold text-gray-700 py-4">Customer</TableHead>
                <TableHead className="font-semibold text-gray-700">Product</TableHead>
                <TableHead className="font-semibold text-gray-700">Order Date</TableHead>
                <TableHead className="font-semibold text-gray-700">Status</TableHead>
                <TableHead className="text-right font-semibold text-gray-700">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order, index) => (
                <TableRow
                  key={order.id}
                  className="hover:bg-gray-50/50 transition-colors duration-200 border-b border-gray-100/50"
                >
                  <TableCell className="font-medium py-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10 ring-2 ring-gray-100">
                        <AvatarImage src={order.avatar} alt={order.customerName} />
                        <AvatarFallback className="bg-gray-100 text-gray-700 font-semibold text-sm">
                          {order.customerName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-gray-900">{order.customerName}</div>
                        <div className="text-sm text-gray-500">
                          {order.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-gray-700">{order.product}</TableCell>
                  <TableCell className="text-gray-600">
                    {formatDate(order.orderDate)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={getStatusColor(order.status)}
                      className={`font-medium ${
                        order.status === 'Delivered'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : order.status === 'Shipped'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-bold text-gray-900 text-lg">
                    {order.amount}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
