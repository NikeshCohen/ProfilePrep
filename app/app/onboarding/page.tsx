import { Suspense } from "react";

import { Metadata } from "next";

import { OnboardingClient } from "@/app/app/onboarding/_components/OnboardingClient";

export const metadata: Metadata = {
  title: "Onboarding",
};

export default function OnboardingPage() {
  return (
    <section className="layout flex min-h-[93vh] place-content-center place-items-center">
      <Suspense fallback={<OnboardingBackground />}>
        <OnboardingBackground />
        <OnboardingClient />
      </Suspense>
    </section>
  );
}

function OnboardingBackground() {
  return (
    <div>
      <h1 className="mb-6 space-y-1 text-center text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
        Welcome to Profile
        <span className="font-bold text-primary">Prep</span>
      </h1>

      <p className="mx-auto mb-4 max-w-[700px] pb-2.5 text-center text-muted-foreground">
        Let&apos;s get you onboarded!
      </p>
    </div>
  );
}
