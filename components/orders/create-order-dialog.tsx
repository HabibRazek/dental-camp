"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Plus, Minus, Search, ShoppingCart, User, Package, Trash2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Product {
  id: string
  name: string
  price: number | string // Allow both number and string to handle API inconsistencies
  stockQuantity: number
  sku: string
  thumbnail?: string
}

interface Customer {
  id: string
  name: string
  email: string
  phone?: string
}

interface OrderItem {
  productId: string
  product: Product
  quantity: number
  price: number
}

interface CreateOrderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateOrderDialog({ open, onOpenChange }: CreateOrderDialogProps) {
  const [step, setStep] = useState(1)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false)
  const [isLoadingProducts, setIsLoadingProducts] = useState(false)
  const [isCreatingSamples, setIsCreatingSamples] = useState(false)

  // Fetch customers and products when dialog opens
  useEffect(() => {
    if (open) {
      fetchCustomers()
      fetchProducts()
    }
  }, [open])

  const fetchCustomers = async () => {
    setIsLoadingCustomers(true)
    try {
      const response = await fetch('/api/customers/for-orders')
      if (!response.ok) {
        throw new Error(`Failed to fetch customers: ${response.status}`)
      }

      const data = await response.json()
      const customersData = data.customers || []

      setCustomers(customersData)

      if (process.env.NODE_ENV === 'development') {
        console.log('👥 Customers loaded for order creation:', customersData.length)
        console.log('👥 Customer data:', customersData)
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error)
      toast.error('Failed to load customers')
    } finally {
      setIsLoadingCustomers(false)
    }
  }

  const fetchProducts = async () => {
    setIsLoadingProducts(true)
    try {
      const response = await fetch('/api/products/catalog?limit=100')
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`)
      }

      const data = await response.json()
      const productsData = data.products || []

      // Filter only active products with stock > 0
      const availableProducts = productsData.filter((product: Product) =>
        product.stockQuantity > 0
      )

      setProducts(availableProducts)

      if (process.env.NODE_ENV === 'development') {
        console.log('📦 Products loaded for order creation:', availableProducts.length)
        console.log('📦 Sample product data:', availableProducts[0])
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
      toast.error('Failed to load products')
    } finally {
      setIsLoadingProducts(false)
    }
  }

  const createSampleCustomers = async () => {
    setIsCreatingSamples(true)
    try {
      const response = await fetch('/api/customers/create-samples', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to create sample customers: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        toast.success(data.message)
        // Refresh customers list
        await fetchCustomers()
      } else {
        toast.error(data.error || 'Failed to create sample customers')
      }
    } catch (error) {
      console.error('Failed to create sample customers:', error)
      toast.error('Failed to create sample customers')
    } finally {
      setIsCreatingSamples(false)
    }
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const addProductToOrder = (product: Product) => {
    const existingItem = orderItems.find(item => item.productId === product.id)
    
    if (existingItem) {
      if (existingItem.quantity >= product.stockQuantity) {
        toast.error('Cannot add more items than available in stock')
        return
      }
      setOrderItems(items =>
        items.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      )
    } else {
      setOrderItems(items => [
        ...items,
        {
          productId: product.id,
          product,
          quantity: 1,
          price: Number(product.price || 0)
        }
      ])
    }
    toast.success(`${product.name} added to order`)
  }

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId)
      return
    }

    const product = products.find(p => p.id === productId)
    if (product && newQuantity > product.stockQuantity) {
      toast.error('Cannot exceed available stock')
      return
    }

    setOrderItems(items =>
      items.map(item =>
        item.productId === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    )
  }

  const removeItem = (productId: string) => {
    setOrderItems(items => items.filter(item => item.productId !== productId))
  }

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => {
      const price = Number(item.price || 0)
      const quantity = Number(item.quantity || 0)
      return total + (price * quantity)
    }, 0)
  }

  const handleSubmit = async () => {
    if (!selectedCustomer) {
      toast.error('Please select a customer')
      return
    }

    if (orderItems.length === 0) {
      toast.error('Please add at least one product to the order')
      return
    }

    setIsSubmitting(true)

    try {
      const orderData = {
        items: orderItems.map(item => ({
          id: item.productId,
          name: item.product.name,
          price: Number(item.price || 0),
          quantity: Number(item.quantity || 0),
          image: item.product.thumbnail || '',
          slug: item.product.slug || ''
        })),
        customer: {
          firstName: selectedCustomer.name.split(' ')[0] || '',
          lastName: selectedCustomer.name.split(' ').slice(1).join(' ') || '',
          email: selectedCustomer.email,
          phone: selectedCustomer.phone || ''
        },
        shipping: {
          address: selectedCustomer.name, // Placeholder - you might want to add address fields
          city: 'Tunis',
          postalCode: '1000',
          country: 'Tunisie'
        },
        delivery: {
          method: 'contact',
          price: 0,
          notes: notes || ''
        },
        payment: {
          method: 'cash_on_delivery',
          status: 'PENDING'
        },
        totals: {
          subtotal: Number(calculateTotal() || 0),
          delivery: 0,
          total: Number(calculateTotal() || 0)
        },
        notes
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      if (response.ok) {
        toast.success('Order created successfully!')
        resetForm()
        onOpenChange(false)
      } else {
        throw new Error('Failed to create order')
      }
    } catch (error) {
      console.error('Error creating order:', error)
      toast.error('Failed to create order')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setStep(1)
    setSelectedCustomer(null)
    setOrderItems([])
    setSearchTerm("")
    setNotes("")
  }

  const nextStep = () => {
    if (step === 1 && !selectedCustomer) {
      toast.error('Please select a customer')
      return
    }
    if (step === 2 && orderItems.length === 0) {
      toast.error('Please add at least one product')
      return
    }
    setStep(step + 1)
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Create New Order
          </DialogTitle>
          <DialogDescription>
            Step {step} of 3: {step === 1 ? 'Select Customer' : step === 2 ? 'Add Products' : 'Review & Confirm'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label>Select Customer</Label>
                  <Select onValueChange={(value) => {
                    const customer = customers.find(c => c.id === value)
                    setSelectedCustomer(customer || null)
                  }} disabled={isLoadingCustomers}>
                    <SelectTrigger>
                      <SelectValue placeholder={isLoadingCustomers ? "Loading customers..." : "Choose a customer..."} />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          <User className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm font-medium mb-1">No customers found</p>
                          <p className="text-xs mb-3">Create sample customers to get started</p>
                          <Button
                            size="sm"
                            onClick={createSampleCustomers}
                            disabled={isCreatingSamples}
                            className="w-full"
                          >
                            {isCreatingSamples ? (
                              <>
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                                Creating...
                              </>
                            ) : (
                              <>
                                <User className="h-3 w-3 mr-2" />
                                Create Sample Customers
                              </>
                            )}
                          </Button>
                        </div>
                      ) : (
                        customers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              <div>
                                <div className="font-medium">{customer.name}</div>
                                <div className="text-sm text-gray-500">{customer.email}</div>
                              </div>
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {selectedCustomer && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Selected Customer</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p><strong>Name:</strong> {selectedCustomer.name}</p>
                        <p><strong>Email:</strong> {selectedCustomer.email}</p>
                        {selectedCustomer.phone && (
                          <p><strong>Phone:</strong> {selectedCustomer.phone}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label>Search Products</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search by name or SKU..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-60 overflow-y-auto">
                  {filteredProducts.map((product) => (
                    <Card key={product.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium">{product.name}</h4>
                            <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                            <p className="text-sm font-medium text-green-600">{Number(product.price || 0).toFixed(2)} TND</p>
                            <Badge variant={product.stockQuantity > 5 ? "default" : "destructive"} className="text-xs">
                              Stock: {product.stockQuantity}
                            </Badge>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => addProductToOrder(product)}
                            disabled={product.stockQuantity === 0}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {orderItems.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Order Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {orderItems.map((item) => (
                          <div key={item.productId} className="flex items-center justify-between p-2 border rounded">
                            <div className="flex-1">
                              <p className="font-medium">{item.product.name}</p>
                              <p className="text-sm text-gray-500">{Number(item.price || 0).toFixed(2)} TND each</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => removeItem(item.productId)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="pt-2 border-t mt-2">
                        <p className="font-bold text-right">Total: {Number(calculateTotal() || 0).toFixed(2)} TND</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium">Customer</h4>
                        <p>{selectedCustomer?.name}</p>
                        <p className="text-sm text-gray-500">{selectedCustomer?.email}</p>
                      </div>

                      <div>
                        <h4 className="font-medium">Items ({orderItems.length})</h4>
                        <div className="space-y-1">
                          {orderItems.map((item) => (
                            <div key={item.productId} className="flex justify-between text-sm">
                              <span>{item.product.name} x{item.quantity}</span>
                              <span>{(Number(item.price || 0) * Number(item.quantity || 0)).toFixed(2)} TND</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 border-t">
                        <div className="flex justify-between font-bold">
                          <span>Total</span>
                          <span>{Number(calculateTotal() || 0).toFixed(2)} TND</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-2">
                  <Label>Order Notes (Optional)</Label>
                  <Textarea
                    placeholder="Add any special instructions or notes..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => step === 1 ? onOpenChange(false) : prevStep()}
          >
            {step === 1 ? 'Cancel' : 'Previous'}
          </Button>
          
          {step < 3 ? (
            <Button onClick={nextStep}>
              Next
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Order'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
