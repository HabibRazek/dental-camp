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
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 bg-white border-b border-gray-200">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1 text-gray-600 hover:bg-gray-50" />
        <Separator orientation="vertical" className="mr-2 h-4 bg-gray-200" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/dashboard" className="text-gray-600 hover:text-gray-900">
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block text-gray-400" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-gray-900 font-semibold">Overview</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="ml-auto flex items-center gap-2 px-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search products, orders, customers..."
            className="w-[300px] pl-8 border-gray-200 focus:border-gray-400 focus:ring-gray-400/20"
          />
        </div>

        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600 hover:bg-gray-50">
          <MessageSquare className="h-4 w-4" />
          <span className="sr-only">Messages</span>
        </Button>

        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600 hover:bg-gray-50">
          <Bell className="h-4 w-4" />
          <span className="sr-only">Notifications</span>
        </Button>
      </div>
    </header>
  )
}
