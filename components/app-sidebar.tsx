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
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Customers",
      url: "/customers",
      icon: Users,
    },
    {
      title: "Orders",
      url: "/orders",
      icon: ShoppingCart,
    },
    {
      title: "Products",
      url: "/products",
      icon: Package,
    },
    {
      title: "Analytics",
      url: "/analytics",
      icon: BarChart3,
    },
    {
      title: "Staff",
      url: "/staff",
      icon: UserCheck,
    },
  ],
  navClouds: [
    {
      title: "Product Catalog",
      icon: Store,
      isActive: true,
      url: "/catalog",
      items: [
        {
          title: "Dental Equipment",
          url: "/catalog/equipment",
        },
        {
          title: "Instruments",
          url: "/catalog/instruments",
        },
        {
          title: "Consumables",
          url: "/catalog/consumables",
        },
      ],
    },
    {
      title: "Inventory Management",
      icon: Boxes,
      url: "/inventory",
      items: [
        {
          title: "Stock Levels",
          url: "/inventory/stock",
        },
        {
          title: "Suppliers",
          url: "/inventory/suppliers",
        },
        {
          title: "Procurement",
          url: "/inventory/procurement",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
    },
    {
      title: "Security",
      url: "/security",
      icon: Shield,
    },
  ],
  documents: [
    {
      name: "Order Reports",
      url: "/reports/orders",
      icon: ClipboardList,
    },
    {
      name: "Product Catalogs",
      url: "/catalogs",
      icon: Package,
    },
    {
      name: "Sales Analytics",
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
      <SidebarHeader className="bg-gradient-to-r from-white to-gray-50/50 border-b border-gray-100/50 p-6">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 rounded-xl group"
            >
              <a href="/dashboard" className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-black text-gray-900 tracking-tight">Dental Camp</span>
                  <span className="text-xs text-gray-500 font-medium">E-commerce Platform</span>
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
