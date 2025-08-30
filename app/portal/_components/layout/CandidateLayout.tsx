"use client";

import { ReactNode } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { candidateSidebarItems } from "@/constants/navigation";
import type { User as AuthUser } from "next-auth";

import Logo from "@/components/global/Logo";
import LogoutButton from "@/components/global/LogoutButton";
import { RoleSwitcher } from "@/components/global/RoleSwitcher";
import ThemeToggle from "@/components/global/ThemeToggle";
import UserContextMenu from "@/components/global/UserContextMenu";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { cn } from "@/lib/utils";
import { isAdmin, isSuperAdmin } from "@/lib/roleUtils";

interface CandidateLayoutProps {
  children: ReactNode;
  user: AuthUser;
}

function getFilteredNavItems(user: AuthUser) {
  return candidateSidebarItems.filter((item) => {
    // Filter admin-only items
    if (item.adminOnly && !isAdmin(user)) {
      return false;
    }

    // Filter superadmin-only items
    if (item.superAdminOnly && !isSuperAdmin(user)) {
      return false;
    }

    return true;
  });
}

export function CandidateLayout({ children, user }: CandidateLayoutProps) {
  const pathname = usePathname();
  const navItems = getFilteredNavItems(user);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div className="hidden border-r bg-gray-100/40 dark:bg-gray-800/40 lg:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          {/* Logo and Header */}
          <div className="flex h-[60px] items-center border-b px-6">
            <Link
              className="flex items-center gap-2 font-semibold"
              href="/portal"
            >
              <Logo size="sm" />
            </Link>
          </div>

          {/* User Info */}
          <div className="px-6 py-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Welcome back!</h3>
                <div className="flex items-center gap-2">
                  <UserContextMenu sessionUser={user} />
                </div>
              </div>

              <p className="truncate text-xs text-muted-foreground">
                {user?.name || user?.email}
              </p>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  Job Seeker
                </Badge>
                {isAdmin(user) && (
                  <Badge
                    variant="outline"
                    className="border-primary text-xs text-primary"
                  >
                    Admin
                  </Badge>
                )}
                {user?.isTestAccount && (
                  <Badge
                    variant="outline"
                    className="border-orange-600 text-xs text-orange-600"
                  >
                    Demo
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Navigation */}
          <ScrollArea className="flex-1 px-3">
            <div className="space-y-1 p-2">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(item.href + "/");

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent hover:text-accent-foreground",
                      isActive
                        ? "border border-border bg-accent text-accent-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    {item.icon}
                    {item.title}
                    {isActive && (
                      <div className="ml-auto h-2 w-2 rounded-full bg-primary" />
                    )}
                  </Link>
                );
              })}
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="mt-auto space-y-2 p-4">
            <div className="flex items-center justify-between">
              <ThemeToggle />
              <LogoutButton />
            </div>
            <Separator />

            <div className="text-center text-xs text-muted-foreground">
              ProfilePrep Candidate Portal
            </div>

            {user?.isTestAccount && <RoleSwitcher />}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Mobile Header */}
        <header className="flex h-14 items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40 lg:hidden lg:h-[60px]">
          <Link className="lg:hidden" href="/portal">
            <Logo size="sm" />
          </Link>
          <div className="flex-1" />
          {user?.isTestAccount && <RoleSwitcher />}
          <ThemeToggle />
          <LogoutButton />
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
