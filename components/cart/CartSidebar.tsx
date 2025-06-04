"use client"

import React from 'react'
import { useCart } from '@/contexts/CartContext'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  X,
  Plus,
  Minus,
  ShoppingBag,
  Trash2,
  Sparkles,
  Heart,
  Share2,
  Calculator,
  Package,
  Zap,
  Gift,
  Star
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { formatCurrency } from '@/lib/utils'

interface CartSidebarProps {
  onCheckout: () => void
}

export function CartSidebar({ onCheckout }: CartSidebarProps) {
  const { state, removeItem, updateQuantity, closeCart } = useCart()

  console.log("🛒 CartSidebar: Rendering with state:", state)
  console.log("🛒 CartSidebar: Items count:", state.items.length)
  console.log("🛒 CartSidebar: Items:", state.items)

  const formatPrice = (price: number) => {
    return formatCurrency(price)
  }

  // Calculate savings if any items have compare prices
  const totalSavings = state.items.reduce((savings, item) => {
    // For demo purposes, assume some items have 15% savings
    const itemSavings = item.price * 0.15 * item.quantity
    return savings + itemSavings
  }, 0)

  // Professional recommendations based on cart items
  const getRecommendations = () => {
    const categories = state.items.map(item => item.name.toLowerCase())
    if (categories.some(cat => cat.includes('scalpel') || cat.includes('instrument'))) {
      return [
        { name: 'Gants chirurgicaux stériles', price: 25, category: 'Consommables' },
        { name: 'Désinfectant médical', price: 35, category: 'Hygiène' }
      ]
    }
    return [
      { name: 'Kit de stérilisation', price: 89, category: 'Équipement' },
      { name: 'Compresses stériles', price: 15, category: 'Consommables' }
    ]
  }

  const recommendations = getRecommendations()

  return (
    <Sheet open={state.isOpen} onOpenChange={closeCart}>
      <SheetContent className="w-full sm:max-w-lg bg-gradient-to-br from-white via-blue-50/30 to-white p-0 flex flex-col h-full">
        <SheetHeader className="sr-only">
          <SheetTitle>Panier Professionnel</SheetTitle>
          <SheetDescription>Gérez vos articles avant de passer commande</SheetDescription>
        </SheetHeader>

        {/* Fixed Header */}
        <div className="flex-shrink-0 p-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <ShoppingBag className="h-6 w-6 text-white" />
              </div>
              {state.itemCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg"
                >
                  {state.itemCount}
                </motion.div>
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                Panier Professionnel
                <Sparkles className="h-5 w-5 text-blue-500" />
              </h2>
              <p className="text-sm text-gray-600">
                {state.itemCount} article{state.itemCount !== 1 ? 's' : ''} • {formatPrice(state.total)}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          {state.itemCount > 0 && (
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-600 mb-2">
                <span>Progression de commande</span>
                <span>{Math.min(100, (state.total / 1000) * 100).toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (state.total / 1000) * 100)}%` }}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {state.total >= 1000 ? '🎉 Commande professionnelle complète!' : `Plus que ${formatPrice(1000 - state.total)} pour une commande optimale`}
              </p>
            </div>
          )}
        </div>

        {state.items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
            <div className="relative mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                <ShoppingBag className="h-12 w-12 text-blue-400" />
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-2 border-dashed border-blue-300 rounded-full"
              />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              Panier Professionnel Vide
              <Sparkles className="h-5 w-5 text-blue-500" />
            </h3>
            <p className="text-gray-600 mb-6 max-w-sm">
              Découvrez notre gamme complète d'équipements dentaires professionnels
            </p>
            <div className="space-y-3 w-full max-w-xs">
              <Button asChild onClick={closeCart} className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                <Link href="/catalog">
                  <Package className="mr-2 h-4 w-4" />
                  Parcourir le Catalogue
                </Link>
              </Button>
              <Button asChild onClick={closeCart} variant="outline" className="w-full">
                <Link href="/">
                  <Star className="mr-2 h-4 w-4" />
                  Produits Vedettes
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Scrollable Cart Items */}
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full px-6">
              <div className="space-y-4 py-4 px-2">
                <AnimatePresence>
                  {state.items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20, scale: 0.8 }}
                      transition={{ delay: index * 0.1 }}
                      className="group relative"
                    >
                      {/* Innovative Item Card */}
                      <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                        {/* Gradient Border Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>

                        <div className="relative flex items-center space-x-4">
                          {/* Enhanced Product Image */}
                          <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-md">
                            <Image
                              src={item.image || "/images/dental-equipment.jpg"}
                              alt={item.name}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                            {/* Professional Badge */}
                            <div className="absolute top-1 right-1 w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
                              <Zap className="h-3 w-3 text-white" />
                            </div>
                          </div>

                          {/* Enhanced Product Details */}
                          <div className="flex-1 min-w-0">
                            <Link
                              href={`/products/${item.slug}`}
                              onClick={closeCart}
                              className="block group/link"
                            >
                              <h4 className="text-sm font-semibold text-gray-900 group-hover/link:text-blue-600 transition-colors line-clamp-2 mb-1">
                                {item.name}
                              </h4>
                            </Link>

                            {/* Price with Savings */}
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-lg font-bold text-blue-600">
                                {formatPrice(item.price)}
                              </span>
                              <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                                -15% Pro
                              </Badge>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <motion.div
                                  whileTap={{ scale: 0.9 }}
                                  className="flex items-center bg-gray-50 rounded-lg border"
                                >
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 hover:bg-gray-100 rounded-l-lg"
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>

                                  <div className="px-3 py-1 text-sm font-medium min-w-[40px] text-center">
                                    {item.quantity}
                                  </div>

                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 hover:bg-gray-100 rounded-r-lg"
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    disabled={item.quantity >= item.stockQuantity}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </motion.div>

                                {/* Stock Indicator */}
                                <div className="text-xs text-gray-500">
                                  {item.stockQuantity > 10 ? '✅ En stock' : `⚠️ ${item.stockQuantity} restant`}
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-gray-400 hover:text-blue-500 hover:bg-blue-50"
                                >
                                  <Heart className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-red-400 hover:text-red-600 hover:bg-red-50"
                                  onClick={() => removeItem(item.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Smart Recommendations */}
                {state.items.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6"
                  >
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 border border-blue-100">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-blue-500" />
                        Recommandations Professionnelles
                      </h3>
                      <div className="space-y-2">
                        {recommendations.map((rec, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between bg-white/60 rounded-lg p-2 hover:bg-white/80 transition-colors cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg flex items-center justify-center">
                                <Plus className="h-4 w-4 text-white" />
                              </div>
                              <div>
                                <p className="text-xs font-medium text-gray-900">{rec.name}</p>
                                <p className="text-xs text-gray-500">{rec.category}</p>
                              </div>
                            </div>
                            <span className="text-xs font-semibold text-blue-600">{formatPrice(rec.price)}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
              </ScrollArea>
            </div>

            {/* Fixed Footer */}
            <div className="flex-shrink-0 border-t bg-white/50 backdrop-blur-sm p-6 space-y-4">
              {/* Savings Display */}
              {totalSavings > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-3 border border-green-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Gift className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-medium text-green-800">Économies Pro</span>
                    </div>
                    <span className="text-sm font-bold text-green-600">
                      -{formatPrice(totalSavings)}
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Total Section */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Sous-total</span>
                  <span className="text-sm font-medium">{formatPrice(state.total)}</span>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-gray-600">Livraison</span>
                  <span className="text-sm font-medium text-green-600">Nous contacter</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    Total
                    <Calculator className="h-4 w-4 text-blue-500" />
                  </span>
                  <span className="text-xl font-bold text-blue-600">
                    {formatPrice(state.total)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <motion.div whileTap={{ scale: 0.98 }}>
                  <Button
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={onCheckout}
                    size="lg"
                  >
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Passer Commande Professionnelle
                  </Button>
                </motion.div>

                <Button
                  variant="outline"
                  className="w-full border-gray-200 hover:bg-gray-50 rounded-xl"
                  asChild
                  onClick={closeCart}
                >
                  <Link href="/catalog">
                    <Package className="mr-2 h-4 w-4" />
                    Continuer les Achats
                  </Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
