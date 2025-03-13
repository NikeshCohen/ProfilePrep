"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { handleLogout as logout } from "@/actions/auth.actions";
import {
  AppWindow,
  BookDashed,
  Briefcase,
  FileText,
  Files,
  LogOut,
  MapPin,
  UsersIcon,
} from "lucide-react";
import type { User } from "next-auth";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserContextMenuProps {
  sessionUser: User;
}

function UserContextMenu({ sessionUser }: UserContextMenuProps) {
  const router = useRouter();
  const pathname = usePathname();

  async function handleLogout() {
    await logout();
    if (pathname.includes("/app")) {
      router.push("/login");
    }
    router.refresh();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <Avatar>
          <AvatarImage
            src={sessionUser.image ?? "/default-avatar.png"}
            alt={sessionUser.name ?? ""}
          />
          <AvatarFallback>{sessionUser.name?.charAt(0)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <Link href="/app" className="flex items-center">
            <AppWindow className="mr-2 w-4 h-4" />
            <span>App</span>
          </Link>
        </DropdownMenuItem>

        {(sessionUser.role === "ADMIN" ||
          sessionUser.role === "SUPERADMIN") && (
          <DropdownMenuItem asChild>
            <Link href="/app/users" className="flex items-center">
              <UsersIcon className="mr-2 w-4 h-4" />
              <span>Users</span>
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem asChild>
          <Link href="/app/cvs" className="flex items-center">
            <FileText className="mr-2 w-4 h-4" />
            <span>My CVs</span>
          </Link>
        </DropdownMenuItem>

        {sessionUser.role === "SUPERADMIN" && (
          <>
            <DropdownMenuItem asChild>
              <Link href="/app/cvs/all" className="flex items-center">
                <Files className="mr-2 w-4 h-4" />
                <span>All CVs</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/app/companies" className="flex items-center">
                <Briefcase className="mr-2 w-4 h-4" />
                <span>Companies</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}

        {(sessionUser.role === "ADMIN" ||
          sessionUser.role === "SUPERADMIN") && (
          <DropdownMenuItem asChild>
            <Link href="/app/templates" className="flex items-center">
              <BookDashed className="mr-2 w-4 h-4" />
              <span>Templates</span>
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem asChild>
          <Link href="/roadmap" className="flex items-center">
            <MapPin className="mr-2 w-4 h-4" />
            <span>Roadmap</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleLogout} className="flex items-center">
          <LogOut className="mr-2 w-4 h-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserContextMenu;
