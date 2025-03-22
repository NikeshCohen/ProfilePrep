import React, { Suspense } from "react";

import Link from "next/link";

import Logo from "@/components/global/Logo";
import UserContextMenu from "@/components/global/UserContextMenu";
import { Button } from "@/components/ui/button";

import getSession from "@/lib/getSession";

async function Header() {
  return (
    <Suspense fallback={<HeaderSuspense />}>
      <HeaderContent />
    </Suspense>
  );
}

async function HeaderContent() {
  const session = await getSession();

  return (
    <header className="fixed left-0 right-0 top-2 z-50 mx-auto max-w-[1600px]">
      <div className="flex items-center justify-between rounded-lg border border-border/40 bg-background/40 px-4 py-2 shadow-sm backdrop-blur-md">
        <Logo />

        {session?.user ? (
          <UserContextMenu sessionUser={session.user} />
        ) : (
          <Button effect="shine" asChild>
            <Link href="/login">Login</Link>
          </Button>
        )}
      </div>
    </header>
  );
}

function HeaderSuspense() {
  return (
    <header className="fixed left-0 right-0 top-5 z-50 mx-auto max-w-[1600px]">
      <div className="flex items-center justify-between rounded-lg border border-border/40 bg-background/40 px-4 py-2 shadow-sm backdrop-blur-md">
        <Logo />
        <ButtonSkeleton />
      </div>
    </header>
  );
}

function ButtonSkeleton() {
  return (
    <div className="h-10 w-10 animate-pulse rounded-full bg-neutral-500" />
  );
}

export default Header;
