"use client"

import React from 'react'
import { useCart } from '@/contexts/CartContext'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function CartIcon() {
  const { state, toggleCart } = useCart()

  return (
    <Button
      variant="ghost"
      size="sm"
      className="relative p-1.5 sm:p-2 rounded-full hover:bg-blue-100 hover:text-blue-600 transition-all duration-200 ease-in-out min-h-[44px] min-w-[44px] sm:min-h-[40px] sm:min-w-[40px]"
      onClick={toggleCart}
      aria-label={`Panier (${state.itemCount} article${state.itemCount !== 1 ? 's' : ''})`}
    >
      <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />

      <AnimatePresence>
        {state.itemCount > 0 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
              duration: 0.3
            }}
            className="absolute -top-1 -right-1 sm:-top-1 sm:-right-1"
          >
            <Badge
              className="h-5 w-5 sm:h-6 sm:w-6 p-0 flex items-center justify-center text-xs font-bold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg border-2 border-white rounded-full"
            >
              {state.itemCount > 99 ? '99+' : state.itemCount}
            </Badge>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pulse animation when items are added */}
      <AnimatePresence>
        {state.itemCount > 0 && (
          <motion.div
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{ scale: 1.2, opacity: 0 }}
            exit={{ scale: 1, opacity: 0 }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              repeatDelay: 2
            }}
            className="absolute inset-0 rounded-full bg-blue-400 pointer-events-none"
          />
        )}
      </AnimatePresence>
    </Button>
  )
}
