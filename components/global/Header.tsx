import React, { Suspense } from "react";

import Link from "next/link";

import { Briefcase, Users } from "lucide-react";

import Logo from "@/components/global/Logo";
import UserContextMenu from "@/components/global/UserContextMenu";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

import getSession from "@/lib/getSession";
import { cn } from "@/lib/utils";

interface HeaderProps {
  isRecruiterView?: boolean;
  onViewToggle?: (value: boolean) => void;
}

async function Header({ isRecruiterView, onViewToggle }: HeaderProps = {}) {
  return (
    <Suspense
      fallback={
        <HeaderSuspense
          isRecruiterView={isRecruiterView}
          onViewToggle={onViewToggle}
        />
      }
    >
      <HeaderContent
        isRecruiterView={isRecruiterView}
        onViewToggle={onViewToggle}
      />
    </Suspense>
  );
}

async function HeaderContent({ isRecruiterView, onViewToggle }: HeaderProps) {
  const session = await getSession();

  // If user is logged in and we have onViewToggle, set the view based on userType
  if (session?.user && onViewToggle) {
    const userBasedView = session.user.userType === "RECRUITER";
    if (isRecruiterView !== userBasedView) {
      // This would need to be handled client-side since this is server component
      // We'll pass the user type to the client component instead
    }
  }

  return (
    <header className="fixed left-0 right-0 top-2 z-50 mx-auto max-w-[1600px]">
      <div className="flex items-center justify-between rounded-lg border border-border/40 bg-background/40 px-4 py-2 shadow-sm backdrop-blur-md">
        <Logo />

        <div className="flex items-center gap-4">
          {/* Show toggle when not logged in */}
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

function HeaderSuspense({ isRecruiterView, onViewToggle }: HeaderProps) {
  return (
    <header className="fixed left-0 right-0 top-5 z-50 mx-auto max-w-[1600px]">
      <div className="flex items-center justify-between rounded-lg border border-border/40 bg-background/40 px-4 py-2 shadow-sm backdrop-blur-md">
        <Logo />
        <div className="flex items-center gap-4">
          {onViewToggle && (
            <ViewToggle
              isRecruiterView={isRecruiterView || false}
              onToggle={onViewToggle}
            />
          )}
          <ButtonSkeleton />
        </div>
      </div>
    </header>
  );
}

function ViewToggle({
  isRecruiterView,
  onToggle,
}: {
  isRecruiterView: boolean;
  onToggle: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white/90 px-3 py-1.5 shadow-sm dark:border-gray-700 dark:bg-gray-800/90">
      <div
        className={cn(
          "flex items-center gap-1.5 transition-opacity duration-300",
          !isRecruiterView ? "opacity-100" : "opacity-50",
        )}
      >
        <Users
          className={cn(
            "h-3 w-3 transition-colors duration-300",
            !isRecruiterView ? "text-blue-600" : "text-gray-400",
          )}
        />
        <span
          className={cn(
            "text-xs font-medium transition-colors duration-300",
            !isRecruiterView ? "text-blue-600" : "text-gray-400",
          )}
        >
          Candidates
        </span>
      </div>
      <Switch
        checked={isRecruiterView}
        onCheckedChange={onToggle}
        className="scale-75 data-[state=checked]:bg-primary"
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
        <span
          className={cn(
            "text-xs font-medium transition-colors duration-300",
            isRecruiterView ? "text-primary" : "text-gray-400",
          )}
        >
          Recruiters
        </span>
      </div>
    </div>
  );
}

function ButtonSkeleton() {
  return (
    <div className="h-10 w-10 animate-pulse rounded-full bg-neutral-500" />
  );
}

export default Header;
