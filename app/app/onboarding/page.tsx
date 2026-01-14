import { Suspense } from "react";

import { Metadata } from "next";
import { redirect } from "next/navigation";

import EnhancedOnboarding from "@/app/app/onboarding/_components/EnhancedOnboarding";
import { OnboardingClient } from "@/app/app/onboarding/_components/OnboardingClient";
import { auth } from "@/auth";
import prisma from "@/prisma/prisma";

import { isCandidate, isRecruiter } from "@/lib/roleUtils";

export const metadata: Metadata = {
  title: "Onboarding",
};

export default async function OnboardingPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/api/auth/signin");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      onboardingCompleted: true,
      userType: true,
      isTestAccount: true,
      field: true,
    },
  });

  // If user doesn't exist, redirect to signin
  if (!user) {
    redirect("/api/auth/signin");
  }

  // Access Control: Only allow access if:
  // 1. Demo/test account (can always access for testing)
  // 2. Regular user with onboardingCompleted = false
  if (!user.isTestAccount && user.onboardingCompleted) {
    // User has already completed onboarding, redirect to their dashboard
    // determine dashboard route based on user type
    const dashboardRoute = isCandidate(user)
      ? "/portal"
      : isRecruiter(user)
        ? "/recruiter"
        : "/dashboard";

    redirect(dashboardRoute);
  }

  // Navigation Logic:
  // If user has a userType but no field, skip to enhanced onboarding
  // If user has no userType, start from regular onboarding
  const shouldSkipToEnhanced = user.userType && !user.field;

  return (
    <section className="layout flex min-h-[93vh] place-content-center place-items-center">
      <Suspense>
        {shouldSkipToEnhanced ? (
          <EnhancedOnboarding
            initialUserType={
              user.userType as "RECRUITER" | "CANDIDATE" | "TESTER"
            }
          />
        ) : (
          <OnboardingClient />
        )}
      </Suspense>
    </section>
  );
}
