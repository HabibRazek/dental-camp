"use client"

import { Search, Bell, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export function SiteHeader() {
  return (
    <header className="flex h-20 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-16 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      <div className="flex items-center gap-4 px-6">
        <SidebarTrigger className="-ml-1 text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 transition-all duration-300 rounded-lg p-2" />
        <Separator orientation="vertical" className="mr-2 h-6 bg-gradient-to-b from-gray-200 to-gray-300" />

        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink
                href="/dashboard"
                className="text-gray-600 hover:text-blue-700 font-medium transition-colors duration-200 flex items-center gap-2"
              >
                🏠 Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block text-gray-400" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-gray-900 font-bold flex items-center gap-2">
                📊 Overview
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="ml-auto flex items-center gap-4 px-6">
        {/* Enhanced Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="🔍 Search products, orders, customers..."
            className="w-[350px] pl-10 pr-4 py-2.5 border-gray-200/50 bg-gray-50/50 focus:bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-500/20 rounded-xl transition-all duration-300 font-medium"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 transition-all duration-300 rounded-xl relative group"
          >
            <MessageSquare className="h-5 w-5" />
            <span className="sr-only">Messages</span>
            {/* Notification dot */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full border-2 border-white shadow-sm animate-pulse" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 text-gray-600 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 hover:text-emerald-700 transition-all duration-300 rounded-xl relative group"
          >
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
            {/* Notification dot */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full border-2 border-white shadow-sm" />
          </Button>

          {/* User Profile */}
          <Button
            variant="ghost"
            className="h-10 px-3 text-gray-600 hover:bg-gradient-to-r hover:from-[#E8FFC2]/30 hover:to-[#00FFDD]/20 hover:text-[#0E185F] transition-all duration-300 rounded-xl font-medium"
          >
            <div className="w-6 h-6 bg-gradient-to-br from-[#0E185F] to-[#2FA4FF] rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">
              MB
            </div>
            <span className="hidden sm:inline">Dr. Mourad Bayar</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
