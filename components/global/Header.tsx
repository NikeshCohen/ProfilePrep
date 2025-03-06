import React from "react";

import Link from "next/link";

import getSession from "@/lib/getSession";

import { Button } from "../ui/button";
import Logo from "./Logo";
import UserContextMenu from "./UserContextMenu";

async function Header() {
  const session = await getSession();

  return (
    <header className="fixed left-0 right-0 top-5 z-50 mx-auto max-w-[1600px]">
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

export default Header;
