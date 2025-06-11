"use client"

import { useState } from "react"
import { Order } from "@/app/orders/page"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Pagination, PageSizeSelector } from "@/components/ui/pagination"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Clock,
  CheckCircle,
  Package,
  Truck,
  XCircle,
  Eye,
  Search,
  RefreshCw,
  ShoppingBag,
  MapPin,
  CreditCard,
  Calendar,
  Phone,
  Mail,
  User,
  FileText
} from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalCount: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

interface UserOrdersViewProps {
  data: Order[]
  onRefresh: () => void
  pagination?: PaginationProps
}

const statusConfig = {
  PENDING: { label: "En attente", color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: Clock },
  CONFIRMED: { label: "Confirmée", color: "bg-blue-100 text-blue-800 border-blue-200", icon: CheckCircle },
  PROCESSING: { label: "En traitement", color: "bg-purple-100 text-purple-800 border-purple-200", icon: Package },
  SHIPPED: { label: "Expédiée", color: "bg-indigo-100 text-indigo-800 border-indigo-200", icon: Truck },
  DELIVERED: { label: "Livrée", color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle },
  CANCELLED: { label: "Annulée", color: "bg-red-100 text-red-800 border-red-200", icon: XCircle },
}

const paymentMethodLabels = {
  cash: "Paiement à la livraison",
  transfer: "Virement bancaire",
  card: "Carte bancaire"
}

