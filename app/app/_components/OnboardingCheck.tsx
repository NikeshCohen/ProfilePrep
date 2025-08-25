import { redirect } from "next/navigation";

import { auth } from "@/auth";
import prisma from "@/prisma/prisma";

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

  // If user hasn't completed onboarding and isn't a tester/test account, redirect to onboarding
  if (
    !user?.onboardingCompleted &&
    user?.userType !== "TESTER" &&
    !user?.isTestAccount
  ) {
    redirect("/app/onboarding");
  }

  return <>{children}</>;
}
