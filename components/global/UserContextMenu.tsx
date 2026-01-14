"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { handleLogout as logout } from "@/actions/auth.actions";
import {
  Briefcase,
  Folder,
  LogOut,
  MapPin,
  RefreshCw,
  Shield,
  User,
} from "lucide-react";
import type { User as AuthUser } from "next-auth";
import { signIn } from "next-auth/react";
import { toast } from "react-hot-toast";
import { RiRobot3Line } from "react-icons/ri";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { isAdmin, isRecruiter, isCandidate, isTester } from "@/lib/roleUtils";

interface UserContextMenuProps {
  sessionUser: AuthUser;
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

  async function switchToAccount(
    email: string,
    password: string,
    name: string,
  ) {
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Failed to switch account");
      } else {
        toast.success(`Switched to ${name}`);
        router.refresh();
      }
    } catch {
      toast.error("Something went wrong");
    }
  }

  // Only show account switching for test accounts
  const isTestAccount = sessionUser.isTestAccount;
  const demoAccounts = [
    {
      email: "demo@profileprep.com",
      password: "Demo2024!",
      name: "Demo Recruiter",
      icon: Briefcase,
      description: "Recruiter Account",
    },
    {
      email: "admin.demo@profileprep.com",
      password: "Admin2024!",
      name: "Demo Admin",
      icon: Shield,
      description: "Admin Account",
    },
    {
      email: "candidate.demo@profileprep.com",
      password: "Candidate2024!",
      name: "Demo Candidate",
      icon: User,
      description: "Candidate Account",
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={sessionUser.image ?? "/user.jpg"}
            alt={sessionUser.name ?? ""}
          />
          <AvatarFallback className="text-xs">
            {sessionUser.name?.charAt(0) || sessionUser.email?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {sessionUser.name || "User"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {sessionUser.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* CV Generation for Recruiters / CV Analysis for Candidates */}
        {isRecruiter(sessionUser) && (
          <DropdownMenuItem asChild>
            <Link href="/app" className="flex items-center">
              <RiRobot3Line className="mr-2 h-4 w-4" />
              <span>CV Generation</span>
            </Link>
          </DropdownMenuItem>
        )}

        {isCandidate(sessionUser) && (
          <DropdownMenuItem asChild>
            <Link href="/app" className="flex items-center">
              <RiRobot3Line className="mr-2 h-4 w-4" />
              <span>CV Analysis</span>
            </Link>
          </DropdownMenuItem>
        )}

        {/* Candidate Portal - only for candidates */}
        {isCandidate(sessionUser) && (
          <DropdownMenuItem asChild>
            <Link href="/portal" className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              <span>Candidate Portal</span>
            </Link>
          </DropdownMenuItem>
        )}

        {/* For test accounts, show both options */}
        {isTester(sessionUser) && (
          <>
            <DropdownMenuItem asChild>
              <Link href="/app" className="flex items-center">
                <RiRobot3Line className="mr-2 h-4 w-4" />
                <span>CV Tools</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/portal" className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                <span>Candidate Portal</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}

        {/* Recruiter Dashboard - only for recruiters and test accounts (non-admin) */}
        {(isRecruiter(sessionUser) ||
          isTester(sessionUser)) &&
          !isAdmin(sessionUser) && (
            <DropdownMenuItem asChild>
              <Link href="/recruiter" className="flex items-center">
                <Briefcase className="mr-2 h-4 w-4" />
                <span>Recruiter Dashboard</span>
              </Link>
            </DropdownMenuItem>
          )}

        {/* Admin Dashboard - only for admins */}
        {isAdmin(sessionUser) && (
          <DropdownMenuItem asChild>
            <Link href="/dashboard" className="flex items-center">
              <Folder className="mr-2 h-4 w-4" />
              <span>Admin Dashboard</span>
            </Link>
          </DropdownMenuItem>
        )}

        {/* Roadmap - available to all users */}
        <DropdownMenuItem asChild>
          <Link href="/roadmap" className="flex items-center">
            <MapPin className="mr-2 h-4 w-4" />
            <span>Roadmap</span>
          </Link>
        </DropdownMenuItem>

        {/* Account switching for test accounts */}
        {isTestAccount && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              <div className="flex items-center">
                <RefreshCw className="mr-2 h-3 w-3" />
                Switch Demo Account
              </div>
            </DropdownMenuLabel>
            {demoAccounts
              .filter((account) => account.email !== sessionUser.email)
              .map((account) => {
                const Icon = account.icon;
                return (
                  <DropdownMenuItem
                    key={account.email}
                    onClick={() =>
                      switchToAccount(
                        account.email,
                        account.password,
                        account.name,
                      )
                    }
                    className="flex items-center text-xs"
                  >
                    <Icon className="mr-2 h-3 w-3" />
                    <div>
                      <div className="font-medium">{account.name}</div>
                      <div className="text-muted-foreground">
                        {account.description}
                      </div>
                    </div>
                  </DropdownMenuItem>
                );
              })}
          </>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="flex items-center">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserContextMenu;
