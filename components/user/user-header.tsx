"use client"

import { Bell, Search, ShoppingCart, Home, User, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { usePathname } from "next/navigation"
import { useCart } from "@/contexts/CartContext"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"

// Helper function to get page title from pathname
const getPageInfo = (pathname: string) => {
  const segments = pathname.split('/').filter(Boolean)

  const pageMap: Record<string, { title: string; parent?: string }> = {
    'user': { title: 'User Portal' },
    'dashboard': { title: 'Dashboard', parent: 'User Portal' },
    'orders': { title: 'My Orders', parent: 'User Portal' },
    'wishlist': { title: 'Wishlist', parent: 'User Portal' },
    'statistics': { title: 'Statistics', parent: 'User Portal' },
    'profile': { title: 'Profile Settings', parent: 'User Portal' },
    'payment-methods': { title: 'Payment Methods', parent: 'User Portal' },
    'addresses': { title: 'Addresses', parent: 'User Portal' },
    'notifications': { title: 'Notifications', parent: 'User Portal' },
    'settings': { title: 'Settings', parent: 'User Portal' },
    'support': { title: 'Help & Support', parent: 'User Portal' },
  }

  const currentPage = segments[segments.length - 1]
  return pageMap[currentPage] || { title: 'Dashboard', parent: 'User Portal' }
}

export function UserHeader() {
  const pathname = usePathname()
  const { state, openCart } = useCart()
  const pageInfo = getPageInfo(pathname)

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-gradient-to-r from-white to-gray-50/50 px-4">
      <SidebarTrigger className="-ml-1 hover:bg-blue-50 rounded-lg transition-colors" />
      <Separator orientation="vertical" className="mr-2 h-4" />

      {/* Dynamic Breadcrumbs */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink
              href="/"
              className="flex items-center gap-1 hover:text-blue-600 transition-colors"
            >
              <Home className="h-4 w-4" />
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden md:block" />
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink
              href="/user/dashboard"
              className="hover:text-blue-600 transition-colors"
            >
              {pageInfo.parent}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-semibold text-blue-600">
              {pageInfo.title}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <div className="ml-auto flex items-center space-x-3">
        {/* Enhanced Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search orders, products..."
            className="w-[300px] pl-9 bg-white/80 border-gray-200 focus:border-blue-300 focus:ring-blue-200 rounded-xl"
          />
        </div>

        {/* Enhanced Cart Button */}
        <Button
          variant="ghost"
          size="sm"
          className="relative hover:bg-blue-50 rounded-xl transition-all duration-200"
          onClick={openCart}
        >
          <ShoppingCart className="h-5 w-5 text-gray-600" />
          {state.itemCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg animate-pulse">
              {state.itemCount}
            </Badge>
          )}
        </Button>

        {/* Enhanced Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="relative hover:bg-orange-50 rounded-xl transition-all duration-200"
            >
              <Bell className="h-5 w-5 text-gray-600" />
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-gradient-to-r from-orange-400 to-red-500 text-white shadow-lg">
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 border-0 shadow-xl rounded-xl">
            <DropdownMenuLabel className="text-lg font-semibold text-gray-900 p-4 border-b">
              Notifications
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="p-4 hover:bg-blue-50 transition-colors">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium text-gray-900">Order Shipped</p>
                  <p className="text-xs text-gray-600">
                    Your order #ORD-001 has been shipped and is on its way.
                  </p>
                  <p className="text-xs text-blue-600">2 hours ago</p>
                </div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="p-4 hover:bg-green-50 transition-colors">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium text-gray-900">New Product Available</p>
                  <p className="text-xs text-gray-600">
                    Check out our latest dental care products with special discounts.
                  </p>
                  <p className="text-xs text-green-600">1 day ago</p>
                </div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="p-4 hover:bg-purple-50 transition-colors">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium text-gray-900">Profile Updated</p>
                  <p className="text-xs text-gray-600">
                    Your profile information has been successfully updated.
                  </p>
                  <p className="text-xs text-purple-600">3 days ago</p>
                </div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="p-4">
              <Link
                href="/user/notifications"
                className="text-center text-blue-600 hover:text-blue-700 font-medium w-full"
              >
                View All Notifications
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Quick Profile Access */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="relative hover:bg-gray-50 rounded-xl transition-all duration-200"
            >
              <User className="h-5 w-5 text-gray-600" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 border-0 shadow-xl rounded-xl">
            <DropdownMenuLabel className="text-lg font-semibold text-gray-900 p-4 border-b">
              Quick Access
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="p-3 hover:bg-blue-50 transition-colors">
              <Link href="/user/profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="p-3 hover:bg-green-50 transition-colors">
              <Link href="/user/orders" className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                My Orders
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="p-3 hover:bg-purple-50 transition-colors">
              <Link href="/user/settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
