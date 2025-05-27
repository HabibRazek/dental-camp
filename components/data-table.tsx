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
      <Card className="border-0 shadow-lg bg-white">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
          <CardTitle className="text-xl font-bold text-white">Recent Orders</CardTitle>
          <CardDescription className="text-blue-100">
            Latest orders from dental professionals
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-blue-50 hover:bg-blue-50">
                <TableHead className="font-semibold text-blue-900">Customer</TableHead>
                <TableHead className="font-semibold text-blue-900">Product</TableHead>
                <TableHead className="font-semibold text-blue-900">Order Date</TableHead>
                <TableHead className="font-semibold text-blue-900">Status</TableHead>
                <TableHead className="text-right font-semibold text-blue-900">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order, index) => (
                <TableRow
                  key={order.id}
                  className="hover:bg-blue-50/50 transition-colors duration-200 border-b border-blue-100"
                >
                  <TableCell className="font-medium py-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10 ring-2 ring-blue-100">
                        <AvatarImage src={order.avatar} alt={order.customerName} />
                        <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                          {order.customerName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-gray-900">{order.customerName}</div>
                        <div className="text-sm text-blue-600">
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
                          ? 'bg-green-100 text-green-700 border-green-200'
                          : order.status === 'Shipped'
                            ? 'bg-blue-100 text-blue-700 border-blue-200'
                            : 'bg-orange-100 text-orange-700 border-orange-200'
                      }`}
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-bold text-blue-700 text-lg">
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
