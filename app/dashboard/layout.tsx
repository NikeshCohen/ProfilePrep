import { redirect } from "next/navigation";

import { DashboardLayout } from "@/app/dashboard/_components/layout/DashboardLayout";
import { ErrorBoundary } from "react-error-boundary";

import FallBack from "@/components/global/Fallback";

import { requireAuth } from "@/lib/utils";
import { isAdmin, isCandidate, isRecruiter } from "@/lib/roleUtils";

async function layout({ children }: { children: React.ReactNode }) {
  const { user } = await requireAuth("/dashboard");

  // Redirect candidate users to their dashboard
  if (isCandidate(user)) {
    redirect("/portal");
  }

  // Redirect regular recruiters to main app unless they're admin
  if (isRecruiter(user) && !isAdmin(user)) {
    redirect("/app");
  }

  return (
    <ErrorBoundary FallbackComponent={FallBack}>
      <DashboardLayout user={user}>{children}</DashboardLayout>
    </ErrorBoundary>
  );
}

export default layout;
