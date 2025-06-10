"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  ShoppingBag, 
  Heart, 
  TrendingUp, 
  Package, 
  Clock,
  Star,
  ArrowRight,
  Plus,
  DollarSign,
  Users,
  Activity,
  CreditCard,
  Calendar,
  Gift,
  Truck,
  CheckCircle,
  AlertCircle,
  Zap,
  Target,
  Award,
  Sparkles,
  Eye,
  BarChart3,
  PieChart as PieChartIcon,
  Flame,
  Crown,
  MapPin
} from "lucide-react"
import { motion } from "framer-motion"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
import Link from "next/link"

interface UserDashboardContentProps {
  user: any
}

// Interface for dashboard data
interface DashboardData {
  stats: {
    totalOrders: number
    totalSpent: number
    pendingOrders: number
    loyaltyPoints: number
    savedAmount: number
    completionRate: number
    orderGrowth: number
    spendingGrowth: number
    wishlistCount: number
  }
  charts: {
    monthlySpending: Array<{ month: string; amount: number; orders: number }>
    orderStatusData: Array<{ name: string; value: number; color: string; count: number }>
  }
  recentOrders: Array<{
    id: string
    date: string
    status: string
    total: number
    items: number
    product: string
  }>
  wishlistItems: Array<{
    id: string
    name: string
    price: number
    originalPrice: number | null
    discount: number
    image: string
    inStock: boolean
  }>
  user: {
    memberSince: string
    lastOrderDate: string | null
  }
}

