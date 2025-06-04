"use client"

import { useState } from 'react'
import { useCart } from '@/contexts/CartContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ShoppingCart, Plus } from 'lucide-react'
import { toast } from 'sonner'

export default function TestCheckoutPage() {
  const { addItem, state } = useCart()
  const [loading, setLoading] = useState(false)

  const testProducts = [
    {
      id: 'test-1',
      name: 'Manche de scalpel de Falcon',
      price: 50,
      image: '/images/dental-equipment.jpg',
      slug: 'manche-scalpel-falcon',
      stockQuantity: 100
    },
    {
      id: 'test-2', 
      name: 'Gants chirurgicaux stériles',
      price: 25,
      image: '/images/dental-equipment.jpg',
      slug: 'gants-chirurgicaux',
      stockQuantity: 50
    }
  ]

  const handleAddToCart = (product: any) => {
    addItem(product)
    toast.success(`${product.name} ajouté au panier`)
  }

  const testOrderCreation = async () => {
    if (state.items.length === 0) {
      toast.error('Ajoutez des articles au panier d\'abord')
      return
    }

    setLoading(true)
    try {
      // First check authentication
      console.log('🔍 Checking authentication...')
      const sessionResponse = await fetch('/api/auth/session')
      const sessionData = await sessionResponse.json()
      console.log('🔐 Current session:', sessionData)

      if (!sessionData || !sessionData.user) {
        toast.error('Vous devez être connecté pour passer une commande. Redirection vers la page de connexion...')
        window.location.href = '/auth/signin'
        return
      }

      console.log(`✅ User authenticated: ${sessionData.user.email}`)
      toast.success(`Utilisateur connecté: ${sessionData.user.email}`)
      const orderData = {
        items: state.items,
        customer: {
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          phone: '+216 12 345 678'
        },
        shipping: {
          address: '123 Test Street',
          city: 'Tunis',
          postalCode: '1000',
          country: 'Tunisie'
        },
        delivery: {
          notes: 'Test delivery notes'
        },
        payment: {
          method: 'cash'
        },
        totals: {
          subtotal: state.total,
          total: state.total
        },
        notes: 'Test order'
      }

      console.log('🧪 Testing order creation with data:', orderData)

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      })

      const result = await response.json()
      
      if (response.ok) {
        console.log('✅ Order created successfully:', result)
        toast.success('Commande de test créée avec succès!')
      } else {
        console.error('❌ Order creation failed:', result)
        toast.error(`Erreur: ${result.error}`)
      }
    } catch (error) {
      console.error('❌ Test error:', error)
      toast.error('Erreur lors du test')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Test Checkout System</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Test Products</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {testProducts.map(product => (
                <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-blue-600 font-bold">{product.price} TND TTC</p>
                  </div>
                  <Button onClick={() => handleAddToCart(product)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cart Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Items:</strong> {state.itemCount}</p>
                <p><strong>Total:</strong> {state.total} TND TTC</p>
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Cart Items:</h4>
                  {state.items.map(item => (
                    <div key={item.id} className="text-sm text-gray-600">
                      {item.name} x{item.quantity} = {item.price * item.quantity} TND
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Test Order Creation</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={testOrderCreation}
              disabled={loading || state.items.length === 0}
              className="w-full"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {loading ? 'Testing...' : 'Test Order Creation'}
            </Button>
            <p className="text-sm text-gray-500 mt-2">
              This will test the order creation API without going through the full checkout flow.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
