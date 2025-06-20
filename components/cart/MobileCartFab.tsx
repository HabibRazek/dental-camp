"use client"

import React from 'react'
import { useCart } from '@/contexts/CartContext'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatCurrency } from '@/lib/utils'

export function MobileCartFab() {
  const { state, toggleCart } = useCart()

  // Only show on mobile when there are items in cart
  if (state.itemCount === 0) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 500, 
          damping: 30 
        }}
        className="fixed bottom-4 right-4 z-50 sm:hidden"
      >
        <Button
          onClick={toggleCart}
          className="relative bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-2xl rounded-full h-14 w-14 p-0 border-4 border-white"
          aria-label={`Panier (${state.itemCount} articles, ${formatCurrency(state.total)})`}
        >
          <ShoppingCart className="h-6 w-6" />
          
          {/* Item Count Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2"
          >
            <Badge className="h-6 w-6 p-0 flex items-center justify-center text-xs font-bold bg-gradient-to-r from-orange-400 to-red-500 text-white shadow-lg border-2 border-white rounded-full">
              {state.itemCount > 99 ? '99+' : state.itemCount}
            </Badge>
          </motion.div>

          {/* Total Price Badge */}
          <motion.div
            initial={{ scale: 0, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg border border-gray-200"
          >
            <span className="text-xs font-bold text-gray-900">
              {formatCurrency(state.total)}
            </span>
          </motion.div>

          {/* Pulse Animation */}
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.5, 0, 0.5]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 rounded-full bg-blue-400 pointer-events-none"
          />
        </Button>
      </motion.div>
    </AnimatePresence>
  )
}