export function UserDashboardContent({ user }: UserDashboardContentProps) {
  const [currentTime, setCurrentTime] = React.useState(new Date())
  const [dashboardData, setDashboardData] = React.useState<DashboardData | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  // Update time every second
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Load real dashboard data
  React.useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)
        console.log('📊 Loading dashboard data from API')

        const response = await fetch('/api/user/dashboard')
        if (response.ok) {
          const result = await response.json()
          console.log('✅ Dashboard data loaded:', result.data)
          setDashboardData(result.data)
        } else {
          throw new Error('Failed to fetch dashboard data')
        }
      } catch (error) {
        console.error('❌ Error loading dashboard data:', error)
        setError('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  }

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return "Good Morning"
    if (hour < 17) return "Good Afternoon"
    return "Good Evening"
  }

  const formatPrice = (price: number) => {
    return `${price.toFixed(3)} TND`
  }

  // Show loading state
  if (loading) {
    return (
      <div className="space-y-8 p-6 bg-gradient-to-br from-blue-50/30 via-white to-purple-50/30 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (error || !dashboardData) {
    return (
      <div className="space-y-8 p-6 bg-gradient-to-br from-blue-50/30 via-white to-purple-50/30 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">{error || 'Failed to load dashboard data'}</p>
            <Button
              onClick={() => window.location.reload()}
              className="mt-4"
              variant="outline"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Extract data for easier access
  const { stats, charts, recentOrders, wishlistItems } = dashboardData

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-800'
      case 'Shipped': return 'bg-blue-100 text-blue-800'
      case 'Processing': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered': return <CheckCircle className="h-4 w-4" />
      case 'Shipped': return <Truck className="h-4 w-4" />
      case 'Processing': return <Clock className="h-4 w-4" />
      default: return <AlertCircle className="h-4 w-4" />
    }
  }

  return (
    <motion.div 
      className="space-y-8 p-6 bg-gradient-to-br from-blue-50/30 via-white to-purple-50/30 min-h-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Dynamic Welcome Section */}
      <motion.div 
        variants={itemVariants}
        className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-2xl"
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <Sparkles className="h-8 w-8 text-yellow-300" />
                {getGreeting()}, {user.name || 'User'}!
              </h1>
              <p className="text-blue-100 text-lg mb-4">
                Welcome to your personalized dashboard. Here's your activity overview.
              </p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {currentTime.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {currentTime.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Activity className="h-16 w-16 text-white/80" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Animated background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
      </motion.div>

      {/* Enhanced KPI Cards */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {/* Total Orders Card */}
        <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white group hover:scale-105 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <Badge className="bg-white/20 text-white border-white/30">
                +{stats.pendingOrders} pending
              </Badge>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium opacity-90">Total Orders</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">
                  {stats.totalOrders}
                </span>
                <span className="text-sm opacity-75">orders</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4" />
                <span>{stats.orderGrowth >= 0 ? '+' : ''}{stats.orderGrowth.toFixed(1)}% from last month</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Spent Card */}
        <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-green-500 to-green-600 text-white group hover:scale-105 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <DollarSign className="h-6 w-6" />
              </div>
              <Badge className="bg-white/20 text-white border-white/30">
                {stats.spendingGrowth >= 0 ? '+' : ''}{stats.spendingGrowth.toFixed(1)}%
              </Badge>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium opacity-90">Total Spent</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">
                  {formatPrice(stats.totalSpent)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4" />
                <span>Saved {formatPrice(stats.savedAmount)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Wishlist Card */}
        <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white group hover:scale-105 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Heart className="h-6 w-6" />
              </div>
              <Badge className="bg-white/20 text-white border-white/30">
                {wishlistItems.filter(item => item.discount > 0).length} on sale
              </Badge>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium opacity-90">Wishlist Items</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">
                  {stats.wishlistCount}
                </span>
                <span className="text-sm opacity-75">items</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Gift className="h-4 w-4" />
                <span>Special offers available</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loyalty Points Card */}
        <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white group hover:scale-105 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Crown className="h-6 w-6" />
              </div>
              <Badge className="bg-white/20 text-white border-white/30">
                Gold
              </Badge>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium opacity-90">Loyalty Points</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">
                  {stats.loyaltyPoints}
                </span>
                <span className="text-sm opacity-75">pts</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Zap className="h-4 w-4" />
                <span>{Math.max(0, 1500 - stats.loyaltyPoints)} pts to next tier</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending Chart */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                Monthly Spending
              </CardTitle>
              <CardDescription>Your spending pattern over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={charts.monthlySpending}>
                    <defs>
                      <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="month" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                      formatter={(value) => [`${value} TND`, 'Amount']}
                    />
                    <Area
                      type="monotone"
                      dataKey="amount"
                      stroke="#3B82F6"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorAmount)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Order Status Chart */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <PieChartIcon className="h-5 w-5 text-purple-600" />
                Order Status
              </CardTitle>
              <CardDescription>Distribution of your order statuses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={charts.orderStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {charts.orderStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                      formatter={(value) => [`${value}%`, 'Percentage']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {charts.orderStatusData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm text-gray-600">{item.name} ({item.count})</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Orders & Wishlist */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Package className="h-5 w-5 text-green-600" />
                    Recent Orders
                  </CardTitle>
                  <CardDescription>Your latest purchases and their status</CardDescription>
                </div>
                <Link href="/user/orders">
                  <Button variant="outline" size="sm" className="hover:bg-blue-50">
                    View All
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                        {getStatusIcon(order.status)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{order.id}</p>
                        <p className="text-sm text-gray-600">{order.product}</p>
                        <p className="text-xs text-gray-500">{order.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{formatPrice(order.total)}</p>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Wishlist Items */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-600" />
                    Wishlist
                  </CardTitle>
                  <CardDescription>Items you're interested in</CardDescription>
                </div>
                <Link href="/user/wishlist">
                  <Button variant="outline" size="sm" className="hover:bg-red-50">
                    View All
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {wishlistItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                        <Heart className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{item.name}</p>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-green-600">{formatPrice(item.price)}</p>
                          {item.discount > 0 && (
                            <>
                              <p className="text-xs text-gray-500 line-through">{formatPrice(item.originalPrice)}</p>
                              <Badge variant="destructive" className="text-xs">-{item.discount}%</Badge>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.inStock ? (
                        <Badge className="bg-green-100 text-green-800">In Stock</Badge>
                      ) : (
                        <Badge variant="secondary">Out of Stock</Badge>
                      )}
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-600" />
              Quick Actions
            </CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/products">
                <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2 hover:bg-blue-50 hover:border-blue-200 transition-all duration-300 group">
                  <Plus className="h-8 w-8 text-blue-600 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">Browse Products</span>
                </Button>
              </Link>

              <Link href="/user/wishlist">
                <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2 hover:bg-red-50 hover:border-red-200 transition-all duration-300 group">
                  <Heart className="h-8 w-8 text-red-600 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">My Wishlist</span>
                </Button>
              </Link>

              <Link href="/user/orders">
                <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2 hover:bg-green-50 hover:border-green-200 transition-all duration-300 group">
                  <Package className="h-8 w-8 text-green-600 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">Track Orders</span>
                </Button>
              </Link>

              <Link href="/user/statistics">
                <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2 hover:bg-purple-50 hover:border-purple-200 transition-all duration-300 group">
                  <BarChart3 className="h-8 w-8 text-purple-600 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">View Analytics</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Performance Metrics */}
      <motion.div variants={itemVariants}>
        <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Target className="h-5 w-5 text-indigo-600" />
              Your Progress
            </CardTitle>
            <CardDescription>Track your shopping journey and achievements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Order Completion Rate</span>
                  <span className="text-sm font-bold text-gray-900">{stats.completionRate}%</span>
                </div>
                <Progress value={stats.completionRate} className="h-2" />
                <p className="text-xs text-gray-600">
                  {stats.completionRate >= 90 ? 'Excellent completion rate!' :
                   stats.completionRate >= 70 ? 'Good completion rate!' :
                   'Keep improving your completion rate!'}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Loyalty Progress</span>
                  <span className="text-sm font-bold text-gray-900">83%</span>
                </div>
                <Progress value={83} className="h-2" />
                <p className="text-xs text-gray-600">{Math.max(0, 1500 - stats.loyaltyPoints)} points to Gold tier</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Savings Goal</span>
                  <span className="text-sm font-bold text-gray-900">68%</span>
                </div>
                <Progress value={68} className="h-2" />
                <p className="text-xs text-gray-600">Keep going to reach your goal!</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
