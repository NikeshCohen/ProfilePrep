import Link from "next/link";

import { HomeIcon } from "@/components/icons/HomeIcon";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="px-4 text-center">
        <h1 className="mb-4 font-extrabold text-6xl">404</h1>
        <h2 className="mb-4 font-semibold text-muted-foreground text-2xl">
          Page Not Found
        </h2>
        <p className="mb-8 max-w-lg text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Button asChild>
          <Link href="/" className="flex justify-center items-center gap-">
            <HomeIcon size={16} />
          </Link>
        </Button>
      </div>
    </div>
  );
}
