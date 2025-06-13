"use client"

import * as React from "react"
import { useSession } from "next-auth/react"
import {
  ShoppingCart,
  BarChart3,
  ClipboardList,
  Settings,
  Heart,
  Home,
  Shield,
  UserCheck,
  Users,
  Package,
  Store,
  Boxes,
  Tag,
  MessageSquare,
  type LucideIcon,
} from "lucide-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Dr. Smith",
    email: "dr.smith@dentalcamp.com",
    avatar: "/avatars/doctor.jpg",
  },
  navMain: [
    {
      title: "Tableau de bord",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Clients",
      url: "/customers",
      icon: Users,
    },
    {
      title: "Commandes",
      url: "/orders",
      icon: ShoppingCart,
    },
    {
      title: "Produits",
      url: "/admin/products",
      icon: Package,
    },
    {
      title: "Catégories",
      url: "/admin/categories",
      icon: Tag,
    },
    {
      title: "Messages",
      url: "/admin/messages",
      icon: MessageSquare,
    },
    {
      title: "Analyses",
      url: "/analytics",
      icon: BarChart3,
    },
  ],
  navClouds: [
    {
      title: "Gestion des stocks",
      icon: Boxes,
      url: "/inventory",
      items: [
        {
          title: "Niveaux de stock",
          url: "/inventory/stock",
        },
        {
          title: "Fournisseurs",
          url: "/inventory/suppliers",
        },
        {
          title: "Approvisionnement",
          url: "/inventory/procurement",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Paramètres",
      url: "/settings",
      icon: Settings,
    },
    {
      title: "Sécurité",
      url: "/security",
      icon: Shield,
    },
  ],
  documents: [
    {
      name: "Rapports de commandes",
      url: "/reports/orders",
      icon: ClipboardList,
    },
    {
      name: "Catalogues de produits",
      url: "/reports/products",
      icon: Package,
    },
    {
      name: "Analyses des ventes",
      url: "/reports/sales",
      icon: BarChart3,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession()

  const user = session?.user ? {
    name: session.user.name || "User",
    email: session.user.email || "user@dentalcamp.com",
    avatar: session.user.image || "/avatars/default.jpg",
  } : data.user

  return (
    <Sidebar collapsible="offcanvas" {...props} className="border-r border-gray-200/50 bg-gradient-to-b from-white to-gray-50/30">
      <SidebarHeader className="bg-gradient-to-r from-white to-gray-50/50 border-b border-gray-100/50 p-4 sm:p-6">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 transition-all duration-300 rounded-xl group"
            >
              <a href="/dashboard" className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">Dental Camp</span>
                  <span className="text-xs text-gray-500 font-medium hidden sm:block">E-commerce Platform</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
