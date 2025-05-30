"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Mail, Calendar, Shield, MoreHorizontal, UserCheck, UserX, CheckCircle, XCircle, AlertCircle, Trash2, Download, Search, X, Eye, User, Filter } from "lucide-react"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface User {
  id: string
  name: string | null
  email: string
  image: string | null
  createdAt: string
  updatedAt: string
  emailVerified: string | null
  isActive: boolean
  accounts: { provider: string }[]
}

interface Pagination {
  currentPage: number
  totalPages: number
  totalCount: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

interface CustomersTableProps {
  initialUsers?: User[]
  initialPagination?: Pagination
}

export function CustomersTable({ initialUsers = [], initialPagination }: CustomersTableProps) {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [pagination, setPagination] = useState<Pagination>(
    initialPagination || {
      currentPage: 1,
      totalPages: 1,
      totalCount: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    }
  )
  const [loading, setLoading] = useState(false)
  const [creatingUsers, setCreatingUsers] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchLoading, setSearchLoading] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [showAddCustomer, setShowAddCustomer] = useState(false)
  const [addingCustomer, setAddingCustomer] = useState(false)
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    password: ""
  })



  const fetchUsers = async (page: number, search?: string) => {
    setLoading(true)
    try {
      const searchParam = search || searchQuery
      const url = searchParam
        ? `/api/customers?page=${page}&limit=10&search=${encodeURIComponent(searchParam)}`
        : `/api/customers?page=${page}&limit=10`

      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
        setPagination(data.pagination)
      }
    } catch (error) {
      toast.error("Failed to fetch users")
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchUsers(newPage)
    }
  }

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    setSearchLoading(true)
    try {
      await fetchUsers(1, query) // Reset to page 1 when searching
    } finally {
      setSearchLoading(false)
    }
  }

  const handleClearSearch = () => {
    setSearchQuery("")
    fetchUsers(1, "") // Reset to page 1 and clear search
  }

  const handleViewCustomer = (customer: User) => {
    setSelectedCustomer(customer)
    setShowDetails(true)
  }

  const handleCloseDetails = () => {
    setShowDetails(false)
    setSelectedCustomer(null)
  }

  const handleAddCustomer = () => {
    setShowAddCustomer(true)
  }

  const handleCloseAddCustomer = () => {
    setShowAddCustomer(false)
    setNewCustomer({ name: "", email: "", password: "" })
  }

  const handleCreateCustomer = async () => {
    if (!newCustomer.name || !newCustomer.email || !newCustomer.password) {
      toast.error('Please fill in all fields')
      return
    }

    if (newCustomer.password.length < 6) {
      toast.error('Password must be at least 6 characters long')
      return
    }

    setAddingCustomer(true)
    try {
      const response = await fetch('/api/customers/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newCustomer.name,
          email: newCustomer.email,
          password: newCustomer.password,
          autoVerify: true // Automatically verify the customer
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('✅ Customer created successfully!', {
          description: `${newCustomer.name} has been added and automatically verified.`,
          duration: 4000,
        })

        // Reset form and close dialog
        handleCloseAddCustomer()

        // Refresh the users list
        fetchUsers(pagination.currentPage)

        // Emit custom event to update dashboard
        window.dispatchEvent(new CustomEvent('customerUpdated'))
      } else {
        toast.error(data.error || 'Failed to create customer')
      }
    } catch (error) {
      toast.error('An error occurred while creating customer')
    } finally {
      setAddingCustomer(false)
    }
  }

  const handleUserAction = async (userId: string, action: string, value: any) => {
    try {
      const response = await fetch('/api/customers', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, action, value }),
      })

      if (response.ok) {
        // Refresh the users list
        fetchUsers(pagination.currentPage)

        // Emit custom event to update dashboard
        window.dispatchEvent(new CustomEvent('customerUpdated'))

        // Show success toast
        if (action === 'toggleStatus') {
          toast.success(value ? 'User enabled successfully' : 'User disabled successfully')
        } else if (action === 'updateVerification') {
          toast.success(value ? 'User verified successfully' : 'User verification removed')
        } else if (action === 'deleteUser') {
          toast.success('User deleted successfully')
        }
      } else {
        toast.error('Failed to update user')
      }
    } catch (error) {
      toast.error('An error occurred while updating user')
    }
  }

  const handleSendVerificationEmail = async (email: string, userId: string) => {
    try {
      const response = await fetch('/api/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, userId }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Verification email sent successfully!')
      } else {
        toast.error(data.error || 'Failed to send verification email')
      }
    } catch (error) {
      toast.error('An error occurred while sending verification email')
    }
  }

  const handleDeleteUser = async (userId: string, userName: string, userEmail: string) => {
    try {
      // Show loading toast
      toast.loading('Deleting user...', { id: 'delete-user' })

      const response = await fetch('/api/customers', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      })

      const data = await response.json()

      if (response.ok) {
        // Show beautiful success toast
        toast.success(`🗑️ User deleted successfully!`, {
          id: 'delete-user',
          duration: 4000,
          description: `${userName} (${userEmail}) has been permanently removed.`,
          action: {
            label: "Undo",
            onClick: () => toast.info("Undo feature coming soon!")
          }
        })

        // Refresh the users list
        fetchUsers(pagination.currentPage)

        // Emit custom event to update dashboard
        window.dispatchEvent(new CustomEvent('customerUpdated'))
      } else {
        // Show error toast
        toast.error(data.error || 'Failed to delete user', {
          id: 'delete-user',
          duration: 5000,
          description: 'Please try again or contact support if the issue persists.'
        })
      }
    } catch (error) {
      toast.error('Network error occurred', {
        id: 'delete-user',
        duration: 5000,
        description: 'Please check your connection and try again.'
      })
    }
  }

  const handleCreateSampleUsers = async () => {
    setCreatingUsers(true)
    try {
      const response = await fetch('/api/create-sample-users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Sample users created successfully!')
        // Refresh the users list
        fetchUsers(pagination.currentPage)

        // Emit custom event to update dashboard
        window.dispatchEvent(new CustomEvent('customerUpdated'))
      } else {
        toast.error(data.error || 'Failed to create sample users')
      }
    } catch (error) {
      toast.error('An error occurred while creating sample users')
    } finally {
      setCreatingUsers(false)
    }
  }

  const handleExportCSV = async () => {
    try {
      toast.loading('Preparing CSV export...', { id: 'csv-export' })

      const response = await fetch('/api/customers/export-csv')

      if (!response.ok) {
        throw new Error('Failed to export CSV')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url

      // Generate filename with current date
      const now = new Date()
      const dateStr = now.toISOString().split('T')[0] // YYYY-MM-DD format
      link.download = `customers-export-${dateStr}.csv`

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast.success('CSV exported successfully!', {
        id: 'csv-export',
        description: `Downloaded customers-export-${dateStr}.csv`
      })
    } catch (error) {
      toast.error('Failed to export CSV', {
        id: 'csv-export',
        description: 'Please try again or contact support.'
      })
    }
  }



  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getInitials = (name: string | null, email: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase()
    }
    return email[0].toUpperCase()
  }

  const getAuthProvider = (accounts: { provider: string }[], index: number = 0) => {
    if (accounts.length === 0) {
      // 4 different blue colors for email
      const emailColors = [
        'bg-blue-100 text-blue-800 border-blue-200',
        'bg-indigo-100 text-indigo-800 border-indigo-200',
        'bg-sky-100 text-sky-800 border-sky-200',
        'bg-cyan-100 text-cyan-800 border-cyan-200'
      ]
      return {
        name: 'Email',
        color: emailColors[index % emailColors.length],
        logo: (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
          </svg>
        )
      }
    }

    const provider = accounts[0].provider
    switch (provider) {
      case 'google':
        // 4 different Google brand colors
        const googleColors = [
          'bg-red-100 text-red-800 border-red-200', // Google Red
          'bg-yellow-100 text-yellow-800 border-yellow-200', // Google Yellow
          'bg-green-100 text-green-800 border-green-200', // Google Green
          'bg-blue-100 text-blue-800 border-blue-200' // Google Blue
        ]
        return {
          name: 'Google',
          color: googleColors[index % googleColors.length],
          logo: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          )
        }
      case 'credentials':
        // 4 different blue colors for email
        const credentialColors = [
          'bg-blue-100 text-blue-800 border-blue-200',
          'bg-indigo-100 text-indigo-800 border-indigo-200',
          'bg-sky-100 text-sky-800 border-sky-200',
          'bg-cyan-100 text-cyan-800 border-cyan-200'
        ]
        return {
          name: 'Email',
          color: credentialColors[index % credentialColors.length],
          logo: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
          )
        }
      default:
        return {
          name: provider,
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          logo: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
            </svg>
          )
        }
    }
  }

  return (
    <>
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Customers
            </CardTitle>
            <CardDescription>
              Manage and view all registered customers ({pagination.totalCount} total)
            </CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={handleAddCustomer}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <User className="h-4 w-4" />
              Add Customer
            </Button>
            <Button
              onClick={handleExportCSV}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Enhanced Search Interface */}
        <div className="mb-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="h-5 w-5 text-blue-600" />
            <h3 className="font-medium text-gray-900">Advanced Customer Search</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Main Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search by Name or Email
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Enter customer name or email address..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 pr-10"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearSearch}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Quick Filters */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quick Filters
              </label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSearch("active")}
                  className="text-xs"
                >
                  Active
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSearch("disabled")}
                  className="text-xs"
                >
                  Disabled
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSearch("verified")}
                  className="text-xs"
                >
                  Verified
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSearch("google")}
                  className="text-xs"
                >
                  Google
                </Button>
              </div>
            </div>
          </div>

          {/* Search Results Info */}
          {searchQuery && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              {searchLoading ? (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  Searching customers...
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Search className="h-4 w-4" />
                    {pagination.totalCount > 0 ? (
                      <span className="text-green-600 font-medium">
                        Found {pagination.totalCount} customer{pagination.totalCount !== 1 ? 's' : ''} matching "{searchQuery}"
                      </span>
                    ) : (
                      <span className="text-red-600 font-medium">
                        No customers found matching "{searchQuery}"
                      </span>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearSearch}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Clear Search
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Auth Provider</TableHead>
                <TableHead>Verification</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Loading customers...
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <div className="flex flex-col items-center gap-4">
                      <div className="text-gray-500">
                        <Shield className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
                        <p className="text-sm text-gray-500 mb-6">
                          Get started by creating some sample users for testing, or wait for users to register.
                        </p>
                      </div>
                      <Button
                        onClick={handleCreateSampleUsers}
                        disabled={creatingUsers}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {creatingUsers ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Creating Sample Users...
                          </>
                        ) : (
                          <>
                            <UserCheck className="mr-2 h-4 w-4" />
                            Create Sample Users
                          </>
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user, index) => {
                  const authProvider = getAuthProvider(user.accounts, index)
                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.image || undefined} />
                            <AvatarFallback>
                              {getInitials(user.name, user.email)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {user.name || 'No name'}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {user.email.split('@')[0]}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          {user.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${authProvider.color} border font-medium flex items-center gap-1.5`}>
                          {authProvider.logo}
                          {authProvider.name}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {user.emailVerified ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-green-600 font-medium">Verified</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4 text-red-600" />
                              <span className="text-red-600 font-medium">Unverified</span>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {user.isActive ? (
                            <>
                              <UserCheck className="h-4 w-4 text-green-600" />
                              <span className="text-green-600 font-medium">Active</span>
                            </>
                          ) : (
                            <>
                              <UserX className="h-4 w-4 text-red-600" />
                              <span className="text-red-600 font-medium">Disabled</span>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {formatDate(user.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleViewCustomer(user)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleUserAction(user.id, 'toggleStatus', !user.isActive)}
                            >
                              {user.isActive ? (
                                <>
                                  <UserX className="mr-2 h-4 w-4" />
                                  Disable User
                                </>
                              ) : (
                                <>
                                  <UserCheck className="mr-2 h-4 w-4" />
                                  Enable User
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleUserAction(user.id, 'updateVerification', !user.emailVerified)}
                            >
                              {user.emailVerified ? (
                                <>
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Remove Verification
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Verify Email
                                </>
                              )}
                            </DropdownMenuItem>
                            {!user.emailVerified && (
                              <DropdownMenuItem
                                onClick={() => handleSendVerificationEmail(user.email, user.id)}
                              >
                                <Mail className="mr-2 h-4 w-4" />
                                Send Verification Email
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeleteUser(user.id, user.name || 'Unknown', user.email)}
                              className="text-red-600 focus:text-red-600 focus:bg-red-50"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Enhanced Pagination - Always visible */}
        {(
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 sm:space-x-2 py-4">
            <div className="text-sm text-muted-foreground">
              Showing {((pagination.currentPage - 1) * 10) + 1} to{" "}
              {Math.min(pagination.currentPage * 10, pagination.totalCount)} of{" "}
              {pagination.totalCount} customers
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(1)}
                disabled={pagination.currentPage === 1 || loading}
              >
                First
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPreviousPage || loading}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              {/* Page Numbers */}
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let pageNum
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1
                  } else if (pagination.currentPage <= 3) {
                    pageNum = i + 1
                  } else if (pagination.currentPage >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i
                  } else {
                    pageNum = pagination.currentPage - 2 + i
                  }

                  return (
                    <Button
                      key={pageNum}
                      variant={pageNum === pagination.currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                      disabled={loading}
                      className="w-8 h-8 p-0"
                    >
                      {pageNum}
                    </Button>
                  )
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNextPage || loading}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.totalPages)}
                disabled={pagination.currentPage === pagination.totalPages || loading}
              >
                Last
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>

    {/* Customer Details Dialog */}
    <Dialog open={showDetails} onOpenChange={setShowDetails}>
      <DialogContent className="max-w-6xl w-[95vw] h-[85vh] overflow-hidden">
        <DialogHeader className="pb-3">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <User className="h-5 w-5" />
            Customer Details
          </DialogTitle>
          <DialogDescription className="text-sm">
            Complete information for {selectedCustomer?.name || 'this customer'}
          </DialogDescription>
        </DialogHeader>

        {selectedCustomer && (
          <div className="h-full flex flex-col">
            {/* Compact Grid Layout - No Scrolling */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">

              {/* Left Column */}
              <div className="space-y-3">
                {/* Basic Information */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2 text-sm">
                    <User className="h-4 w-4" />
                    Basic Information
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Customer ID</label>
                      <p className="text-xs bg-white border rounded px-2 py-1 font-mono">{selectedCustomer.id}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Full Name</label>
                      <p className="text-xs bg-white border rounded px-2 py-1">{selectedCustomer.name || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Email Address</label>
                      <p className="text-xs bg-white border rounded px-2 py-1 font-mono">{selectedCustomer.email}</p>
                    </div>
                  </div>
                </div>

                {/* Account Status */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2 text-sm">
                    <Shield className="h-4 w-4" />
                    Account Status
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-gray-600">Status</label>
                      <div className="flex items-center gap-1">
                        {selectedCustomer.isActive ? (
                          <>
                            <UserCheck className="h-3 w-3 text-green-600" />
                            <span className="text-xs text-green-600 font-medium">Active</span>
                          </>
                        ) : (
                          <>
                            <UserX className="h-3 w-3 text-red-600" />
                            <span className="text-xs text-red-600 font-medium">Disabled</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-gray-600">Email Verification</label>
                      <div className="flex items-center gap-1">
                        {selectedCustomer.emailVerified ? (
                          <>
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            <span className="text-xs text-green-600 font-medium">Verified</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3 text-red-600" />
                            <span className="text-xs text-red-600 font-medium">Unverified</span>
                          </>
                        )}
                      </div>
                    </div>
                    {selectedCustomer.emailVerified && (
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Verified Date</label>
                        <p className="text-xs bg-white border rounded px-2 py-1">
                          {new Date(selectedCustomer.emailVerified).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-3">
                {/* Authentication Information */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <h3 className="font-semibold text-purple-900 mb-2 flex items-center gap-2 text-sm">
                    <Shield className="h-4 w-4" />
                    Authentication
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-gray-600">Provider</label>
                      <p className="text-xs bg-white border rounded px-2 py-1">
                        {selectedCustomer.accounts && selectedCustomer.accounts.length > 0
                          ? selectedCustomer.accounts[0].provider.toUpperCase()
                          : 'EMAIL'}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-gray-600">Account Type</label>
                      <p className="text-xs bg-white border rounded px-2 py-1">
                        {selectedCustomer.accounts && selectedCustomer.accounts.length > 0
                          ? 'OAuth'
                          : 'Email/Password'}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-gray-600">Linked Accounts</label>
                      <p className="text-xs bg-white border rounded px-2 py-1">
                        {selectedCustomer.accounts ? selectedCustomer.accounts.length : 0}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Account Timeline */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4" />
                    Timeline
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Registration Date</label>
                      <p className="text-xs bg-white border rounded px-2 py-1">
                        {new Date(selectedCustomer.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Last Updated</label>
                      <p className="text-xs bg-white border rounded px-2 py-1">
                        {new Date(selectedCustomer.updatedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Compact Action Buttons */}
            <div className="flex justify-between items-center pt-3 border-t mt-3">
              <div className="text-xs text-gray-500">
                Customer ID: {selectedCustomer.id}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCloseDetails}>
                  Close
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    handleUserAction(selectedCustomer.id, 'toggleStatus', !selectedCustomer.isActive)
                    handleCloseDetails()
                  }}
                  variant={selectedCustomer.isActive ? "destructive" : "default"}
                >
                  {selectedCustomer.isActive ? (
                    <>
                      <UserX className="mr-1 h-3 w-3" />
                      Disable
                    </>
                  ) : (
                    <>
                      <UserCheck className="mr-1 h-3 w-3" />
                      Enable
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>

    {/* Add Customer Sheet */}
    <Sheet open={showAddCustomer} onOpenChange={setShowAddCustomer}>
      <SheetContent className="w-[500px] sm:w-[600px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Add New Customer
          </SheetTitle>
          <SheetDescription>
            Create a new customer account. The customer will be automatically verified.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Customer Information Form */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-4 flex items-center gap-2">
              <User className="h-4 w-4" />
              Customer Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <Input
                  placeholder="Enter customer's full name"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <Input
                  type="email"
                  placeholder="Enter customer's email address"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <Input
                  type="password"
                  placeholder="Enter a secure password (min 6 characters)"
                  value={newCustomer.password}
                  onChange={(e) => setNewCustomer({ ...newCustomer, password: e.target.value })}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Password must be at least 6 characters long
                </p>
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Account Settings
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-700 font-medium">Account will be automatically activated</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-700 font-medium">Email will be automatically verified</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-700 font-medium">Customer can login immediately</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={handleCloseAddCustomer} disabled={addingCustomer}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateCustomer}
              disabled={addingCustomer || !newCustomer.name || !newCustomer.email || !newCustomer.password}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {addingCustomer ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Customer...
                </>
              ) : (
                <>
                  <User className="mr-2 h-4 w-4" />
                  Create Customer
                </>
              )}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
    </>
  )
}
