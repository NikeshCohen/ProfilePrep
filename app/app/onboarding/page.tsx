import { Suspense } from "react";

import { Metadata } from "next";

import { OnboardingBackground } from "@/app/app/onboarding/_components/Onboarding";
import { OnboardingClient } from "@/app/app/onboarding/_components/OnboardingClient";

export const metadata: Metadata = {
  title: "Onboarding",
};

export default function OnboardingPage() {
  return (
    <section className="flex place-content-center place-items-center min-h-[93vh] layout">
      <Suspense>
        <OnboardingBackground />
        <OnboardingClient />
      </Suspense>
    </section>
  );
}
