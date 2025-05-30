"use client"

import { Button } from "@/components/ui/button"
import { UserPlus } from "lucide-react"

export function AddCustomerButton() {
  const handleAddCustomer = () => {
    // Trigger the add customer function from the table component
    const event = new CustomEvent('openAddCustomer')
    window.dispatchEvent(event)
  }

  return (
    <Button
      className="flex items-center gap-2"
      onClick={handleAddCustomer}
    >
      <UserPlus className="h-4 w-4" />
      Add Customer
    </Button>
  )
}
