"use client";

import { usePathname } from "next/navigation";
import TopBar from "@/components/landing/top-bar";

export function ConditionalTopBar() {
  const pathname = usePathname();

  // Don't show TopBar on admin pages, user dashboard pages, or main dashboard
  const isAdminPage = pathname.startsWith('/admin');
  const isUserDashboard = pathname.startsWith('/user');
  const isDashboard = pathname.startsWith('/dashboard');

  if (isAdminPage || isUserDashboard || isDashboard) {
    return null;
  }

  return <TopBar />;
}
