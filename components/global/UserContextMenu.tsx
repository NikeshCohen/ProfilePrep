"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { handleLogout as logout } from "@/actions/auth.actions";
import { Folder, LogOut, MapPin } from "lucide-react";
import type { User } from "next-auth";
import { RiRobot3Line } from "react-icons/ri";

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
            <RiRobot3Line className="mr-2 h-4 w-4" />
            <span>App</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/dashboard" className="flex items-center">
            <Folder className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>

        {/* TODO: '/roadmap' is not a protected route so a decision needs to be made on
        whether it is visible to the general public or ONLY to users of this application */}
        <DropdownMenuItem asChild>
          <Link href="/roadmap" className="flex items-center">
            <MapPin className="mr-2 h-4 w-4" />
            <span>Roadmap</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleLogout} className="flex items-center">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserContextMenu;
