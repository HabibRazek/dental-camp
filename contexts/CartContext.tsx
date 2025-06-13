"use client"

import React, { createContext, useContext, useReducer, useEffect, useState, useRef } from 'react'
import { toast } from 'sonner'

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  slug: string
  stockQuantity: number
}

interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
  isOpen: boolean
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'>; quantity?: number }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] }

const cartReducer = (state: CartState, action: CartAction): CartState => {
  console.log("🛒 CartReducer: Action received:", action.type, 'payload' in action ? action.payload : 'no payload')
  console.log("🛒 CartReducer: Current state:", state)

  switch (action.type) {
    case 'ADD_ITEM': {
      console.log("🛒 CartReducer: Processing ADD_ITEM")
      const quantityToAdd = action.quantity || 1
      const existingItem = state.items.find(item => item.id === action.payload.id)
      console.log("🛒 CartReducer: Existing item found?", existingItem)
      console.log("🛒 CartReducer: Quantity to add:", quantityToAdd)

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantityToAdd
        if (newQuantity > existingItem.stockQuantity) {
          toast.error('Stock insuffisant')
          return state
        }

        const updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: newQuantity }
            : item
        )

        return {
          ...state,
          items: updatedItems,
          total: calculateTotal(updatedItems),
          itemCount: calculateItemCount(updatedItems)
        }
      } else {
        console.log("🛒 CartReducer: Creating new item")
        const newItem = { ...action.payload, quantity: quantityToAdd }
        console.log("🛒 CartReducer: New item created:", newItem)
        const updatedItems = [...state.items, newItem]
        console.log("🛒 CartReducer: Updated items array:", updatedItems)

        const newState = {
          ...state,
          items: updatedItems,
          total: calculateTotal(updatedItems),
          itemCount: calculateItemCount(updatedItems)
        }
        console.log("🛒 CartReducer: New state to return:", newState)
        return newState
      }
    }
    
    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(item => item.id !== action.payload)
      return {
        ...state,
        items: updatedItems,
        total: calculateTotal(updatedItems),
        itemCount: calculateItemCount(updatedItems)
      }
    }
    
    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: action.payload.id })
      }
      
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.min(action.payload.quantity, item.stockQuantity) }
          : item
      )
      
      return {
        ...state,
        items: updatedItems,
        total: calculateTotal(updatedItems),
        itemCount: calculateItemCount(updatedItems)
      }
    }
    
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        total: 0,
        itemCount: 0
      }
    
    case 'TOGGLE_CART':
      return {
        ...state,
        isOpen: !state.isOpen
      }
    
    case 'OPEN_CART':
      return {
        ...state,
        isOpen: true
      }
    
    case 'CLOSE_CART':
      return {
        ...state,
        isOpen: false
      }
    
    case 'LOAD_CART':
      return {
        ...state,
        items: action.payload,
        total: calculateTotal(action.payload),
        itemCount: calculateItemCount(action.payload)
      }
    
    default:
      return state
  }
}

const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0)
}

const calculateItemCount = (items: CartItem[]): number => {
  return items.reduce((count, item) => count + item.quantity, 0)
}

interface CartContextType {
  state: CartState
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0,
    isOpen: false
  })

  // Load cart from localStorage on mount - TEMPORARILY DISABLED FOR DEBUGGING
  // useEffect(() => {
  //   const savedCart = localStorage.getItem('dental-camp-cart')
  //   if (savedCart) {
  //     try {
  //       const cartItems = JSON.parse(savedCart)
  //       if (cartItems && cartItems.length > 0) {
  //         dispatch({ type: 'LOAD_CART', payload: cartItems })
  //       }
  //     } catch (error) {
  //       console.error('Error loading cart from localStorage:', error)
  //     }
  //   }
  // }, [])

  // Debug: Log state changes
  useEffect(() => {
    console.log("🛒 CartProvider: State changed:", state)
  }, [state])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    console.log("🛒 CartProvider: Saving to localStorage:", state.items)
    localStorage.setItem('dental-camp-cart', JSON.stringify(state.items))
  }, [state.items])

  // Toast deduplication mechanism
  const lastToastRef = React.useRef<{ itemId: string; timestamp: number } | null>(null)

  const addItem = (item: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
    console.log("🛒 CartContext: addItem called with:", item, "quantity:", quantity)
    console.log("🛒 CartContext: Current state before dispatch:", state)

    // Prevent duplicate calls within 500ms for the same item
    const now = Date.now()
    if (lastToastRef.current &&
        lastToastRef.current.itemId === item.id &&
        now - lastToastRef.current.timestamp < 500) {
      console.log("🛒 CartContext: Duplicate call detected, ignoring...")
      return
    }

    // Check if item already exists to show appropriate message
    const existingItem = state.items.find(cartItem => cartItem.id === item.id)
    const isNewItem = !existingItem

    dispatch({ type: 'ADD_ITEM', payload: item, quantity })
    console.log("🛒 CartContext: Dispatch called, waiting for state update...")

    // Update last toast reference
    lastToastRef.current = { itemId: item.id, timestamp: now }

    // Show single, informative toast
    if (isNewItem) {
      const quantityText = quantity > 1 ? ` (${quantity})` : ''
      toast.success(`✅ ${item.name}${quantityText} ajouté au panier`, {
        description: "Produit ajouté avec succès",
        duration: 3000,
      })
    } else {
      const newQuantity = existingItem.quantity + quantity
      toast.success(`🔄 Quantité mise à jour`, {
        description: `${item.name} (${newQuantity})`,
        duration: 3000,
      })
    }
  }

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id })
    toast.success('Produit retiré du panier')
  }

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
    toast.success('Panier vidé')
  }

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' })
  }

  const openCart = () => {
    dispatch({ type: 'OPEN_CART' })
  }

  const closeCart = () => {
    dispatch({ type: 'CLOSE_CART' })
  }

  return (
    <CartContext.Provider value={{
      state,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      toggleCart,
      openCart,
      closeCart
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
