"use client"

import { Home, User, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
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
    'user': { title: 'Portail utilisateur' },
    'dashboard': { title: 'Tableau de bord', parent: 'Portail utilisateur' },
    'orders': { title: 'Mes commandes', parent: 'Portail utilisateur' },
    'wishlist': { title: 'Liste de souhaits', parent: 'Portail utilisateur' },
    'statistics': { title: 'Statistiques', parent: 'Portail utilisateur' },
    'profile': { title: 'Paramètres du profil', parent: 'Portail utilisateur' },
    'payment-methods': { title: 'Méthodes de paiement', parent: 'Portail utilisateur' },
    'addresses': { title: 'Adresses', parent: 'Portail utilisateur' },
    'notifications': { title: 'Notifications', parent: 'Portail utilisateur' },
    'settings': { title: 'Paramètres', parent: 'Portail utilisateur' },
    'support': { title: 'Aide et support', parent: 'Portail utilisateur' },
  }

  const currentPage = segments[segments.length - 1]
  return pageMap[currentPage] || { title: 'Dashboard', parent: 'User Portal' }
}

export function UserHeader() {
  const pathname = usePathname()
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
                <Home className="h-4 w-4" />
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
