"use client"

import React, { useState } from 'react'
import { CartIcon } from './CartIcon'
import { CartSidebar } from './CartSidebar'
import { CheckoutModal } from './CheckoutModal'

export function Cart() {
  const [showCheckout, setShowCheckout] = useState(false)

  const handleCheckout = () => {
    setShowCheckout(true)
  }

  const handleCloseCheckout = () => {
    setShowCheckout(false)
  }

  return (
    <>
      <CartIcon />
      <CartSidebar onCheckout={handleCheckout} />
      <CheckoutModal
        isOpen={showCheckout}
        onClose={handleCloseCheckout}
      />
    </>
  )
}
