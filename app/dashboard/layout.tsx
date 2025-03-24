import { DashboardLayout } from "@/app/dashboard/_components/DashboardLayout";
import { ErrorBoundary } from "react-error-boundary";

import FallBack from "@/components/global/Fallback";

import { requireAuth } from "@/lib/utils";

async function layout({ children }: { children: React.ReactNode }) {
  const { user } = await requireAuth("/dashboard");

  return (
    <ErrorBoundary FallbackComponent={FallBack}>
      <DashboardLayout user={user}>{children}</DashboardLayout>
    </ErrorBoundary>
  );
}

export default layout;