export function UserOrdersView({ data, onRefresh, pagination }: UserOrdersViewProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-TN', {
      style: 'currency',
      currency: 'TND'
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Use data directly since filtering is done server-side when pagination is enabled
  const filteredOrders = data

  const getStatusBadge = (status: Order['status']) => {
    const config = statusConfig[status]
    const Icon = config.icon
    
    return (
      <Badge className={`${config.color} flex items-center gap-1 border`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const getStatusProgress = (status: Order['status']) => {
    const steps = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED']
    const currentIndex = steps.indexOf(status)
    return status === 'CANCELLED' ? 0 : ((currentIndex + 1) / steps.length) * 100
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Mes Commandes</h2>
          <p className="text-gray-600">
            {filteredOrders.length} commande{filteredOrders.length !== 1 ? 's' : ''} 
            {statusFilter !== "all" && ` • Filtrées par: ${statusConfig[statusFilter as keyof typeof statusConfig]?.label}`}
          </p>
        </div>
        
        <Button onClick={onRefresh} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualiser
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Rechercher par numéro de commande ou produit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            {Object.entries(statusConfig).map(([value, config]) => (
              <SelectItem key={value} value={value}>
                {config.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-16">
          <div className="p-4 bg-gray-50 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <ShoppingBag className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            {searchTerm || statusFilter !== "all" ? "Aucune commande trouvée" : "Aucune commande"}
          </h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            {searchTerm || statusFilter !== "all"
              ? "Essayez de modifier vos critères de recherche pour voir plus de résultats"
              : "Vous n'avez pas encore passé de commande. Découvrez notre catalogue de produits dentaires"
            }
          </p>
          {(!searchTerm && statusFilter === "all") && (
            <Button
              onClick={() => window.location.href = '/catalog'}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              Découvrir nos produits
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 bg-white">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg font-semibold">
                      Commande {order.orderNumber}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(order.createdAt)}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(order.status)}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Détails
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Détails de la commande {order.orderNumber}</DialogTitle>
                          <DialogDescription>
                            Commande passée le {formatDate(order.createdAt)}
                          </DialogDescription>
                        </DialogHeader>
                        
                        {selectedOrder && (
                          <div className="space-y-6">
                            {/* Status Progress */}
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Statut de la commande</span>
                                {getStatusBadge(selectedOrder.status)}
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${getStatusProgress(selectedOrder.status)}%` }}
                                />
                              </div>
                            </div>

                            {/* Order Items */}
                            <div>
                              <h4 className="font-semibold mb-3 flex items-center gap-2">
                                <Package className="h-4 w-4" />
                                Articles commandés
                              </h4>
                              <div className="space-y-3">
                                {selectedOrder.items.map((item, index) => (
                                  <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                      <Package className="h-6 w-6 text-gray-400" />
                                    </div>
                                    <div className="flex-1">
                                      <h5 className="font-medium">{item.name}</h5>
                                      <p className="text-sm text-gray-500">Quantité: {item.quantity}</p>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                                      <p className="text-sm text-gray-500">{formatPrice(item.price)} / unité</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Customer & Shipping Info */}
                            <div className="grid md:grid-cols-2 gap-6">
                              <div>
                                <h4 className="font-semibold mb-3 flex items-center gap-2">
                                  <User className="h-4 w-4" />
                                  Informations client
                                </h4>
                                <div className="space-y-2 text-sm">
                                  <p><strong>Nom:</strong> {selectedOrder.customer.firstName} {selectedOrder.customer.lastName}</p>
                                  <p className="flex items-center gap-2">
                                    <Mail className="h-3 w-3" />
                                    {selectedOrder.customer.email}
                                  </p>
                                  <p className="flex items-center gap-2">
                                    <Phone className="h-3 w-3" />
                                    {selectedOrder.customer.phone}
                                  </p>
                                </div>
                              </div>

                              <div>
                                <h4 className="font-semibold mb-3 flex items-center gap-2">
                                  <MapPin className="h-4 w-4" />
                                  Adresse de livraison
                                </h4>
                                <div className="text-sm">
                                  <p>{selectedOrder.shipping.address}</p>
                                  <p>{selectedOrder.shipping.city} {selectedOrder.shipping.postalCode}</p>
                                  <p>{selectedOrder.shipping.country}</p>
                                </div>
                              </div>
                            </div>

                            {/* Payment & Total */}
                            <div className="grid md:grid-cols-2 gap-6">
                              <div>
                                <h4 className="font-semibold mb-3 flex items-center gap-2">
                                  <CreditCard className="h-4 w-4" />
                                  Paiement
                                </h4>
                                <p className="text-sm">
                                  {paymentMethodLabels[selectedOrder.payment.method as keyof typeof paymentMethodLabels] || selectedOrder.payment.method}
                                </p>
                              </div>

                              <div>
                                <h4 className="font-semibold mb-3">Récapitulatif</h4>
                                <div className="space-y-1 text-sm">
                                  <div className="flex justify-between">
                                    <span>Sous-total:</span>
                                    <span>{formatPrice(selectedOrder.totals.subtotal)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Livraison:</span>
                                    <span className="text-blue-600">Nous contacter</span>
                                  </div>
                                  <Separator />
                                  <div className="flex justify-between font-semibold">
                                    <span>Total:</span>
                                    <span>{formatPrice(selectedOrder.totals.total)}</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Notes */}
                            {selectedOrder.notes && (
                              <div>
                                <h4 className="font-semibold mb-3 flex items-center gap-2">
                                  <FileText className="h-4 w-4" />
                                  Notes
                                </h4>
                                <p className="text-sm bg-gray-50 p-3 rounded-lg">{selectedOrder.notes}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Articles</p>
                    <p className="font-medium">{order.items.length} produit{order.items.length !== 1 ? 's' : ''}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Total</p>
                    <p className="font-semibold text-lg">{formatPrice(order.totals.total)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Paiement</p>
                    <p className="font-medium">
                      {paymentMethodLabels[order.payment.method as keyof typeof paymentMethodLabels] || order.payment.method}
                    </p>
                  </div>
                </div>

                {/* Status Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">Progression</span>
                    <span className="text-sm font-medium">{Math.round(getStatusProgress(order.status))}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getStatusProgress(order.status)}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && filteredOrders.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <PageSizeSelector
                pageSize={pagination.pageSize}
                onPageSizeChange={pagination.onPageSizeChange}
                options={[5, 10, 20]}
              />
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                totalCount={pagination.totalCount}
                limit={pagination.pageSize}
                onPageChange={pagination.onPageChange}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
