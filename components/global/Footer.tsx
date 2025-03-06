"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import InfoButton from "@/components/global/InfoButton";
import LogoutButton from "@/components/global/LogoutButton";
import ThemeToggle from "@/components/global/ThemeToggle";

function Footer() {
  const pathname = usePathname();

  return (
    <footer className="ml-auto mr-auto flex max-w-[1800px] flex-col items-center justify-center space-y-4 border-t p-4 lg:flex-row lg:justify-between lg:space-y-0">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/20">
        <Link href="/">
          <h1 className="text-xl font-bold tracking-wider">
            Profile<span className="text-primary">Prep</span>
          </h1>
        </Link>
      </div>

      <div className="flex gap-2">
        {pathname.includes("/app") && (
          <>
            <LogoutButton />
            <InfoButton />
          </>
        )}
        <ThemeToggle />
      </div>
    </footer>
  );
}

export default Footer;
