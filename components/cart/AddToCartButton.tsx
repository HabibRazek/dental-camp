"use client"

import React from 'react'
import { useCart } from '@/contexts/CartContext'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Plus } from 'lucide-react'
import { toast } from 'sonner'

interface Product {
  id: string
  name: string
  price: string
  thumbnail?: string | null
  images?: string[]
  slug: string
  stockQuantity: number
}

interface AddToCartButtonProps {
  product: Product
  variant?: 'default' | 'icon' | 'compact'
  size?: 'sm' | 'default' | 'lg'
  className?: string
  disabled?: boolean
}

export function AddToCartButton({ 
  product, 
  variant = 'default', 
  size = 'default',
  className = '',
  disabled = false
}: AddToCartButtonProps) {
  const { addItem } = useCart()
  const isInStock = product.stockQuantity > 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    console.log("🛒 AddToCart button clicked!")
    console.log("🛒 Product:", product)

    if (!isInStock || disabled) {
      console.log("❌ Product out of stock or disabled")
      toast.error("Produit en rupture de stock")
      return
    }

    const cartItem = {
      id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      image: product.thumbnail || product.images?.[0] || "/images/dental-equipment.jpg",
      slug: product.slug,
      stockQuantity: product.stockQuantity
    }

    console.log("🛒 About to call addItem with:", cartItem)
    addItem(cartItem)
    console.log("✅ addItem called successfully!")
  }

  if (variant === 'icon') {
    return (
      <Button
        variant="secondary"
        size={size}
        className={`h-8 w-8 p-0 ${className}`}
        onClick={handleAddToCart}
        disabled={!isInStock || disabled}
      >
        <Plus className="h-4 w-4" />
      </Button>
    )
  }

  if (variant === 'compact') {
    return (
      <Button
        size={size}
        className={`w-full ${className}`}
        onClick={handleAddToCart}
        disabled={!isInStock || disabled}
      >
        <ShoppingCart className="h-4 w-4 mr-2" />
        {isInStock ? 'Ajouter' : 'Rupture'}
      </Button>
    )
  }

  return (
    <Button
      size={size}
      className={`w-full ${className}`}
      onClick={handleAddToCart}
      disabled={!isInStock || disabled}
    >
      <ShoppingCart className="h-4 w-4 mr-2" />
      {isInStock ? 'Ajouter au panier' : 'Rupture de stock'}
    </Button>
  )
}
