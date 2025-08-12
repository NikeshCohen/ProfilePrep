import { redirect } from "next/navigation";

import { DashboardLayout } from "@/app/dashboard/_components/layout/DashboardLayout";
import { ErrorBoundary } from "react-error-boundary";

import FallBack from "@/components/global/Fallback";

import { requireAuth } from "@/lib/utils";

async function layout({ children }: { children: React.ReactNode }) {
  const { user } = await requireAuth("/dashboard");

  // Redirect candidate users to their dashboard
  if (user.userType === "CANDIDATE") {
    redirect("/portal");
  }

  // Redirect regular recruiters to main app unless they're admin
  if (user.userType === "RECRUITER" && user.role === "USER") {
    redirect("/app");
  }

  return (
    <ErrorBoundary FallbackComponent={FallBack}>
      <DashboardLayout user={user}>{children}</DashboardLayout>
    </ErrorBoundary>
  );
}

export default layout;
