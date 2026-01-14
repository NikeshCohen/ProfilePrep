import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { CandidateLayout } from "@/app/portal/_components/layout/CandidateLayout";
import { auth } from "@/auth";
import { ErrorBoundary } from "react-error-boundary";

import FallBack from "@/components/global/Fallback";
import { isRecruiter, isCandidate, isTester } from "@/lib/roleUtils";

export const metadata: Metadata = {
  title: "Candidate Portal | ProfilePrep",
  description: "AI-powered CV analysis for job seekers",
};

export default async function PortalLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Only allow candidates and testers
  if (isRecruiter(session.user)) {
    redirect("/recruiter"); // Recruiters should go to their dashboard
  }

  if (
    !isCandidate(session.user) &&
    !isTester(session.user)
  ) {
    redirect("/app"); // Other types go to main app
  }

  return (
    <ErrorBoundary FallbackComponent={FallBack}>
      <CandidateLayout user={session.user}>{children}</CandidateLayout>
    </ErrorBoundary>
  );
}
