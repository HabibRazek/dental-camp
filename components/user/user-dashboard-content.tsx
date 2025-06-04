"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import {
  ShoppingBag,
  Heart,
  CreditCard,
  Package,
  TrendingUp,
  Calendar,
  MapPin,
  Star,
  ArrowRight,
  DollarSign,
  Gift,
  Zap,
  Award,
  Target,
  Clock,
  CheckCircle,
  Truck,
  Eye,
  Plus,
  Sparkles,
  Crown,
  Flame,
  HelpCircle,
} from "lucide-react"

interface UserDashboardContentProps {
  user: {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    role: string
  }
}

export function UserDashboardContent({ user }: UserDashboardContentProps) {
  // Mock data - in real app, this would come from API
  const stats = {
    totalOrders: 12,
    totalSpent: 2450.00,
    wishlistItems: 8,
    loyaltyPoints: 1250,
    monthlyGrowth: 15.2,
    completedOrders: 10,
    pendingOrders: 2,
    savedAmount: 350.75,
  }

  // Format currency in TND
  const formatPrice = (price: number) => {
    return `${price.toFixed(3)} TND`
  }

  const recentOrders = [
    {
      id: "ORD-001",
      date: "2024-01-15",
      status: "Delivered",
      total: 299.990,
      items: 3,
    },
    {
      id: "ORD-002",
      date: "2024-01-10",
      status: "Shipped",
      total: 149.500,
      items: 2,
    },
    {
      id: "ORD-003",
      date: "2024-01-05",
      status: "Processing",
      total: 89.990,
      items: 1,
    },
  ]

  const wishlistItems = [
    {
      id: "1",
      name: "Professional Dental Scaler",
      price: 199.990,
      image: "/images/dental-equipment.jpg",
    },
    {
      id: "2",
      name: "Ultrasonic Cleaner",
      price: 299.990,
      image: "/images/dental-equipment.jpg",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {user.name || "User"}!</h1>
            <p className="text-blue-100 mt-1">
              Here's what's happening with your account today.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Package className="h-8 w-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Orders Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-500 to-blue-600 text-white group hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <ShoppingBag className="h-6 w-6" />
                </div>
                <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                  +{stats.pendingOrders} pending
                </Badge>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium opacity-90">Total Orders</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">{stats.totalOrders}</span>
                  <span className="text-sm opacity-75">orders</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="h-4 w-4" />
                  <span>+2 from last month</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Total Spent Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white group hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <DollarSign className="h-6 w-6" />
                </div>
                <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                  +{stats.monthlyGrowth}%
                </Badge>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium opacity-90">Total Spent</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">{formatPrice(stats.totalSpent)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Flame className="h-4 w-4" />
                  <span>+{stats.monthlyGrowth}% from last month</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Wishlist Items Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-500 to-purple-600 text-white group hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Heart className="h-6 w-6" />
                </div>
                <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                  +3 this week
                </Badge>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium opacity-90">Wishlist Items</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">{stats.wishlistItems}</span>
                  <span className="text-sm opacity-75">items</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Sparkles className="h-4 w-4" />
                  <span>Ready to purchase</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Loyalty Points Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-orange-500 to-orange-600 text-white group hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Crown className="h-6 w-6" />
                </div>
                <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                  VIP Status
                </Badge>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium opacity-90">Loyalty Points</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">{stats.loyaltyPoints}</span>
                  <span className="text-sm opacity-75">pts</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Award className="h-4 w-4" />
                  <span>+120 this month</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Additional Stats Row */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Order Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                Order Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Completed</span>
                  </div>
                  <span className="font-semibold">{stats.completedOrders}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">Pending</span>
                  </div>
                  <span className="font-semibold">{stats.pendingOrders}</span>
                </div>
                <Progress value={(stats.completedOrders / stats.totalOrders) * 100} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {Math.round((stats.completedOrders / stats.totalOrders) * 100)}% completion rate
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Savings Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Gift className="h-5 w-5 text-green-600" />
                Total Savings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-2xl font-bold text-green-600">
                  {formatPrice(stats.savedAmount)}
                </div>
                <p className="text-sm text-muted-foreground">
                  Saved through discounts & offers
                </p>
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <Zap className="h-4 w-4" />
                  <span>Keep shopping to save more!</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Action Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-600" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button asChild className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                  <Link href="/catalog">
                    <Plus className="mr-2 h-4 w-4" />
                    Browse Products
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/user/orders">
                    <Eye className="mr-2 h-4 w-4" />
                    Track Orders
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Enhanced Recent Orders */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Package className="h-5 w-5 text-blue-600" />
                    Recent Orders
                  </CardTitle>
                  <CardDescription className="text-gray-600">Your latest purchases</CardDescription>
                </div>
                <Button asChild variant="outline" size="sm" className="hover:bg-blue-50">
                  <Link href="/user/orders">
                    View All
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {recentOrders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                        <Package className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{order.id}</p>
                        <p className="text-sm text-gray-600">{order.items} items • {order.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-gray-900">{formatPrice(order.total)}</p>
                      <Badge
                        variant={
                          order.status === "Delivered" ? "default" :
                          order.status === "Shipped" ? "secondary" : "outline"
                        }
                        className={
                          order.status === "Delivered" ? "bg-green-100 text-green-700 hover:bg-green-200" :
                          order.status === "Shipped" ? "bg-blue-100 text-blue-700 hover:bg-blue-200" :
                          "bg-orange-100 text-orange-700 hover:bg-orange-200"
                        }
                      >
                        {order.status}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Enhanced Wishlist Preview */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Heart className="h-5 w-5 text-purple-600" />
                    Wishlist
                  </CardTitle>
                  <CardDescription className="text-gray-600">Items you're interested in</CardDescription>
                </div>
                <Button asChild variant="outline" size="sm" className="hover:bg-purple-50">
                  <Link href="/user/wishlist">
                    View All
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {wishlistItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-purple-200 hover:bg-purple-50/30 transition-all duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={48}
                          height={48}
                          className="object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.parentElement!.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center"><span class="text-purple-600 font-bold text-lg">D</span></div>';
                          }}
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
                        <p className="text-sm font-bold text-purple-600">{formatPrice(item.price)}</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
                    >
                      <Plus className="mr-1 h-4 w-4" />
                      Add to Cart
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Enhanced Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
      >
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-gray-50 to-blue-50/30">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              <Zap className="h-6 w-6 text-blue-600" />
              Quick Actions
            </CardTitle>
            <CardDescription className="text-gray-600">Frequently used features for faster access</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  asChild
                  className="h-24 flex-col space-y-3 w-full bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Link href="/catalog">
                    <ShoppingBag className="h-8 w-8" />
                    <span className="font-semibold">Browse Products</span>
                  </Link>
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  asChild
                  className="h-24 flex-col space-y-3 w-full bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Link href="/user/orders">
                    <Truck className="h-8 w-8" />
                    <span className="font-semibold">Track Orders</span>
                  </Link>
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  asChild
                  className="h-24 flex-col space-y-3 w-full bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Link href="/user/payment-methods">
                    <CreditCard className="h-8 w-8" />
                    <span className="font-semibold">Payment Methods</span>
                  </Link>
                </Button>
              </motion.div>
            </div>

            {/* Additional Quick Links */}
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              <Button
                asChild
                variant="outline"
                className="justify-start h-12 hover:bg-blue-50 hover:border-blue-200 transition-all duration-200"
              >
                <Link href="/user/wishlist" className="flex items-center gap-3">
                  <Heart className="h-5 w-5 text-red-500" />
                  <span>View Wishlist ({stats.wishlistItems} items)</span>
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="justify-start h-12 hover:bg-green-50 hover:border-green-200 transition-all duration-200"
              >
                <Link href="/user/support" className="flex items-center gap-3">
                  <HelpCircle className="h-5 w-5 text-green-500" />
                  <span>Help & Support</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
