"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { handleLogout } from "@/actions/auth.actions";
import {
  AppWindow,
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
  // initialise router hook
  const router = useRouter();

  // define async click handler to call logout then refresh router
  async function handleClick() {
    await handleLogout();
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
            <AppWindow className="mr-2 h-4 w-4" />
            <span>App</span>
          </Link>
        </DropdownMenuItem>

        {(sessionUser.role === "ADMIN" ||
          sessionUser.role === "SUPERADMIN") && (
          <DropdownMenuItem asChild>
            <Link href="/app/users" className="flex items-center">
              <UsersIcon className="mr-2 h-4 w-4" />
              <span>Users</span>
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem asChild>
          <Link href="/app/cvs" className="flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            <span>My CVs</span>
          </Link>
        </DropdownMenuItem>

        {sessionUser.role === "SUPERADMIN" && (
          <>
            <DropdownMenuItem asChild>
              <Link href="/app/cvs/all" className="flex items-center">
                <Files className="mr-2 h-4 w-4" />
                <span>All CVs</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/app/companies" className="flex items-center">
                <Briefcase className="mr-2 h-4 w-4" />
                <span>Companies</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuItem asChild>
          <Link href="/roadmap" className="flex items-center">
            <MapPin className="mr-2 h-4 w-4" />
            <span>Roadmap</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleClick} className="flex items-center">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserContextMenu;
