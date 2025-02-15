import Link from "next/link";

import { Github } from "lucide-react";

import ThemeToggle from "@/components/global/ThemeToggle";
import { Button } from "@/components/ui/button";

function Footer() {
  return (
    <footer className="ml-auto mr-auto flex max-w-[1800px] flex-col items-center justify-center space-y-4 border-t p-4 lg:flex-row lg:justify-between lg:space-y-0">
      <h1 className="text-xl font-bold tracking-wider">
        Profile<span className="text-primary">Prep</span>
      </h1>

      <div className="flex gap-2">
        <Button asChild variant="outline" className="h-9 rounded-full p-2.5">
          <Link
            href="https://github.com/NikeshCohen/ProfilePrep"
            target="_blank"
          >
            <Github size={16} />
          </Link>
        </Button>

        <ThemeToggle />
      </div>
    </footer>
  );
}

export default Footer;
