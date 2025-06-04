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
      className="relative p-2"
      onClick={toggleCart}
    >
      <ShoppingCart className="h-5 w-5" />
      
      <AnimatePresence>
        {state.itemCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-1 -right-1"
          >
            <Badge 
              variant="destructive" 
              className="h-5 w-5 p-0 flex items-center justify-center text-xs font-bold bg-red-500 hover:bg-red-600"
            >
              {state.itemCount > 99 ? '99+' : state.itemCount}
            </Badge>
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  )
}
