"use client"

import React, { useState } from "react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  MoreHorizontal,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  MapPin,
  Phone,
  Mail,
  User,
  CreditCard,
  Calendar,
  Plus,
  FileImage
} from "lucide-react"
import Image from "next/image"
import { Order } from "@/app/orders/page"
import { Pagination, PageSizeSelector } from "@/components/ui/pagination"

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalCount: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

interface FiltersProps {
  searchTerm: string
  statusFilter: string
  onSearch: (search: string) => void
  onStatusFilter: (status: string) => void
}

interface OrdersTableProps {
  data: Order[]
  onStatusChange: (orderId: string, status: string) => void
  onRefresh: () => void
  pagination?: PaginationProps
  filters?: FiltersProps
}

const statusConfig = {
  PENDING: { label: "En attente", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  CONFIRMED: { label: "Confirmée", color: "bg-blue-100 text-blue-800", icon: CheckCircle },
  PROCESSING: { label: "En traitement", color: "bg-purple-100 text-purple-800", icon: Package },
  SHIPPED: { label: "Expédiée", color: "bg-indigo-100 text-indigo-800", icon: Truck },
  DELIVERED: { label: "Livrée", color: "bg-green-100 text-green-800", icon: CheckCircle },
  CANCELLED: { label: "Annulée", color: "bg-red-100 text-red-800", icon: XCircle },
}

export function OrdersTable({ data, onStatusChange, onRefresh, pagination, filters }: OrdersTableProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  // Use external filters if provided, otherwise use local state
  const [localSearchTerm, setLocalSearchTerm] = useState("")
  const [localStatusFilter, setLocalStatusFilter] = useState<string>("all")

  const searchTerm = filters?.searchTerm ?? localSearchTerm
  const statusFilter = filters?.statusFilter ?? localStatusFilter

  const handleSearchChange = (value: string) => {
    if (filters?.onSearch) {
      filters.onSearch(value)
    } else {
      setLocalSearchTerm(value)
    }
  }

  const handleStatusChange = (value: string) => {
    if (filters?.onStatusFilter) {
      filters.onStatusFilter(value)
    } else {
      setLocalStatusFilter(value)
    }
  }

  const paymentMethodLabels = {
    cash: 'Paiement à la livraison',
    transfer: 'Virement bancaire',
    card: 'Carte bancaire'
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-TN', {
      style: 'currency',
      currency: 'TND'
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Use data directly since filtering is done server-side
  const filteredOrders = data

  const getStatusBadge = (status: Order['status']) => {
    const config = statusConfig[status]
    const Icon = config.icon
    
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Commandes</h2>
          <p className="text-gray-600">
            {filteredOrders.length} commande{filteredOrders.length !== 1 ? 's' : ''} 
            {statusFilter !== "all" && ` • Filtrées par: ${statusConfig[statusFilter as keyof typeof statusConfig]?.label}`}
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={onRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtres</CardTitle>
          <CardDescription>
            Recherchez et filtrez les commandes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher par numéro, email ou nom..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                {Object.entries(statusConfig).map(([status, config]) => (
                  <SelectItem key={status} value={status}>
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Aucune commande trouvée
              </h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== "all" 
                  ? "Aucune commande ne correspond à vos critères de recherche."
                  : "Aucune commande n'a encore été passée."
                }
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Commande</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Articles</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-semibold">{order.orderNumber}</div>
                        <div className="text-sm text-gray-500">
                          {order.payment.method}
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {order.customer.firstName} {order.customer.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.customer.email}
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="text-sm">
                        {order.items.length} article{order.items.length !== 1 ? 's' : ''}
                        <div className="text-gray-500">
                          {order.items.slice(0, 2).map(item => item.name).join(', ')}
                          {order.items.length > 2 && ` +${order.items.length - 2} autres`}
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="font-semibold">
                        {formatPrice(order.totals.total)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Livraison: {formatPrice(order.totals.delivery)}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      {getStatusBadge(order.status)}
                    </TableCell>
                    
                    <TableCell>
                      <div className="text-sm">
                        {formatDate(order.createdAt)}
                      </div>
                    </TableCell>
                    
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <Dialog>
                            <DialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <Eye className="mr-2 h-4 w-4" />
                                Voir détails
                              </DropdownMenuItem>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Détails de la commande {order.orderNumber}</DialogTitle>
                                <DialogDescription>
                                  Commande passée le {formatDate(order.createdAt)}
                                </DialogDescription>
                              </DialogHeader>

                              <div className="grid gap-6">
                                {/* Order Status */}
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                      <Package className="h-5 w-5" />
                                      Statut de la commande
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="flex items-center gap-4">
                                      {getStatusBadge(order.status)}
                                      <span className="text-sm text-gray-600">
                                        Dernière mise à jour: {formatDate(order.updatedAt || order.createdAt)}
                                      </span>
                                    </div>
                                  </CardContent>
                                </Card>

                                {/* Customer Information */}
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                      <User className="h-5 w-5" />
                                      Informations client
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="grid md:grid-cols-2 gap-4">
                                      <div>
                                        <p className="text-sm text-gray-500 mb-1">Nom complet</p>
                                        <p className="font-medium">{order.customer.firstName} {order.customer.lastName}</p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-gray-500 mb-1">Email</p>
                                        <p className="font-medium flex items-center gap-2">
                                          <Mail className="h-4 w-4" />
                                          {order.customer.email}
                                        </p>
                                      </div>
                                      {order.customer.phone && (
                                        <div>
                                          <p className="text-sm text-gray-500 mb-1">Téléphone</p>
                                          <p className="font-medium flex items-center gap-2">
                                            <Phone className="h-4 w-4" />
                                            {order.customer.phone}
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  </CardContent>
                                </Card>

                                {/* Shipping Address */}
                                {order.shipping && (
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="flex items-center gap-2">
                                        <MapPin className="h-5 w-5" />
                                        Adresse de livraison
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-2">
                                        <p className="font-medium">{order.shipping.address}</p>
                                        <p className="text-gray-600">
                                          {order.shipping.city} {order.shipping.postalCode}
                                        </p>
                                        <p className="text-gray-600">{order.shipping.country}</p>
                                      </div>
                                    </CardContent>
                                  </Card>
                                )}

                                {/* Order Items */}
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                      <Package className="h-5 w-5" />
                                      Articles commandés
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="space-y-4">
                                      {order.items.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                          <div className="flex-1">
                                            <h4 className="font-medium">{item.name}</h4>
                                            <p className="text-sm text-gray-600">ID: {item.id}</p>
                                          </div>
                                          <div className="text-center">
                                            <p className="text-sm text-gray-500">Quantité</p>
                                            <p className="font-medium">{item.quantity}</p>
                                          </div>
                                          <div className="text-center">
                                            <p className="text-sm text-gray-500">Prix unitaire</p>
                                            <p className="font-medium">{formatPrice(item.price)}</p>
                                          </div>
                                          <div className="text-right">
                                            <p className="text-sm text-gray-500">Total</p>
                                            <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </CardContent>
                                </Card>

                                {/* Payment & Totals */}
                                <div className="grid md:grid-cols-2 gap-6">
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="flex items-center gap-2">
                                        <CreditCard className="h-5 w-5" />
                                        Paiement
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-4">
                                        <div>
                                          <p className="text-sm text-gray-500 mb-1">Méthode de paiement</p>
                                          <p className="font-medium">
                                            {paymentMethodLabels[order.payment.method as keyof typeof paymentMethodLabels] || order.payment.method}
                                          </p>
                                        </div>

                                        {/* Payment Proof Image for Bank Transfer */}
                                        {order.payment.method === 'transfer' && order.payment.proofImage && (
                                          <div>
                                            <p className="text-sm text-gray-500 mb-2 flex items-center gap-2">
                                              <FileImage className="h-4 w-4" />
                                              Justificatif de paiement
                                            </p>
                                            <div className="relative w-32 h-32 border rounded-lg overflow-hidden bg-gray-50">
                                              <Image
                                                src={order.payment.proofImage}
                                                alt="Justificatif de paiement"
                                                fill
                                                className="object-cover cursor-pointer hover:scale-105 transition-transform"
                                                onClick={() => window.open(order.payment.proofImage!, '_blank')}
                                              />
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">
                                              Cliquez pour agrandir
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                    </CardContent>
                                  </Card>

                                  <Card>
                                    <CardHeader>
                                      <CardTitle>Récapitulatif</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-2">
                                        <div className="flex justify-between">
                                          <span>Sous-total</span>
                                          <span>{formatPrice(order.totals.subtotal)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>Livraison</span>
                                          <span>{formatPrice(order.totals.delivery)}</span>
                                        </div>
                                        <Separator />
                                        <div className="flex justify-between font-semibold text-lg">
                                          <span>Total</span>
                                          <span>{formatPrice(order.totals.total)}</span>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </div>

                                {/* Notes */}
                                {order.notes && (
                                  <Card>
                                    <CardHeader>
                                      <CardTitle>Notes</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <p className="text-gray-700">{order.notes}</p>
                                    </CardContent>
                                  </Card>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel>Changer le statut</DropdownMenuLabel>
                          {Object.entries(statusConfig).map(([status, config]) => (
                            <DropdownMenuItem
                              key={status}
                              onClick={() => onStatusChange(order.id, status)}
                              disabled={order.status === status}
                            >
                              <config.icon className="mr-2 h-4 w-4" />
                              {config.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination && (
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <PageSizeSelector
                pageSize={pagination.pageSize}
                onPageSizeChange={pagination.onPageSizeChange}
                options={[5, 10, 20, 50]}
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
