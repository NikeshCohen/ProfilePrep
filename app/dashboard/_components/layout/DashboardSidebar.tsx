"use client";

import type React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { sidebarItems } from "@/constants/navigation";
import type { User } from "next-auth";

import Logo from "@/components/global/Logo";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

interface SidebarProps {
  user: User;
}

export function DashboardSidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const isSuperAdmin = user.role === "SUPERADMIN";
  const isAdmin = user.role === "ADMIN" || isSuperAdmin;

  // filter items based on user role
  const filteredItems = sidebarItems.filter((item) => {
    if (item.superAdminOnly && !isSuperAdmin) return false;
    if (item.adminOnly && !isAdmin) return false;
    return true;
  });

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-5/6 flex-col border-r bg-background/40 backdrop-blur-md sm:w-5/6 md:w-64 lg:w-64">
      <div className="flex h-16 items-center border-b px-6">
        <Logo size="xl" circleSize={10} />
      </div>
      <div className="flex flex-col gap-1 p-4">
        {filteredItems.map((item, index) => (
          <Button
            key={index}
            asChild
            variant={pathname === item.href ? "secondary" : "ghost"}
            className={cn(
              "justify-start",
              pathname === item.href
                ? "bg-primary/10 text-primary hover:bg-primary/20"
                : "hover:bg-muted",
            )}
          >
            <Link href={item.href} className="flex items-center gap-3">
              {item.icon}
              <span>{item.title}</span>
            </Link>
          </Button>
        ))}
      </div>
    </aside>
  );
}
