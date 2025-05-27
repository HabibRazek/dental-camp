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
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>
            Latest orders from dental professionals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={order.avatar} alt={order.customerName} />
                        <AvatarFallback>
                          {order.customerName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{order.customerName}</div>
                        <div className="text-sm text-muted-foreground">
                          {order.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{order.product}</TableCell>
                  <TableCell>
                    {formatDate(order.orderDate)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
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
