"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  ShoppingBag, 
  DollarSign,
  Calendar,
  Target,
  Award,
  Zap,
  Star,
  Gift,
  Clock,
  Package
} from "lucide-react"
import { motion } from "framer-motion"
import { useSettings } from "@/contexts/settings-context"

interface UserStatisticsContentProps {
  userId: string
}

interface UserStats {
  totalOrders: number
  totalSpent: number
  averageOrderValue: number
  monthlySpending: Array<{ month: string; amount: number }>
  topCategories: Array<{ name: string; count: number; percentage: number }>
  ordersByStatus: { pending: number; delivered: number; cancelled: number }
  loyaltyPoints: number
  memberSince: string
  lastOrderDate: string
  favoriteProducts: Array<{ name: string; orders: number }>
}

export function UserStatisticsContent({ userId }: UserStatisticsContentProps) {
  const [stats, setStats] = React.useState<UserStats | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [selectedPeriod, setSelectedPeriod] = React.useState('6months')
  const { formatCurrency } = useSettings()

  React.useEffect(() => {
    fetchUserStatistics()
  }, [userId, selectedPeriod])

  const fetchUserStatistics = async () => {
    try {
      setLoading(true)
      console.log('📊 Fetching real user statistics for period:', selectedPeriod)

      const response = await fetch(`/api/user/statistics?period=${selectedPeriod}`)
      if (response.ok) {
        const data = await response.json()
        console.log('📈 Received statistics data for period', selectedPeriod, ':', data)
        console.log('📊 Monthly spending data points:', data.statistics.monthlySpending?.length)
        console.log('📊 Monthly spending data:', data.statistics.monthlySpending)
        setStats(data.statistics)
      } else {
        console.error('Failed to fetch user statistics')
        setStats(null)
      }
    } catch (error) {
      console.error('Error fetching user statistics:', error)
      setStats(null)
    } finally {
      setLoading(false)
    }
  }

  const calculateGrowth = () => {
    if (!stats || stats.monthlySpending.length < 2) return 0
    const current = stats.monthlySpending[stats.monthlySpending.length - 1].amount
    const previous = stats.monthlySpending[stats.monthlySpending.length - 2].amount
    return ((current - previous) / previous) * 100
  }

  const getLoyaltyLevel = (points: number) => {
    if (points >= 2000) return { level: 'Platinum', color: 'bg-purple-500', progress: 100 }
    if (points >= 1000) return { level: 'Gold', color: 'bg-yellow-500', progress: (points / 2000) * 100 }
    if (points >= 500) return { level: 'Silver', color: 'bg-gray-400', progress: (points / 1000) * 100 }
    return { level: 'Bronze', color: 'bg-orange-500', progress: (points / 500) * 100 }
  }

  if (loading) {
    return (
      <div className="px-4 lg:px-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your statistics...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="px-4 lg:px-6">
        <div className="text-center py-12">
          <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Statistics Available</h3>
          <p className="text-gray-600">Start shopping to see your statistics here!</p>
        </div>
      </div>
    )
  }

  const growth = calculateGrowth()
  const loyaltyInfo = getLoyaltyLevel(stats.loyaltyPoints)

  return (
    <div className="px-4 lg:px-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-blue-500" />
            My Statistics
          </h1>
          <p className="text-gray-600 mt-2">
            Insights into your shopping patterns and preferences
          </p>
        </div>
        <div className="flex gap-2">
          {['3months', '6months', '1year'].map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
              className={selectedPeriod === period ? 'bg-blue-600 text-white' : ''}
            >
              {period === '3months' ? '3M' : period === '6months' ? '6M' : '1Y'}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border border-gray-200/50 shadow-xl bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
                  <p className="text-xs text-blue-600 mt-1">Since joining</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <ShoppingBag className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border border-gray-200/50 shadow-xl bg-gradient-to-br from-white to-green-50/30 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Spent</p>
                  <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats.totalSpent)}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {growth > 0 ? (
                      <TrendingUp className="h-3 w-3 text-green-600" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-600" />
                    )}
                    <p className={`text-xs ${growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {Math.abs(growth).toFixed(1)}% vs last month
                    </p>
                  </div>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border border-gray-200/50 shadow-xl bg-gradient-to-br from-white to-purple-50/30 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Order</p>
                  <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats.averageOrderValue)}</p>
                  <p className="text-xs text-purple-600 mt-1">Per order</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Target className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border border-gray-200/50 shadow-xl bg-gradient-to-br from-white to-yellow-50/30 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Loyalty Points</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.loyaltyPoints}</p>
                  <Badge className={`${loyaltyInfo.color} text-white text-xs mt-1`}>
                    {loyaltyInfo.level} Member
                  </Badge>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Award className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Spending Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border border-gray-200/50 shadow-xl bg-gradient-to-br from-white to-gray-50/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Monthly Spending
              </CardTitle>
              <CardDescription>
                Your spending pattern over the last {
                  selectedPeriod === '3months' ? '3 months' :
                  selectedPeriod === '6months' ? '6 months' :
                  selectedPeriod === '1year' ? '12 months' : '6 months'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.monthlySpending.map((month, index) => {
                  const maxAmount = Math.max(...stats.monthlySpending.map(m => m.amount))
                  const percentage = (month.amount / maxAmount) * 100
                  
                  return (
                    <div key={month.month} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-gray-700">{month.month}</span>
                        <span className="font-bold text-gray-900">{formatCurrency(month.amount)}</span>
                      </div>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ delay: 0.7 + index * 0.1, duration: 0.8 }}
                        className="h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                      />
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Categories */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="border border-gray-200/50 shadow-xl bg-gradient-to-br from-white to-gray-50/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Package className="h-5 w-5 text-green-600" />
                Top Categories
              </CardTitle>
              <CardDescription>Your most purchased product categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.topCategories.map((category, index) => (
                  <motion.div
                    key={category.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700">{category.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">{category.count} orders</span>
                        <Badge variant="secondary">{category.percentage}%</Badge>
                      </div>
                    </div>
                    <Progress value={category.percentage} className="h-2" />
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
