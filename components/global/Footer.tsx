"use client";

import { usePathname } from "next/navigation";

import InfoButton from "@/components/global/InfoButton";
import ThemeToggle from "@/components/global/ThemeToggle";

import Logo from "./Logo";

function Footer() {
  const pathname = usePathname();

  return (
    <footer className="ml-auto mr-auto flex max-w-[1600px] flex-col items-center justify-center space-y-4 border-t p-4 lg:flex-row lg:justify-between lg:space-y-0">
      <div className="flex items-center justify-center">
        <Logo />
      </div>

      <div className="flex gap-2">
        {pathname.includes("/app") && (
          <>
            <InfoButton />
          </>
        )}
        <ThemeToggle />
      </div>
    </footer>
  );
}

export default Footer;
