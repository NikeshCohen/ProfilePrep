"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

import { Button } from "@/components/ui/button";

const ClientConfetti = dynamic(() => import("./OnboardingConfetti"), {
  ssr: false,
});

export function OnboardingBackground() {
  return (
    <div className="flex flex-col items-center justify-center">
      <ClientConfetti />
      <h1 className="mb-6 space-y-1 text-center text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
        Welcome to Profile
        <span className="font-bold text-primary">Prep</span>
      </h1>

      <Button effect="shine" asChild>
        <Link href="/app">Continue To App</Link>
      </Button>
    </div>
  );
}
