"use client";

import React from "react";

import Link from "next/link";

import { Briefcase, Users } from "lucide-react";
import { useSession } from "next-auth/react";

import Logo from "@/components/global/Logo";
import UserContextMenu from "@/components/global/UserContextMenu";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

import { cn } from "@/lib/utils";

interface LandingHeaderProps {
  isRecruiterView?: boolean;
  onViewToggle?: (value: boolean) => void;
}

function ViewToggle({
  isRecruiterView,
  onToggle,
}: {
  isRecruiterView: boolean;
  onToggle: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-2 rounded-full px-3 py-1.5 shadow-sm">
      {/* border border-gray-200 bg-white/90 dark:border-gray-700 dark:bg-gray-800/90 */}
      <div
        className={cn(
          "flex items-center gap-1.5 transition-opacity duration-300",
          /* !isRecruiterView ? "opacity-100" : "opacity-50", */
        )}
      >
        <Users
          className={cn(
            "h-3 w-3 transition-colors duration-300",
            !isRecruiterView ? "text-blue-600" : "text-gray-400",
          )}
        />
        {/*
        <span
          className={cn(
            "text-xs font-medium transition-colors duration-300",
            !isRecruiterView ? "text-blue-600" : "text-gray-400",
          )}
        >
          Candidates
        </span>
        */}
      </div>
      <Switch
        checked={isRecruiterView}
        onCheckedChange={(checked) => {
          console.log("Toggle clicked:", checked);
          onToggle(checked);
        }}
        className="scale-75 [&_[data-state=unchecked]]:bg-primary/70"
      />
      <div
        className={cn(
          "flex items-center gap-1.5 transition-opacity duration-300",
          isRecruiterView ? "opacity-100" : "opacity-50",
        )}
      >
        <Briefcase
          className={cn(
            "h-3 w-3 transition-colors duration-300",
            isRecruiterView ? "text-primary" : "text-gray-400",
          )}
        />
        {/*
        <span
          className={cn(
            "text-xs font-medium transition-colors duration-300",
            isRecruiterView ? "text-primary" : "text-gray-400",
          )}
        >
          Recruiters
        </span>
        */}
      </div>
    </div>
  );
}

export default function LandingHeader({
  isRecruiterView,
  onViewToggle,
}: LandingHeaderProps) {
  const { data: session } = useSession();

  return (
    <header className="fixed left-0 right-0 top-2 z-50 mx-auto max-w-[1600px]">
      <div className="flex items-center justify-between rounded-lg border border-border/40 bg-background/40 px-4 py-2 shadow-sm backdrop-blur-md">
        <Logo />

        <div className="flex items-center gap-4">
          {/* show toggle when not logged in */}
          {!session?.user && onViewToggle && (
            <ViewToggle
              isRecruiterView={isRecruiterView || false}
              onToggle={onViewToggle}
            />
          )}

          {session?.user ? (
            <UserContextMenu sessionUser={session.user} />
          ) : (
            <Button effect="shine" asChild>
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
