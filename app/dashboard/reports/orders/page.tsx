"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  RefreshCw,
  Package,
  AlertCircle
} from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'

interface OrderReport {
  id: string
  orderNumber: string
  customerEmail: string
  status: string
  total: number
  itemsCount: number
  createdAt: string
  paymentMethod: string
}

interface ReportSummary {
  totalOrders: number
  totalRevenue: number
  averageOrderValue: number
  completedOrders: number
  pendingOrders: number
  cancelledOrders: number
  totalItems: number
}

interface DailyTrend {
  date: string
  orders: number
  revenue: number
}

interface StatusDistribution {
  name: string
  value: number
  color: string
}

export default function OrderReportsPage() {
  const [orders, setOrders] = useState<OrderReport[]>([])
  const [summary, setSummary] = useState<ReportSummary | null>(null)
  const [dailyTrends, setDailyTrends] = useState<DailyTrend[]>([])
  const [statusDistribution, setStatusDistribution] = useState<StatusDistribution[]>([])
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState("30d")
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    fetchOrderReports()
  }, [dateRange, statusFilter, currentPage])

  const fetchOrderReports = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        timeRange: dateRange,
        status: statusFilter,
        page: currentPage.toString(),
        limit: '20'
      })

      const response = await fetch(`/api/admin/reports/orders?${params}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch reports: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.success) {
        setOrders(data.orders)
        setSummary(data.summary)
        setDailyTrends(data.dailyTrends)
        setStatusDistribution(data.statusDistribution)
        toast.success("Rapports de commandes mis à jour")
      } else {
        throw new Error(data.error || "Failed to fetch reports")
      }
    } catch (error) {
      console.error('Failed to fetch order reports:', error)
      toast.error("Erreur lors du chargement des rapports")
    } finally {
      setLoading(false)
    }
  }

  const exportToCSV = () => {
    if (orders.length === 0) {
      toast.error("Aucune donnée à exporter")
      return
    }

    const headers = ['Numéro de commande', 'Email client', 'Statut', 'Total (TND)', 'Articles', 'Date', 'Paiement']
    const csvContent = [
      headers.join(','),
      ...orders.map(order => [
        order.orderNumber,
        order.customerEmail,
        order.status,
        order.total.toFixed(2),
        order.itemsCount,
        new Date(order.createdAt).toLocaleDateString('fr-FR'),
        order.paymentMethod
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `rapports-commandes-${dateRange}-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    
    toast.success("Rapport exporté avec succès")
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'PENDING': { label: 'En attente', variant: 'secondary' as const },
      'PROCESSING': { label: 'En cours', variant: 'default' as const },
      'SHIPPED': { label: 'Expédiée', variant: 'default' as const },
      'DELIVERED': { label: 'Livrée', variant: 'default' as const },
      'COMPLETED': { label: 'Terminée', variant: 'default' as const },
      'CANCELLED': { label: 'Annulée', variant: 'destructive' as const }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, variant: 'secondary' as const }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const filteredOrders = orders.filter(order =>
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading && !summary) {
    return (
      <DashboardLayout
        title="Rapports de Commandes"
        description="Analyse complète des commandes et rapports détaillés"
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Chargement des rapports...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      title="Rapports de Commandes"
      description="Analyse complète des commandes et rapports détaillés pour votre plateforme e-commerce dentaire"
    >
      <div className="space-y-8">
        {/* Filters and Controls - Responsive */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-4 w-full lg:w-auto">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
              <Label className="text-sm font-medium whitespace-nowrap">Période:</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">7 derniers jours</SelectItem>
                  <SelectItem value="30d">30 derniers jours</SelectItem>
                  <SelectItem value="90d">90 derniers jours</SelectItem>
                  <SelectItem value="1y">Dernière année</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
              <Label className="text-sm font-medium whitespace-nowrap">Statut:</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="processing">En cours</SelectItem>
                  <SelectItem value="completed">Terminées</SelectItem>
                  <SelectItem value="cancelled">Annulées</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
              <Label className="text-sm font-medium sm:hidden">Recherche:</Label>
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-56"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
            <Button onClick={fetchOrderReports} variant="outline" size="sm" className="w-full sm:w-auto">
              <RefreshCw className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Actualiser</span>
              <span className="sm:hidden">Actualiser</span>
            </Button>
            <Button onClick={exportToCSV} variant="outline" size="sm" className="w-full sm:w-auto">
              <Download className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Exporter CSV</span>
              <span className="sm:hidden">Export</span>
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Commandes</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{summary.totalOrders}</div>
                  <p className="text-xs text-muted-foreground">
                    {summary.totalItems} articles au total
                  </p>
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
                  <CardTitle className="text-sm font-medium">Chiffre d'Affaires</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{summary.totalRevenue.toFixed(2)} TND</div>
                  <p className="text-xs text-muted-foreground">
                    Panier moyen: {summary.averageOrderValue.toFixed(2)} TND
                  </p>
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
                  <CardTitle className="text-sm font-medium">Commandes Terminées</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{summary.completedOrders}</div>
                  <p className="text-xs text-muted-foreground">
                    {summary.totalOrders > 0 ? Math.round((summary.completedOrders / summary.totalOrders) * 100) : 0}% du total
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
                  <CardTitle className="text-sm font-medium">En Attente</CardTitle>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{summary.pendingOrders}</div>
                  <p className="text-xs text-muted-foreground">
                    Nécessitent une attention
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Trends Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Tendances Quotidiennes</CardTitle>
              <CardDescription>Évolution des commandes et du chiffre d'affaires</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip
                    formatter={(value, name) => [
                      name === 'orders' ? `${value} commandes` : `${Number(value).toFixed(2)} TND`,
                      name === 'orders' ? 'Commandes' : 'Chiffre d\'affaires'
                    ]}
                  />
                  <Bar yAxisId="left" dataKey="orders" fill="#3b82f6" name="orders" />
                  <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} name="revenue" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Répartition par Statut</CardTitle>
              <CardDescription>Distribution des statuts de commandes</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Orders Table - Responsive */}
        <Card>
          <CardHeader>
            <CardTitle>Détail des Commandes</CardTitle>
            <CardDescription>
              {filteredOrders.length} commande(s) trouvée(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium">Numéro</th>
                    <th className="text-left p-3 font-medium">Client</th>
                    <th className="text-left p-3 font-medium">Statut</th>
                    <th className="text-right p-3 font-medium">Total</th>
                    <th className="text-center p-3 font-medium">Articles</th>
                    <th className="text-left p-3 font-medium">Date</th>
                    <th className="text-left p-3 font-medium">Paiement</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-3 font-mono text-sm">{order.orderNumber}</td>
                      <td className="p-3">{order.customerEmail}</td>
                      <td className="p-3">{getStatusBadge(order.status)}</td>
                      <td className="p-3 text-right font-semibold">{order.total.toFixed(2)} TND</td>
                      <td className="p-3 text-center">{order.itemsCount}</td>
                      <td className="p-3 text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="p-3 text-sm">{order.paymentMethod}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4">
              {filteredOrders.map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-mono text-sm text-gray-600">{order.orderNumber}</p>
                      <p className="font-medium text-gray-900">{order.customerEmail}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{order.total.toFixed(2)} TND</p>
                      {getStatusBadge(order.status)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Articles</p>
                      <p className="font-medium">{order.itemsCount}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Date</p>
                      <p className="font-medium">
                        {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-500">Paiement</p>
                      <p className="font-medium">{order.paymentMethod}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredOrders.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">Aucune commande trouvée</p>
                <p className="text-sm">Essayez de modifier vos critères de recherche</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
