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

// Sample patient data
const recentPatients = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice.johnson@email.com",
    avatar: "",
    lastVisit: "2024-01-15",
    treatment: "Dental Cleaning",
    status: "Completed",
    amount: "$120",
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob.smith@email.com",
    avatar: "",
    lastVisit: "2024-01-14",
    treatment: "Root Canal",
    status: "In Progress",
    amount: "$850",
  },
  {
    id: "3",
    name: "Carol Davis",
    email: "carol.davis@email.com",
    avatar: "",
    lastVisit: "2024-01-13",
    treatment: "Teeth Whitening",
    status: "Scheduled",
    amount: "$300",
  },
  {
    id: "4",
    name: "David Wilson",
    email: "david.wilson@email.com",
    avatar: "",
    lastVisit: "2024-01-12",
    treatment: "Dental Implant",
    status: "Completed",
    amount: "$2,500",
  },
  {
    id: "5",
    name: "Eva Brown",
    email: "eva.brown@email.com",
    avatar: "",
    lastVisit: "2024-01-11",
    treatment: "Orthodontic Consultation",
    status: "Scheduled",
    amount: "$150",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "Completed":
      return "default"
    case "In Progress":
      return "secondary"
    case "Scheduled":
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
          <CardTitle>Recent Patients</CardTitle>
          <CardDescription>
            Latest patient visits and treatment information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Treatment</TableHead>
                <TableHead>Last Visit</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={patient.avatar} alt={patient.name} />
                        <AvatarFallback>
                          {patient.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{patient.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {patient.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{patient.treatment}</TableCell>
                  <TableCell>
                    {formatDate(patient.lastVisit)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(patient.status)}>
                      {patient.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {patient.amount}
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
