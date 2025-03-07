import React, { Suspense } from "react";

import Link from "next/link";

import getSession from "@/lib/getSession";

import { Button } from "../ui/button";
import Logo from "./Logo";
import UserContextMenu from "./UserContextMenu";

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
    <header className="top-5 right-0 left-0 z-50 fixed mx-auto max-w-[1600px]">
      <div className="flex justify-between items-center bg-background/40 shadow-sm backdrop-blur-md px-4 py-2 border border-border/40 rounded-lg">
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
    <header className="top-5 right-0 left-0 z-50 fixed mx-auto max-w-[1600px]">
      <div className="flex justify-between items-center bg-background/40 shadow-sm backdrop-blur-md px-4 py-2 border border-border/40 rounded-lg">
        <Logo />
        <ButtonSkeleton />
      </div>
    </header>
  );
}

function ButtonSkeleton() {
  return (
    <div className="bg-neutral-500 rounded-full w-10 h-10 animate-pulse" />
  );
}

export default Header;
