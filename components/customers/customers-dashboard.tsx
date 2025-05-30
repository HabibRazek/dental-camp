"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserPlus, UserCheck, UserX, Mail, Calendar, TrendingUp, Activity } from "lucide-react"

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

interface DashboardData {
  users: User[]
  pagination: Pagination
}

interface CustomersDashboardProps {
  initialData: DashboardData
}

export function CustomersDashboard({ initialData }: CustomersDashboardProps) {
  const [dashboardData, setDashboardData] = useState<DashboardData>(initialData)
  const [loading, setLoading] = useState(false)

  // Function to fetch updated dashboard data
  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/customers/dashboard')
      if (response.ok) {
        const data = await response.json()
        setDashboardData(data)
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  // Auto-refresh dashboard data every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchDashboardData, 30000)
    return () => clearInterval(interval)
  }, [])

  // Listen for custom events from the customers table
  useEffect(() => {
    const handleCustomerUpdate = () => {
      fetchDashboardData()
    }

    window.addEventListener('customerUpdated', handleCustomerUpdate)
    return () => window.removeEventListener('customerUpdated', handleCustomerUpdate)
  }, [])

  const calculateStats = () => {
    const totalCustomers = dashboardData.pagination.totalCount
    const activeCustomers = dashboardData.users.filter(user => user.isActive).length
    const inactiveCustomers = dashboardData.users.filter(user => !user.isActive).length
    const verifiedCustomers = dashboardData.users.filter(user => user.emailVerified).length
    const unverifiedCustomers = dashboardData.users.filter(user => !user.emailVerified).length
    
    // Calculate new customers this month
    const now = new Date()
    const thisMonth = dashboardData.users.filter(user => {
      const userDate = new Date(user.createdAt)
      return userDate.getMonth() === now.getMonth() &&
             userDate.getFullYear() === now.getFullYear()
    }).length

    // Calculate new customers this week
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const thisWeek = dashboardData.users.filter(user => {
      const userDate = new Date(user.createdAt)
      return userDate >= oneWeekAgo
    }).length

    // Calculate OAuth vs Email users
    const oauthUsers = dashboardData.users.filter(user => user.accounts.length > 0).length
    const emailUsers = dashboardData.users.filter(user => user.accounts.length === 0).length

    return {
      totalCustomers,
      activeCustomers,
      inactiveCustomers,
      verifiedCustomers,
      unverifiedCustomers,
      thisMonth,
      thisWeek,
      oauthUsers,
      emailUsers,
      activePercentage: totalCustomers > 0 ? Math.round((activeCustomers / totalCustomers) * 100) : 0,
      verifiedPercentage: totalCustomers > 0 ? Math.round((verifiedCustomers / totalCustomers) * 100) : 0
    }
  }

  const stats = calculateStats()

  return (
    <div className="space-y-6 mb-8">
      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.thisWeek} new this week
            </p>
          </CardContent>
          {loading && (
            <div className="absolute top-2 right-2">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
            </div>
          )}
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activeCustomers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activePercentage}% of total customers
            </p>
          </CardContent>
          {loading && (
            <div className="absolute top-2 right-2">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-green-600"></div>
            </div>
          )}
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified Emails</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.verifiedCustomers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.verifiedPercentage}% verification rate
            </p>
          </CardContent>
          {loading && (
            <div className="absolute top-2 right-2">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
            </div>
          )}
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.thisMonth}</div>
            <p className="text-xs text-muted-foreground">
              {stats.thisWeek} in the last 7 days
            </p>
          </CardContent>
          {loading && (
            <div className="absolute top-2 right-2">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-purple-600"></div>
            </div>
          )}
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Customer Status Distribution
            </CardTitle>
            <CardDescription>
              Active vs Inactive customers breakdown
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">Active</span>
                </div>
                <span className="text-sm font-bold">{stats.activeCustomers}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${stats.activePercentage}%` }}
                ></div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-medium">Inactive</span>
                </div>
                <span className="text-sm font-bold">{stats.inactiveCustomers}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${100 - stats.activePercentage}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Verification Status Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Verification Status
            </CardTitle>
            <CardDescription>
              Verified vs Unverified email addresses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium">Verified</span>
                </div>
                <span className="text-sm font-bold">{stats.verifiedCustomers}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${stats.verifiedPercentage}%` }}
                ></div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-sm font-medium">Unverified</span>
                </div>
                <span className="text-sm font-bold">{stats.unverifiedCustomers}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-orange-500 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${100 - stats.verifiedPercentage}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Authentication Methods Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Authentication Methods
          </CardTitle>
          <CardDescription>
            How customers are signing up and logging in
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium">Email/Password</span>
                </div>
                <span className="text-sm font-bold">{stats.emailUsers}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${stats.totalCustomers > 0 ? (stats.emailUsers / stats.totalCustomers) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-medium">Google OAuth</span>
                </div>
                <span className="text-sm font-bold">{stats.oauthUsers}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${stats.totalCustomers > 0 ? (stats.oauthUsers / stats.totalCustomers) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
