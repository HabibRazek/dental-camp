"use client"

import { Bell, MessageSquare, LogOut, Settings, Home, Package, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSession, signOut } from "next-auth/react"
import { usePathname, useRouter } from "next/navigation"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function SiteHeader() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const router = useRouter()

  // Get user initials for avatar
  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const userInitials = session?.user?.name ? getUserInitials(session.user.name) : 'U'
  const userName = session?.user?.name || 'Utilisateur'
  const userEmail = session?.user?.email || ''

  // Dynamic page information based on current route
  const getPageInfo = () => {
    const pathSegments = pathname.split('/').filter(Boolean)

    if (pathname === '/dashboard') {
      return {
        icon: '🏠',
        title: 'Dashboard',
        description: 'Vue d\'ensemble de votre activité'
      }
    }

    if (pathname === '/orders') {
      return {
        icon: '📦',
        title: 'Commandes',
        description: 'Gestion des commandes clients'
      }
    }

    if (pathname.startsWith('/admin/products')) {
      return {
        icon: '🦷',
        title: 'Produits',
        description: 'Gestion du catalogue produits'
      }
    }

    if (pathname.startsWith('/admin/categories')) {
      return {
        icon: '📂',
        title: 'Catégories',
        description: 'Organisation des produits'
      }
    }

    if (pathname === '/customers') {
      return {
        icon: '👥',
        title: 'Clients',
        description: 'Gestion de la clientèle'
      }
    }

    if (pathname.startsWith('/admin/messages')) {
      return {
        icon: '💬',
        title: 'Messages',
        description: 'Communication client'
      }
    }

    // Default fallback
    return {
      icon: '📊',
      title: 'Overview',
      description: 'Tableau de bord'
    }
  }

  const pageInfo = getPageInfo()

  // Handle navigation
  const handleNavigation = (path: string) => {
    router.push(path)
  }

  // Handle logout
  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' })
  }

  return (
    <header className="flex h-20 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-16 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      <div className="flex items-center gap-4 px-6">
        <SidebarTrigger className="-ml-1 text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 transition-all duration-300 rounded-lg p-2" />
        <Separator orientation="vertical" className="mr-2 h-6 bg-gradient-to-b from-gray-200 to-gray-300" />

        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink
                href="/"
                onClick={(e) => {
                  e.preventDefault()
                  handleNavigation('/')
                }}
                className="text-gray-600 hover:text-blue-700 font-medium transition-colors duration-200 flex items-center gap-2 cursor-pointer"
              >
                🏠 Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block text-gray-400" />
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink
                href="/dashboard"
                onClick={(e) => {
                  e.preventDefault()
                  handleNavigation('/dashboard')
                }}
                className="text-gray-600 hover:text-blue-700 font-medium transition-colors duration-200 flex items-center gap-2 cursor-pointer"
              >
                📊 Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block text-gray-400" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-gray-900 font-bold flex items-center gap-2">
                {pageInfo.icon} {pageInfo.title}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="ml-auto flex items-center gap-4 px-6">
        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleNavigation('/admin/messages')}
            className="h-10 w-10 text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 transition-all duration-300 rounded-xl relative group"
            title="Messages clients"
          >
            <MessageSquare className="h-5 w-5" />
            <span className="sr-only">Messages</span>
            {/* Notification dot */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full border-2 border-white shadow-sm animate-pulse" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleNavigation('/orders')}
            className="h-10 w-10 text-gray-600 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 hover:text-emerald-700 transition-all duration-300 rounded-xl relative group"
            title="Notifications commandes"
          >
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
            {/* Notification dot */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full border-2 border-white shadow-sm" />
          </Button>

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-10 px-3 text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-700 transition-all duration-300 rounded-xl font-medium"
              >
                <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">
                  {userInitials}
                </div>
                <span className="hidden sm:inline">{userName}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{userName}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {userEmail}
                  </p>
                  <p className="text-xs text-blue-600 font-medium">
                    {session?.user?.role === 'ADMIN' ? 'Administrateur' : 'Utilisateur'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleNavigation('/dashboard')}>
                <Home className="mr-2 h-4 w-4" />
                <span>Mon Dashboard</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600 focus:text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Se déconnecter</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
