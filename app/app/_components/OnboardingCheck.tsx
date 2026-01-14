import { redirect } from "next/navigation";

import { auth } from "@/auth";
import prisma from "@/prisma/prisma";
import { shouldShowOnboarding } from "@/lib/roleUtils";

export async function OnboardingCheck({
  children,
}: {
  children: React.ReactNode;
}) {
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
    },
  });

  // If user should show onboarding, redirect to onboarding
  if (user && shouldShowOnboarding(user)) {
    redirect("/app/onboarding");
  }

  return <>{children}</>;
}
