import React from "react";

import Link from "next/link";

import {
  AppWindow,
  Briefcase,
  FileText,
  Files,
  MapPin,
  UsersIcon,
} from "lucide-react";
import { User } from "next-auth";

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
          <Link href="/app" className="flex">
            <AppWindow className="mr-2" /> <span>App</span>
          </Link>
        </DropdownMenuItem>
        {sessionUser.role === "ADMIN" ||
          (sessionUser.role === "SUPERADMIN" && (
            <DropdownMenuItem asChild>
              <Link href="/app/users" className="flex">
                <UsersIcon className="mr-2" /> Users
              </Link>
            </DropdownMenuItem>
          ))}
        <DropdownMenuItem asChild>
          <Link href="/app/cvs" className="flex">
            <FileText className="mr-2" /> My CVs
          </Link>
        </DropdownMenuItem>
        {sessionUser.role === "SUPERADMIN" && (
          <>
            <DropdownMenuItem asChild>
              <Link href="/app/cvs/all" className="flex">
                <Files className="mr-2" /> All CVs
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/app/companies" className="flex">
                <Briefcase className="mr-2" /> Companies
              </Link>
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuItem asChild>
          <Link href="/roadmap" className="flex">
            <MapPin className="mr-2" /> Roadmap
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserContextMenu;
