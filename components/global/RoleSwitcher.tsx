"use client";

import { useState } from "react";

import {
  BriefcaseIcon,
  ChevronDownIcon,
  FlaskConicalIcon,
  TargetIcon,
  UserIcon,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { toast } from "react-hot-toast";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { isCandidate, isRecruiter } from "@/lib/roleUtils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function RoleSwitcher() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  if (!session?.user?.isTestAccount) {
    return null;
  }

  const currentUserType = session.user.userType;

  const handleRoleSwitch = async (newRole: "RECRUITER" | "CANDIDATE") => {
    if (currentUserType === newRole) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/user/switch-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userType: newRole }),
      });

      if (!response.ok) {
        throw new Error("Failed to switch role");
      }

      const data = await response.json();

      // Store the target credentials and redirect URL in sessionStorage
      sessionStorage.setItem(
        "demoSwitchTarget",
        JSON.stringify({
          email: data.targetEmail,
          redirectUrl: data.redirectUrl,
        }),
      );

      // Sign out and redirect to login with the target account
      toast.success(`Switching to ${newRole.toLowerCase()} mode...`);

      await signOut({
        callbackUrl: `/login?demo=${newRole.toLowerCase()}&email=${encodeURIComponent(data.targetEmail)}`,
      });
    } catch (error) {
      console.error("Role switch failed:", error);
      toast.error("Failed to switch role");
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleIcon = (role: string) => {
    if (isRecruiter({ userType: role })) {
      return <BriefcaseIcon className="h-4 w-4" />;
    }
    if (isCandidate({ userType: role })) {
      return <TargetIcon className="h-4 w-4" />;
    }
    return <UserIcon className="h-4 w-4" />;
  };

  const getRoleLabel = (role: string) => {
    if (isRecruiter({ userType: role })) {
      return "Recruiter";
    }
    if (isCandidate({ userType: role })) {
      return "Candidate";
    }
    return "User";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          disabled={isLoading}
        >
          <FlaskConicalIcon className="h-4 w-4" />
          <Badge variant="secondary" className="gap-1">
            {getRoleIcon(currentUserType)}
            {getRoleLabel(currentUserType)}
          </Badge>
          <ChevronDownIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Test Account - Switch Role</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => handleRoleSwitch("RECRUITER")}
          disabled={isRecruiter({ userType: currentUserType }) || isLoading}
          className="gap-2"
        >
          <BriefcaseIcon className="h-4 w-4" />
          Recruiter Mode
          {isRecruiter({ userType: currentUserType }) && (
            <Badge variant="outline" className="ml-auto">
              Current
            </Badge>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleRoleSwitch("CANDIDATE")}
          disabled={isCandidate({ userType: currentUserType }) || isLoading}
          className="gap-2"
        >
          <TargetIcon className="h-4 w-4" />
          Candidate Mode
          {isCandidate({ userType: currentUserType }) && (
            <Badge variant="outline" className="ml-auto">
              Current
            </Badge>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
