"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal, Search, Filter, Eye, Trash2, MessageSquare } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ContactMessage } from "@/app/admin/messages/page"
import Link from "next/link"

interface ContactMessagesTableProps {
  data: ContactMessage[]
  onStatusChange: (messageId: string, newStatus: string) => void
  onPriorityChange: (messageId: string, newPriority: string) => void
  onDelete: (messageId: string) => void
  filters: {
    status: string
    priority: string
    search: string
  }
  onFilterChange: (filters: { status: string; priority: string; search: string }) => void
  pagination?: {
    currentPage: number
    totalPages: number
    totalCount: number
    itemsPerPage: number
    onPageChange: (page: number) => void
    onPreviousPage: () => void
    onNextPage: () => void
  }
  loading?: boolean
}

const getStatusBadge = (status: string) => {
  const variants = {
    UNREAD: "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25 hover:shadow-red-500/40 border-red-500 animate-pulse",
    READ: "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 border-blue-500",
    IN_PROGRESS: "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 border-amber-500",
    RESOLVED: "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 border-emerald-500",
    ARCHIVED: "bg-gradient-to-r from-slate-500 to-gray-600 text-white shadow-lg shadow-slate-500/25 hover:shadow-slate-500/40 border-slate-500"
  }
  return variants[status as keyof typeof variants] || variants.UNREAD
}

const getPriorityBadge = (priority: string) => {
  const variants = {
    LOW: "bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-md shadow-gray-400/20 hover:shadow-gray-400/30 border-gray-400",
    NORMAL: "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 border-blue-500",
    HIGH: "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md shadow-orange-500/20 hover:shadow-orange-500/30 border-orange-500",
    URGENT: "bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg shadow-red-600/30 hover:shadow-red-600/50 border-red-600 animate-pulse"
  }
  return variants[priority as keyof typeof variants] || variants.NORMAL
}

const getStatusIcon = (status: string) => {
  const icons = {
    UNREAD: "🔴",
    READ: "👁️",
    IN_PROGRESS: "⚡",
    RESOLVED: "✅",
    ARCHIVED: "📁"
  }
  return icons[status as keyof typeof icons] || icons.UNREAD
}

const getPriorityIcon = (priority: string) => {
  const icons = {
    LOW: "🟢",
    NORMAL: "🔵",
    HIGH: "🟠",
    URGENT: "🔴"
  }
  return icons[priority as keyof typeof icons] || icons.NORMAL
}

