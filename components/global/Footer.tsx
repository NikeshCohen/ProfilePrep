"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Linkedin } from "lucide-react";
import { motion } from "motion/react";

import InfoButton from "@/components/global/InfoButton";
import Logo from "@/components/global/Logo";
import ThemeToggle from "@/components/global/ThemeToggle";

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

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            href="https://www.linkedin.com/company/profileprep"
            target="_blank"
            aria-label="AI Information"
            className="hover flex h-9 w-9 items-center justify-center rounded-full bg-input/50 transition-colors hover:text-primary"
          >
            <Linkedin className="h-4 w-4" />
            <span className="sr-only">LinkedIn</span>
          </Link>
        </motion.div>

        <ThemeToggle />
      </div>
    </footer>
  );
}

export default Footer;
