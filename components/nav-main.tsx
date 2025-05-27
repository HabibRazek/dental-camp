"use client"

import { Plus, Mail, Bell, type LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
  }[]
}) {
  return (
    <SidebarGroup className="px-4">
      <SidebarGroupContent className="flex flex-col gap-4">
        {/* Action Buttons */}
        <div className="space-y-3">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Create New Order"
                className="w-full bg-gradient-to-r from-[#0E185F] via-[#2FA4FF] to-[#0E185F] text-white duration-300 ease-out hover:from-[#2FA4FF] hover:via-[#00FFDD] hover:to-[#2FA4FF] hover:text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 rounded-xl py-3 font-bold"
              >
                <Plus className="h-5 w-5" />
                <span>New Order</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          <div className="flex gap-2">
            <Button
              size="sm"
              className="flex-1 border-gray-200/50 text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 transition-all duration-300 rounded-lg"
              variant="outline"
            >
              <Mail className="h-4 w-4" />
              <span className="hidden sm:inline">Messages</span>
            </Button>
            <Button
              size="sm"
              className="flex-1 border-[#2FA4FF]/30 text-gray-600 hover:bg-gradient-to-r hover:from-[#E8FFC2]/30 hover:to-[#00FFDD]/20 hover:text-[#0E185F] transition-all duration-300 rounded-lg"
              variant="outline"
            >
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Alerts</span>
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
                      <div className="absolute right-2 w-1 h-6 bg-gradient-to-b from-[#2FA4FF] to-[#00FFDD] rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0" />
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
