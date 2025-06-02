"use client"

import * as React from "react"
import { useSession } from "next-auth/react"
import {
  User,
  ShoppingBag,
  Heart,
  Settings,
  CreditCard,
  MapPin,
  Bell,
  HelpCircle,
  LogOut,
  Home,
  BarChart3,
} from "lucide-react"

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
  navMain: [
    {
      title: "Dashboard",
      url: "/user/dashboard",
      icon: Home,
      isActive: true,
    },
    {
      title: "My Orders",
      url: "/user/orders",
      icon: ShoppingBag,
    },
    {
      title: "Wishlist",
      url: "/user/wishlist",
      icon: Heart,
    },
    {
      title: "Statistics",
      url: "/user/statistics",
      icon: BarChart3,
    },
  ],
  navSecondary: [
    {
      title: "Profile Settings",
      url: "/user/profile",
      icon: User,
    },
    {
      title: "Payment Methods",
      url: "/user/payment-methods",
      icon: CreditCard,
    },
    {
      title: "Addresses",
      url: "/user/addresses",
      icon: MapPin,
    },
    {
      title: "Notifications",
      url: "/user/notifications",
      icon: Bell,
    },
    {
      title: "Settings",
      url: "/user/settings",
      icon: Settings,
    },
    {
      title: "Help & Support",
      url: "/user/support",
      icon: HelpCircle,
    },
  ],
}

export function UserSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession()

  const user = session?.user ? {
    name: session.user.name || "User",
    email: session.user.email || "user@example.com",
    avatar: session.user.image || "/avatars/default.jpg",
  } : {
    name: "User",
    email: "user@example.com",
    avatar: "/avatars/default.jpg"
  }

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/user/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-sidebar-primary-foreground">
                  <span className="text-white font-bold">D</span>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">DentalCamp</span>
                  <span className="truncate text-xs text-gray-500">User Portal</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
