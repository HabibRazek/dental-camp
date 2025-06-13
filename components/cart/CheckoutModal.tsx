"use client"

import React, { useState } from 'react'
import { useCart } from '@/contexts/CartContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  CreditCard,
  Truck,
  MapPin,
  Phone,
  Mail,
  User,
  CheckCircle,
  Banknote,
  Copy,
  Building
} from 'lucide-react'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'
import { formatCurrency } from '@/lib/utils'
import { PaymentProofUpload } from './PaymentProofUpload'

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { state, clearCart } = useCart()
  const { data: session } = useSession()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    // Shipping Info
    firstName: session?.user?.name?.split(' ')[0] || '',
    lastName: session?.user?.name?.split(' ')[1] || '',
    email: session?.user?.email || '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Tunisie',

    // Delivery - handled via direct contact
    deliveryNotes: '',

    // Payment
    paymentMethod: 'cash',
    paymentProofImage: null as string | null,

    // Notes
    notes: ''
  })

  const formatPrice = (price: number) => {
    return formatCurrency(price)
  }

  // No delivery options - direct contact for delivery arrangements

  const paymentMethods = [
    {
      id: 'cash',
      name: 'Paiement à la livraison',
      description: 'Payez en espèces lors de la réception de votre commande'
    },
    {
      id: 'transfer',
      name: 'Virement bancaire',
      description: 'Paiement par virement avant expédition'
    }
  ]

  const ribInfo = {
    bankName: 'Banque Internationale Arabe de Tunisie',
    accountHolder: 'Dental Camp Professional',
    iban: 'TN59 08 018 0000000012345678',
    bic: 'BIATTNTT',
    accountNumber: '08018000000012345678'
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copié dans le presse-papiers`)
  }

  const subtotal = state.total
  const total = subtotal // No delivery charges

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmitOrder = async () => {
    setLoading(true)
    
    try {
      // Validate required fields
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone ||
          !formData.address || !formData.city) {
        toast.error('Veuillez remplir tous les champs obligatoires')
        return
      }

      // Validate payment proof for bank transfer
      if (formData.paymentMethod === 'transfer' && !formData.paymentProofImage) {
        console.warn('⚠️ No payment proof image provided for bank transfer')
        toast.error('Veuillez télécharger un justificatif de paiement pour le virement bancaire')
        return
      }

      const orderData = {
        items: state.items,
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone
        },
        shipping: {
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country
        },
        delivery: {
          notes: formData.deliveryNotes
        },
        payment: {
          method: formData.paymentMethod,
          proofImage: formData.paymentProofImage
        },
        totals: {
          subtotal,
          total
        },
        notes: formData.notes
      }

      console.log("🛒 Submitting order data:", orderData)
      console.log("💳 Payment method:", formData.paymentMethod)
      console.log("📸 Payment proof image:", formData.paymentProofImage)

      // First check if user is authenticated
      const sessionResponse = await fetch('/api/auth/session')
      const sessionData = await sessionResponse.json()
      console.log('🔐 Current session:', sessionData)

      if (!sessionData || !sessionData.user) {
        toast.error('Vous devez être connecté pour passer une commande. Redirection vers la page de connexion...')
        window.location.href = '/auth/signin'
        return
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      })

      console.log('📡 Response status:', response.status)
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()))

      if (response.ok) {
        const result = await response.json()
        console.log("✅ Order created successfully:", result)
        setStep(3) // Success step
        clearCart()
        toast.success('Commande passée avec succès!')
      } else {
        let errorData
        let responseText = ''
        try {
          responseText = await response.clone().text()
          console.error("❌ Raw response text:", responseText)
          errorData = await response.json()
        } catch (parseError) {
          console.error("❌ Failed to parse error response:", parseError)
          console.error("❌ Raw response was:", responseText)
          errorData = { error: `HTTP ${response.status}: ${response.statusText}` }
        }
        console.error("❌ Order creation failed:", errorData)
        console.error("❌ Response status:", response.status)
        throw new Error(errorData.error || `Erreur ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error("❌ Checkout error:", error)
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la commande. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User className="h-5 w-5" />
                Informations de livraison
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Nom</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    required
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="address">Adresse</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="city">Ville</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="postalCode">Code postal</Label>
                  <Input
                    id="postalCode"
                    value={formData.postalCode}
                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Banknote className="h-5 w-5" />
                Mode de paiement
              </h3>
              <RadioGroup
                value={formData.paymentMethod}
                onValueChange={(value) => handleInputChange('paymentMethod', value)}
              >
                {paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value={method.id} id={method.id} />
                    <div className="flex-1">
                      <Label htmlFor={method.id} className="font-medium">
                        {method.name}
                      </Label>
                      <p className="text-sm text-gray-500">{method.description}</p>
                    </div>
                  </div>
                ))}
              </RadioGroup>

              {/* RIB Information for Bank Transfer */}
              {formData.paymentMethod === 'transfer' && (
                <Card className="mt-4 border-blue-200 bg-blue-50/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Building className="h-5 w-5 text-blue-600" />
                      Informations bancaires (RIB)
                    </CardTitle>
                    <CardDescription>
                      Utilisez ces informations pour effectuer votre virement bancaire
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Banque</Label>
                          <p className="text-sm font-semibold">{ribInfo.bankName}</p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Titulaire du compte</Label>
                          <p className="text-sm font-semibold">{ribInfo.accountHolder}</p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
                        <div className="flex-1">
                          <Label className="text-sm font-medium text-gray-600">IBAN</Label>
                          <p className="text-sm font-semibold font-mono">{ribInfo.iban}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(ribInfo.iban, 'IBAN')}
                          className="ml-2"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
                        <div className="flex-1">
                          <Label className="text-sm font-medium text-gray-600">Code BIC/SWIFT</Label>
                          <p className="text-sm font-semibold font-mono">{ribInfo.bic}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(ribInfo.bic, 'Code BIC')}
                          className="ml-2"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
                        <div className="flex-1">
                          <Label className="text-sm font-medium text-gray-600">Numéro de compte</Label>
                          <p className="text-sm font-semibold font-mono">{ribInfo.accountNumber}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(ribInfo.accountNumber, 'Numéro de compte')}
                          className="ml-2"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-sm text-amber-800">
                        <strong>Important :</strong> Veuillez inclure votre nom et numéro de commande dans la référence du virement pour faciliter le traitement.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Payment Proof Upload for Bank Transfer */}
              {formData.paymentMethod === 'transfer' && (
                <div className="mt-6">
                  <PaymentProofUpload
                    currentImage={formData.paymentProofImage}
                    onImageChange={(imageUrl) => handleInputChange('paymentProofImage', imageUrl || '')}
                    disabled={loading}
                  />
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="deliveryNotes">Notes de livraison (optionnel)</Label>
              <Textarea
                id="deliveryNotes"
                value={formData.deliveryNotes}
                onChange={(e) => handleInputChange('deliveryNotes', e.target.value)}
                placeholder="Instructions spéciales pour la livraison (adresse précise, horaires préférés, etc.)..."
              />
            </div>

            <div>
              <Label htmlFor="notes">Notes de commande (optionnel)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Informations supplémentaires sur votre commande..."
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Récapitulatif de commande</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Sous-total</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Livraison</span>
                  <span className="text-blue-600 font-medium">Nous contacter</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 3:
        return (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-green-600 mb-2">
                Commande confirmée !
              </h3>
              <p className="text-gray-600">
                Votre commande a été passée avec succès. Vous recevrez un email de confirmation sous peu.
              </p>
            </div>
            <Button onClick={onClose} className="w-full">
              Fermer
            </Button>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {step === 3 ? 'Commande confirmée' : 'Finaliser la commande'}
          </DialogTitle>
          <DialogDescription>
            {step === 3
              ? 'Votre commande a été traitée avec succès'
              : `Étape ${step} sur 2`
            }
          </DialogDescription>
        </DialogHeader>

        {renderStep()}

        {step < 3 && (
          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={() => step === 1 ? onClose() : setStep(step - 1)}
            >
              {step === 1 ? 'Annuler' : 'Précédent'}
            </Button>

            <Button
              onClick={() => step === 2 ? handleSubmitOrder() : setStep(step + 1)}
              disabled={loading}
            >
              {loading ? 'Traitement...' : step === 2 ? 'Confirmer la commande' : 'Suivant'}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
