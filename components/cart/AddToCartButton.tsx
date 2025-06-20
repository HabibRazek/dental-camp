"use client"

import React from 'react'
import { useCart } from '@/contexts/CartContext'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

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
  const { data: session } = useSession()
  const router = useRouter()
  const isInStock = product.stockQuantity > 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Vérifier l'authentification avant d'ajouter au panier
    if (!session) {
      toast.error("Vous devez être connecté pour ajouter des produits au panier")
      router.push('/auth/signin')
      return
    }

    if (!isInStock || disabled) {
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

    addItem(cartItem)
    toast.success("Produit ajouté au panier")
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
        className={`w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium min-h-[32px] sm:min-h-[36px] py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md ${className}`}
        onClick={handleAddToCart}
        disabled={!isInStock || disabled}
      >
        <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
        <span className="text-xs sm:text-sm font-medium truncate">
          {isInStock ? 'Ajouter au panier' : 'Rupture de stock'}
        </span>
      </Button>
    )
  }

  return (
    <Button
      size={size}
      className={`w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium min-h-[32px] sm:min-h-[36px] py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md ${className}`}
      onClick={handleAddToCart}
      disabled={!isInStock || disabled}
    >
      <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
      <span className="text-xs sm:text-sm font-medium">
        {isInStock ? 'Ajouter au panier' : 'Rupture de stock'}
      </span>
    </Button>
  )
}
