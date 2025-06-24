"use client"

import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { toast } from 'sonner'

export interface WishlistItem {
  id: string
  name: string
  price: number
  originalPrice?: number | null
  image: string
  category: string
  rating: number
  reviewCount: number
  inStock: boolean
  stockQuantity: number
  addedDate: string
  slug: string
  description: string
  discount?: number | null
}

interface WishlistState {
  items: WishlistItem[]
  itemCount: number
}

type WishlistAction =
  | { type: 'ADD_ITEM'; payload: WishlistItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR_WISHLIST' }
  | { type: 'LOAD_WISHLIST'; payload: WishlistItem[] }
  | { type: 'UPDATE_RATING'; payload: { id: string; rating: number } }

interface WishlistContextType {
  state: WishlistState
  addToWishlist: (item: Omit<WishlistItem, 'addedDate'>) => void
  removeFromWishlist: (id: string) => void
  clearWishlist: () => void
  isInWishlist: (id: string) => boolean
  updateItemRating: (id: string, rating: number) => void
}

const wishlistReducer = (state: WishlistState, action: WishlistAction): WishlistState => {
  switch (action.type) {
    case 'ADD_ITEM':
      // Check if item already exists
      if (state.items.find(item => item.id === action.payload.id)) {
        return state
      }
      const newItems = [...state.items, action.payload]
      return {
        items: newItems,
        itemCount: newItems.length
      }
    
    case 'REMOVE_ITEM':
      const filteredItems = state.items.filter(item => item.id !== action.payload)
      return {
        items: filteredItems,
        itemCount: filteredItems.length
      }
    
    case 'CLEAR_WISHLIST':
      return {
        items: [],
        itemCount: 0
      }
    
    case 'LOAD_WISHLIST':
      return {
        items: action.payload,
        itemCount: action.payload.length
      }
    
    case 'UPDATE_RATING':
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, rating: action.payload.rating, reviewCount: item.reviewCount + 1 }
          : item
      )
      return {
        ...state,
        items: updatedItems
      }
    
    default:
      return state
  }
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, {
    items: [],
    itemCount: 0
  })

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('dental-camp-wishlist')
    if (savedWishlist) {
      try {
        const items = JSON.parse(savedWishlist)
        dispatch({ type: 'LOAD_WISHLIST', payload: items })
      } catch (error) {
        console.error('Error loading wishlist from localStorage:', error)
      }
    }
  }, [])

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('dental-camp-wishlist', JSON.stringify(state.items))
  }, [state.items])

  const addToWishlist = async (item: Omit<WishlistItem, 'addedDate'>) => {
    if (state.items.find(existingItem => existingItem.id === item.id)) {
      toast.info('Ce produit est déjà dans votre liste de souhaits')
      return
    }

    const wishlistItem: WishlistItem = {
      ...item,
      addedDate: new Date().toISOString()
    }

    dispatch({ type: 'ADD_ITEM', payload: wishlistItem })
    toast.success('Produit ajouté à votre liste de souhaits')

    // Also save to backend
    try {
      await fetch('/api/user/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId: item.id })
      })
    } catch (error) {
      console.error('Error saving to backend wishlist:', error)
    }
  }

  const removeFromWishlist = async (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id })
    toast.success('Produit retiré de votre liste de souhaits')

    // Also remove from backend
    try {
      await fetch(`/api/user/wishlist?productId=${id}`, {
        method: 'DELETE'
      })
    } catch (error) {
      console.error('Error removing from backend wishlist:', error)
    }
  }

  const clearWishlist = () => {
    dispatch({ type: 'CLEAR_WISHLIST' })
    toast.success('Liste de souhaits vidée')
  }

  const isInWishlist = (id: string) => {
    return state.items.some(item => item.id === id)
  }

  const updateItemRating = (id: string, rating: number) => {
    dispatch({ type: 'UPDATE_RATING', payload: { id, rating } })
  }

  return (
    <WishlistContext.Provider value={{
      state,
      addToWishlist,
      removeFromWishlist,
      clearWishlist,
      isInWishlist,
      updateItemRating
    }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}
