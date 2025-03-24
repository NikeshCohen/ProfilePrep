"use client";

import { type ReactNode, useEffect, useState } from "react";

import { DashboardHeader } from "@/app/dashboard/_components/DashboardHeader";
import { DashboardSidebar } from "@/app/dashboard/_components/DashboardSidebar";
import type { User } from "next-auth";

import Background from "@/components/global/Background";

interface DashboardLayoutProps {
  children: ReactNode;
  user: User;
}

export function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      // adjust the breakpoint as needed
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    // call on mount to set initial state
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="relative min-h-screen">
      <Background />
      {!isMobile && <DashboardSidebar user={user} />}
      <div className="flex min-h-screen flex-col md:pl-64">
        <DashboardHeader user={user} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
