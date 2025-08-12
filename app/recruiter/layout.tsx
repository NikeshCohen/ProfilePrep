import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { DashboardLayout } from "@/app/dashboard/_components/layout/DashboardLayout";
import { auth } from "@/auth";
import { ErrorBoundary } from "react-error-boundary";

import FallBack from "@/components/global/Fallback";

export const metadata: Metadata = {
  title: "Recruiter Dashboard | ProfilePrep",
  description: "AI-powered CV generation for recruiters",
};

export default async function RecruiterLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Only allow recruiter user types (including admin recruiters)
  if (session.user.userType === "CANDIDATE") {
    redirect("/portal"); // Candidates should go to their portal
  }

  if (
    session.user.userType !== "RECRUITER" &&
    session.user.userType !== "TESTER"
  ) {
    redirect("/app"); // Other types go to main app
  }

  return (
    <ErrorBoundary FallbackComponent={FallBack}>
      <DashboardLayout user={session.user}>{children}</DashboardLayout>
    </ErrorBoundary>
  );
}
