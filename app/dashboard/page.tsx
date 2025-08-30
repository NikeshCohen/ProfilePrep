import { Suspense } from "react";

import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { DashboardStats } from "@/app/dashboard/_components/statistics/DashboardStats";
import { RecentActivity } from "@/app/dashboard/_components/statistics/RecentActivity";
import {
  ActivitySkeleton,
  StatsSkeleton,
  StatusSkeleton,
} from "@/app/dashboard/_components/statistics/StatisticsSkeletons";
import { SystemStatus } from "@/app/dashboard/_components/statistics/SystemStatus";

import { requireAuth } from "@/lib/utils";
import { isRecruiter, isCandidate } from "@/lib/roleUtils";
import { isSuperAdmin, isAdmin } from "@/lib/roleUtils";

export const metadata: Metadata = {
  title: "Global Dashboard | SuperAdmin",
};

export default async function DashboardPage() {
  const { user } = await requireAuth("/dashboard");

  // Only SuperAdmins can access this page - redirect company admins to their specific dashboards
  if (!isSuperAdmin(user)) {
    if (isAdmin(user)) {
      if (isRecruiter(user)) {
        redirect("/recruiter");
      } else if (isCandidate(user)) {
        redirect("/portal");
      }
    } else {
      if (isRecruiter(user)) {
        redirect("/recruiter");
      } else if (isCandidate(user)) {
        redirect("/portal");
      } else {
        redirect("/app");
      }
    }
    redirect("/app");
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Global Dashboard</h1>

      {/* SuperAdmin-only view */}
      <Suspense fallback={<StatsSkeleton />}>
        <DashboardStats user={user} userId={undefined} />
      </Suspense>

      <div className="grid gap-4 md:grid-cols-2">
        <Suspense fallback={<ActivitySkeleton />}>
          <RecentActivity user={user} userId={undefined} />
        </Suspense>

        <Suspense fallback={<StatusSkeleton />}>
          <SystemStatus user={user} />
        </Suspense>
      </div>
    </div>
  );
}