export function ContactMessagesTable({
  data,
  onStatusChange,
  onPriorityChange,
  onDelete,
  filters,
  onFilterChange,
  pagination,
  loading = false
}: ContactMessagesTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const columns: ColumnDef<ContactMessage>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-blue-50"
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="font-medium">
          <div>{row.getValue("name")}</div>
          <div className="text-sm text-gray-500">{row.original.email}</div>
        </div>
      ),
    },
    {
      accessorKey: "subject",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-blue-50"
          >
            Subject
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="max-w-[200px]">
          <div className="font-medium truncate">{row.getValue("subject")}</div>
          <div className="text-sm text-gray-500 truncate">{row.original.message}</div>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return (
          <Select
            value={status}
            onValueChange={(value) => onStatusChange(row.original.id, value)}
          >
            <SelectTrigger className="w-36 border-none bg-transparent p-1 h-auto">
              <Badge className={`${getStatusBadge(status)} transition-all duration-300 hover:scale-105 cursor-pointer px-3 py-1.5 rounded-full font-medium text-xs flex items-center gap-1.5`}>
                <span className="text-sm">{getStatusIcon(status)}</span>
                {status.replace('_', ' ')}
              </Badge>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="UNREAD" className="flex items-center gap-2">
                <span className="flex items-center gap-2">
                  🔴 Unread
                </span>
              </SelectItem>
              <SelectItem value="READ" className="flex items-center gap-2">
                <span className="flex items-center gap-2">
                  👁️ Read
                </span>
              </SelectItem>
              <SelectItem value="IN_PROGRESS" className="flex items-center gap-2">
                <span className="flex items-center gap-2">
                  ⚡ In Progress
                </span>
              </SelectItem>
              <SelectItem value="RESOLVED" className="flex items-center gap-2">
                <span className="flex items-center gap-2">
                  ✅ Resolved
                </span>
              </SelectItem>
              <SelectItem value="ARCHIVED" className="flex items-center gap-2">
                <span className="flex items-center gap-2">
                  📁 Archived
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
        )
      },
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }) => {
        const priority = row.getValue("priority") as string
        return (
          <Select
            value={priority}
            onValueChange={(value) => onPriorityChange(row.original.id, value)}
          >
            <SelectTrigger className="w-28 border-none bg-transparent p-1 h-auto">
              <Badge className={`${getPriorityBadge(priority)} transition-all duration-300 hover:scale-105 cursor-pointer px-3 py-1.5 rounded-full font-medium text-xs flex items-center gap-1.5`}>
                <span className="text-sm">{getPriorityIcon(priority)}</span>
                {priority}
              </Badge>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LOW" className="flex items-center gap-2">
                <span className="flex items-center gap-2">
                  🟢 Low
                </span>
              </SelectItem>
              <SelectItem value="NORMAL" className="flex items-center gap-2">
                <span className="flex items-center gap-2">
                  🔵 Normal
                </span>
              </SelectItem>
              <SelectItem value="HIGH" className="flex items-center gap-2">
                <span className="flex items-center gap-2">
                  🟠 High
                </span>
              </SelectItem>
              <SelectItem value="URGENT" className="flex items-center gap-2">
                <span className="flex items-center gap-2">
                  🔴 Urgent
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
        )
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-blue-50"
          >
            Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"))
        return (
          <div className="text-sm">
            <div>{date.toLocaleDateString()}</div>
            <div className="text-gray-500">{date.toLocaleTimeString()}</div>
          </div>
        )
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const message = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(message.email)}
              >
                Copy email
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/admin/messages/${message.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(message.id)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete message
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: pagination ? undefined : getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    manualPagination: !!pagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <MessageSquare className="h-6 w-6" />
              Contact Messages
            </CardTitle>
            <CardDescription>
              Manage customer inquiries and support requests
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex items-center gap-4 py-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search messages..."
              value={filters.search}
              onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
              className="pl-10"
            />
          </div>
          
          <Select
            value={filters.status}
            onValueChange={(value) => onFilterChange({ ...filters, status: value })}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">📋 All Status</SelectItem>
              <SelectItem value="UNREAD">🔴 Unread</SelectItem>
              <SelectItem value="READ">👁️ Read</SelectItem>
              <SelectItem value="IN_PROGRESS">⚡ In Progress</SelectItem>
              <SelectItem value="RESOLVED">✅ Resolved</SelectItem>
              <SelectItem value="ARCHIVED">📁 Archived</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.priority}
            onValueChange={(value) => onFilterChange({ ...filters, priority: value })}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">📊 All Priority</SelectItem>
              <SelectItem value="LOW">🟢 Low</SelectItem>
              <SelectItem value="NORMAL">🔵 Normal</SelectItem>
              <SelectItem value="HIGH">🟠 High</SelectItem>
              <SelectItem value="URGENT">🔴 Urgent</SelectItem>
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="hover:bg-gray-50"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-2">Loading messages...</span>
                      </div>
                    ) : (
                      "No messages found."
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {pagination && (
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {pagination.totalCount} message(s) selected.
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-sm text-muted-foreground">
                Page {pagination.currentPage} of {pagination.totalPages}
                ({pagination.totalCount} total messages)
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={pagination.onPreviousPage}
                disabled={pagination.currentPage <= 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={pagination.onNextPage}
                disabled={pagination.currentPage >= pagination.totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
