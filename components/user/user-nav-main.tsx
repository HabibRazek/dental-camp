"use client"

import { type LucideIcon } from "lucide-react"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"

export function UserNavMain({
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
        {/* Navigation Menu - No New Order button for users */}
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
                    <Link href={item.url} className="flex items-center gap-3 p-3">
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
                    </Link>
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
