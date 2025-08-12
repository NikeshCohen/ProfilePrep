"use client";

import { useEffect, useState } from "react";

import { DashboardSidebar } from "@/app/dashboard/_components/layout/DashboardSidebar";
import { Menu } from "lucide-react";
import type { User } from "next-auth";

import { RoleSwitcher } from "@/components/global/RoleSwitcher";
import UserContextMenu from "@/components/global/UserContextMenu";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface DashboardHeaderProps {
  user: User;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const [open, setOpen] = useState(false);
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

        <div className="ml-auto mr-5 flex items-center gap-2">
          <RoleSwitcher />
          <UserContextMenu sessionUser={user} />
        </div>
      </div>
    </header>
  );
}
