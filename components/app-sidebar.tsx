"use client"

import * as React from "react"
import { useSession } from "next-auth/react"
import {
  Calendar,
  BarChart3,
  ClipboardList,
  Settings,
  Heart,
  Home,
  Shield,
  UserCheck,
  Users,
  Wrench,
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
      title: "Patients",
      url: "/patients",
      icon: Users,
    },
    {
      title: "Appointments",
      url: "/appointments",
      icon: Calendar,
    },
    {
      title: "Treatments",
      url: "/treatments",
      icon: Heart,
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
      title: "Equipment",
      icon: Wrench,
      isActive: true,
      url: "/equipment",
      items: [
        {
          title: "Dental Chairs",
          url: "/equipment/chairs",
        },
        {
          title: "X-Ray Machines",
          url: "/equipment/xray",
        },
        {
          title: "Sterilizers",
          url: "/equipment/sterilizers",
        },
      ],
    },
    {
      title: "Inventory",
      icon: ClipboardList,
      url: "/inventory",
      items: [
        {
          title: "Supplies",
          url: "/inventory/supplies",
        },
        {
          title: "Medications",
          url: "/inventory/medications",
        },
        {
          title: "Tools",
          url: "/inventory/tools",
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
      name: "Patient Records",
      url: "/records",
      icon: ClipboardList,
    },
    {
      name: "Treatment Plans",
      url: "/plans",
      icon: Heart,
    },
    {
      name: "Reports",
      url: "/reports",
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
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/dashboard">
                <Heart className="h-5 w-5" />
                <span className="text-base font-semibold">Dental Camp</span>
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
