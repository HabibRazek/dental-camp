"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package,
  Download,
  RefreshCw,
  Calendar,
  BarChart3,
  CreditCard,
  Target
} from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'

interface SalesMetrics {
  totalRevenue: number
  totalOrders: number
  averageOrderValue: number
  totalCustomers: number
  revenueGrowth: number
  ordersGrowth: number
  newCustomers: number
  returningCustomers: number
}



interface CategorySales {
  name: string
  revenue: number
}

interface MonthlyTrend {
  month: string
  revenue: number
  orders: number
  customers: number
}

interface PaymentDistribution {
  method: string
  count: number
  percentage: number
}

export default function SalesAnalyticsPage() {
  const [metrics, setMetrics] = useState<SalesMetrics | null>(null)
  const [salesByCategory, setSalesByCategory] = useState<CategorySales[]>([])
  const [monthlyTrends, setMonthlyTrends] = useState<MonthlyTrend[]>([])
  const [paymentDistribution, setPaymentDistribution] = useState<PaymentDistribution[]>([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("30d")

  useEffect(() => {
    fetchSalesAnalytics()
    // Auto-refresh every 30 seconds for dynamic updates
    const interval = setInterval(fetchSalesAnalytics, 30000)
    return () => clearInterval(interval)
  }, [timeRange])

  const fetchSalesAnalytics = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/reports/sales?timeRange=${timeRange}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch analytics: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setMetrics(data.metrics)
        setSalesByCategory(data.salesByCategory)
        setMonthlyTrends(data.monthlyTrends)
        setPaymentDistribution(data.paymentDistribution)
        toast.success("📊 Analytics de ventes mis à jour en temps réel!")
      } else {
        throw new Error(data.error || "Failed to fetch analytics")
      }
    } catch (error) {
      console.error('Failed to fetch sales analytics:', error)
      toast.error("❌ Erreur lors du chargement des analytics")
    } finally {
      setLoading(false)
    }
  }

  const exportReport = () => {
    if (!metrics) {
      toast.error("Aucune donnée à exporter")
      return
    }

    const reportData = {
      period: timeRange,
      generatedAt: new Date().toISOString(),
      metrics,
      salesByCategory: salesByCategory.slice(0, 5)
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `sales-analytics-${timeRange}-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    
    toast.success("Rapport exporté avec succès")
  }

  const formatCurrency = (amount: number) => {
    return `${amount.toFixed(2)} TND`
  }

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    )
  }

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? "text-green-600" : "text-red-600"
  }

  if (loading && !metrics) {
    return (
      <DashboardLayout
        title="Analytics de Ventes"
        description="Analyse complète des performances de ventes"
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Chargement des analytics...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      title="Analytics de Ventes"
      description="Analyse complète des performances de ventes et insights business pour votre plateforme e-commerce dentaire"
    >
      <div className="space-y-8">
        {/* Dynamic Controls Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-6 border border-blue-100"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/20 rounded-full -translate-y-16 translate-x-16"></div>

          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full lg:w-auto">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </motion.div>
                  <span className="text-sm font-semibold text-gray-700">Période d'analyse:</span>
                </div>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-full sm:w-48 bg-white border-blue-200 focus:border-blue-400">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">📅 7 derniers jours</SelectItem>
                    <SelectItem value="30d">📊 30 derniers jours</SelectItem>
                    <SelectItem value="90d">📈 90 derniers jours</SelectItem>
                    <SelectItem value="1y">🗓️ Dernière année</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Real-time indicator */}
              <div className="flex items-center gap-2 px-3 py-1 bg-green-100 rounded-full">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-2 h-2 bg-green-500 rounded-full"
                ></motion.div>
                <span className="text-xs font-medium text-green-700">Temps réel</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={fetchSalesAnalytics}
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto bg-white border-blue-200 hover:bg-blue-50 hover:border-blue-300 text-blue-700"
                >
                  <motion.div
                    animate={{ rotate: loading ? 360 : 0 }}
                    transition={{ duration: 1, repeat: loading ? Infinity : 0, ease: "linear" }}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                  </motion.div>
                  <span className="hidden sm:inline">🔄 Actualiser</span>
                  <span className="sm:hidden">🔄 Actualiser</span>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={exportReport}
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto bg-white border-green-200 hover:bg-green-50 hover:border-green-300 text-green-700"
                >
                  <Download className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">📥 Exporter</span>
                  <span className="sm:hidden">📥 Export</span>
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Key Metrics */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="group"
            >
              <Card className="relative overflow-hidden border-l-4 border-l-green-500 bg-gradient-to-br from-white to-green-50/30 hover:shadow-lg transition-all duration-300">
                <div className="absolute top-0 right-0 w-20 h-20 bg-green-100/50 rounded-full -translate-y-10 translate-x-10 group-hover:scale-110 transition-transform duration-300"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                  <CardTitle className="text-sm font-medium text-gray-700">💰 Chiffre d'Affaires</CardTitle>
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  >
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </motion.div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
                    className="text-3xl font-bold text-green-700"
                  >
                    {formatCurrency(metrics.totalRevenue)}
                  </motion.div>
                  <div className={`flex items-center text-xs mt-2 ${getGrowthColor(metrics.revenueGrowth)}`}>
                    <motion.div
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      {getGrowthIcon(metrics.revenueGrowth)}
                    </motion.div>
                    <span className="ml-1 font-medium">{Math.abs(metrics.revenueGrowth).toFixed(1)}% vs période précédente</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Commandes</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.totalOrders}</div>
                  <div className={`flex items-center text-xs ${getGrowthColor(metrics.ordersGrowth)}`}>
                    {getGrowthIcon(metrics.ordersGrowth)}
                    <span className="ml-1">{Math.abs(metrics.ordersGrowth).toFixed(1)}% vs période précédente</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Panier Moyen</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(metrics.averageOrderValue)}</div>
                  <p className="text-xs text-muted-foreground">
                    Par commande
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Clients</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.totalCustomers}</div>
                  <p className="text-xs text-muted-foreground">
                    {metrics.newCustomers} nouveaux clients
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Trends */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Tendances Mensuelles</CardTitle>
              <CardDescription>Évolution du chiffre d'affaires, commandes et clients</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip
                    formatter={(value, name) => {
                      if (name === 'revenue') return [`${Number(value).toFixed(2)} TND`, 'Chiffre d\'affaires']
                      if (name === 'orders') return [`${value} commandes`, 'Commandes']
                      if (name === 'customers') return [`${value} clients`, 'Clients']
                      return [value, name]
                    }}
                  />
                  <Area yAxisId="left" type="monotone" dataKey="revenue" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                  <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={2} />
                  <Line yAxisId="right" type="monotone" dataKey="customers" stroke="#f59e0b" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Sales by Category */}
          <Card>
            <CardHeader>
              <CardTitle>Ventes par Catégorie</CardTitle>
              <CardDescription>Répartition du chiffre d'affaires par catégorie</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesByCategory.slice(0, 6)} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip formatter={(value) => [`${Number(value).toFixed(2)} TND`, 'Chiffre d\'affaires']} />
                  <Bar dataKey="revenue" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card>
            <CardHeader>
              <CardTitle>Méthodes de Paiement</CardTitle>
              <CardDescription>Répartition des modes de paiement</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={paymentDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ method, percentage }) => `${method}: ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {paymentDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 60%)`} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value} commandes`, 'Nombre']} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>



        {/* Customer Insights */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Acquisition Clients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Nouveaux clients</span>
                    <span className="font-semibold text-green-600">{metrics.newCustomers}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Clients récurrents</span>
                    <span className="font-semibold text-blue-600">{metrics.returningCustomers}</span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="text-sm text-gray-600">Taux de rétention</div>
                    <div className="text-lg font-bold">
                      {metrics.totalCustomers > 0
                        ? Math.round((metrics.returningCustomers / metrics.totalCustomers) * 100)
                        : 0}%
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Croissance CA</span>
                    <span className={`font-semibold ${getGrowthColor(metrics.revenueGrowth)}`}>
                      {metrics.revenueGrowth >= 0 ? '+' : ''}{metrics.revenueGrowth.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Croissance commandes</span>
                    <span className={`font-semibold ${getGrowthColor(metrics.ordersGrowth)}`}>
                      {metrics.ordersGrowth >= 0 ? '+' : ''}{metrics.ordersGrowth.toFixed(1)}%
                    </span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="text-sm text-gray-600">Tendance générale</div>
                    <div className="flex items-center">
                      {getGrowthIcon((metrics.revenueGrowth + metrics.ordersGrowth) / 2)}
                      <span className="ml-1 font-semibold">
                        {metrics.revenueGrowth >= 0 && metrics.ordersGrowth >= 0 ? 'Positive' : 'À surveiller'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Objectifs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Objectif mensuel</span>
                      <span>75%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Panier moyen cible</span>
                      <span>85%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  <div className="pt-2 border-t text-center">
                    <div className="text-sm text-gray-600">Performance globale</div>
                    <div className="text-lg font-bold text-green-600">80%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
