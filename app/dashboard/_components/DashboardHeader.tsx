"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { DashboardSidebar } from "@/app/dashboard/_components/DashboardSidebar";
import { dashboardNavItems } from "@/constants/navigation";
import { Menu } from "lucide-react";
import type { User } from "next-auth";

import UserContextMenu from "@/components/global/UserContextMenu";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  user: User;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const isSuperAdmin = user.role === "SUPERADMIN";
  const isAdmin = user.role === "ADMIN" || isSuperAdmin;

  // filter items based on user role
  const filteredItems = dashboardNavItems.filter((item) => {
    if (item.superAdminOnly && !isSuperAdmin) return false;
    if (item.adminOnly && !isAdmin) return false;

    return true;
  });

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
    <header className="sticky top-0 z-40 w-full border-b bg-background/40 backdrop-blur-md">
      <div className="container flex h-16 items-center">
        {isMobile && (
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Toggle Menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-5/6 p-0">
              {open && <DashboardSidebar user={user} />}
            </SheetContent>
            <SheetTitle className="sr-only">Dashboard Menu</SheetTitle>
          </Sheet>
        )}

        <div className="hidden md:flex md:items-center md:gap-6 md:pl-6">
          {filteredItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={cn(
                "flex items-center text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href
                  ? "text-primary"
                  : "text-muted-foreground",
              )}
            >
              {item.title}
            </Link>
          ))}
        </div>

        <div className="ml-auto mr-5 flex items-center gap-2">
          <UserContextMenu sessionUser={user} />
        </div>
      </div>
    </header>
  );
}
