"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

import { Button } from "@/components/ui/button";

const ClientConfetti = dynamic(() => import("./OnboardingConfetti"), {
  ssr: false,
});

export function OnboardingBackground() {
  return (
    <div className="flex flex-col justify-center items-center">
      <ClientConfetti />
      <h1 className="space-y-1 mb-6 font-bold text-4xl sm:text-5xl md:text-6xl text-center tracking-tighter">
        Welcome to Profile
        <span className="font-bold text-primary">Prep</span>
      </h1>

      <p className="mx-auto mb-4 pb-2.5 max-w-[700px] text-muted-foreground text-center">
        Welcome to your journey of interview preparation! ProfilePrep helps you
        practice, track progress, and master your interview skills. Let&apos;s
        get started by setting up your personalized experience.
      </p>

      <Button effect="shine" asChild>
        <Link href="/app">Continue To App</Link>
      </Button>
    </div>
  );
}
