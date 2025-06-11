"use client"

import { useState, useEffect } from "react"
import { Mail, Bell, type LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import Link from "next/link"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
  }[]
}) {

  const [unreadMessages, setUnreadMessages] = useState(0)
  const [lowStockAlerts, setLowStockAlerts] = useState(0)

  // Fetch unread messages count
  useEffect(() => {
    const fetchUnreadMessages = async () => {
      try {
        const response = await fetch('/api/contact?status=UNREAD&limit=1')
        if (response.ok) {
          const data = await response.json()
          setUnreadMessages(data.pagination?.totalCount || 0)
        }
      } catch (error) {
        console.error('Failed to fetch unread messages:', error)
      }
    }

    fetchUnreadMessages()
    // Refresh every 30 seconds
    const interval = setInterval(fetchUnreadMessages, 30000)
    return () => clearInterval(interval)
  }, [])

  // Listen for message updates to refresh badge immediately
  useEffect(() => {
    const handleMessagesUpdate = async () => {
      try {
        console.log('📧 Messages updated event received, refreshing badge...')
        const response = await fetch('/api/contact?status=UNREAD&limit=1')
        if (response.ok) {
          const data = await response.json()
          const newCount = data.pagination?.totalCount || 0
          setUnreadMessages(newCount)
          console.log('📧 Messages badge updated:', newCount)
        }
      } catch (error) {
        console.error('Failed to fetch unread messages:', error)
      }
    }

    // Listen for custom events when messages are updated
    window.addEventListener('messagesUpdated', handleMessagesUpdate)

    return () => {
      window.removeEventListener('messagesUpdated', handleMessagesUpdate)
    }
  }, [])

  // Fetch low stock alerts (respecting dismissed alerts)
  useEffect(() => {
    const fetchLowStockAlerts = async () => {
      try {
        // Get dismissed alerts from localStorage
        const dismissedAlerts = JSON.parse(localStorage.getItem('alertStates') || '{}')
        const dismissedAlertIds = Object.keys(dismissedAlerts).filter(id => dismissedAlerts[id]?.isDismissed)

        // Fetch base alert count
        const response = await fetch('/api/alerts/count')
        if (response.ok) {
          const data = await response.json()

          // Calculate actual visible alerts by subtracting dismissed ones
          let visibleAlerts = data.baseAlertCount || 0

          // Subtract dismissed alerts
          dismissedAlertIds.forEach(alertId => {
            if (alertId.startsWith('out_of_stock_') || alertId === 'low_stock_warning') {
              visibleAlerts = Math.max(0, visibleAlerts - 1)
            }
          })

          setLowStockAlerts(visibleAlerts)
        }
      } catch (error) {
        console.error('Failed to fetch low stock alerts:', error)
      }
    }

    fetchLowStockAlerts()

    // Refresh every 30 seconds to stay in sync with alerts page
    const interval = setInterval(fetchLowStockAlerts, 30000)
    return () => clearInterval(interval)
  }, [])

  // Listen for localStorage changes to update badge immediately
  useEffect(() => {
    const handleStorageChange = () => {
      // Re-fetch alerts when localStorage changes
      const fetchLowStockAlerts = async () => {
        try {
          const dismissedAlerts = JSON.parse(localStorage.getItem('alertStates') || '{}')
          const dismissedAlertIds = Object.keys(dismissedAlerts).filter(id => dismissedAlerts[id]?.isDismissed)

          const response = await fetch('/api/alerts/count')
          if (response.ok) {
            const data = await response.json()
            let visibleAlerts = data.baseAlertCount || 0

            dismissedAlertIds.forEach(alertId => {
              if (alertId.startsWith('out_of_stock_') || alertId === 'low_stock_warning') {
                visibleAlerts = Math.max(0, visibleAlerts - 1)
              }
            })

            setLowStockAlerts(visibleAlerts)
          }
        } catch (error) {
          console.error('Failed to fetch low stock alerts:', error)
        }
      }

      fetchLowStockAlerts()
    }

    // Listen for storage events (from other tabs)
    window.addEventListener('storage', handleStorageChange)

    // Also listen for custom events when localStorage is updated from same tab
    window.addEventListener('alertsUpdated', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('alertsUpdated', handleStorageChange)
    }
  }, [])

  return (
    <SidebarGroup className="px-4">
      <SidebarGroupContent className="flex flex-col gap-4">
        {/* Quick Action Buttons */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <Button
              size="sm"
              className="flex-1 border-gray-200/50 text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 transition-all duration-300 rounded-lg relative"
              variant="outline"
              asChild
            >
              <Link href="/admin/messages">
                <Mail className="h-4 w-4" />
                <span className="hidden sm:inline">Messages</span>
                {unreadMessages > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 bg-red-500 text-white text-xs flex items-center justify-center rounded-full animate-pulse">
                    {unreadMessages > 99 ? '99+' : unreadMessages}
                  </Badge>
                )}
              </Link>
            </Button>
            <Button
              size="sm"
              className="flex-1 border-blue-200 text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-700 transition-all duration-300 rounded-lg relative"
              variant="outline"
              asChild
            >
              <Link href="/admin/alerts">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Alerts</span>
                {lowStockAlerts > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 bg-red-500 text-white text-xs flex items-center justify-center rounded-full animate-pulse">
                    {lowStockAlerts > 99 ? '99+' : lowStockAlerts}
                  </Badge>
                )}
              </Link>
            </Button>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="space-y-2">
          <SidebarGroupLabel className="text-xs font-bold text-gray-500 uppercase tracking-wider px-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarMenu className="space-y-1">
            {items.map((item, index) => {
              const isActive = false // You can implement active state logic here
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    asChild
                    className={`group relative overflow-hidden rounded-xl transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:shadow-md ${
                      isActive ? 'bg-gradient-to-r from-blue-100 to-indigo-100 shadow-sm' : ''
                    }`}
                  >
                    <a href={item.url} className="flex items-center gap-3 p-3">
                      {item.icon && (
                        <div className="p-1.5 rounded-lg bg-gray-100 group-hover:bg-white transition-all duration-300 group-hover:shadow-sm">
                          <item.icon className="h-4 w-4 text-gray-600 group-hover:text-blue-600 transition-colors duration-300" />
                        </div>
                      )}
                      <span className="font-semibold text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                        {item.title}
                      </span>

                      {/* Hover indicator */}
                      <div className="absolute right-2 w-1 h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0" />
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </div>
      </SidebarGroupContent>


    </SidebarGroup>
  )
}
