import { Suspense } from "react";

import type { Metadata } from "next";

import { DashboardStats } from "@/app/dashboard/_components/statistics/DashboardStats";
import { RecentActivity } from "@/app/dashboard/_components/statistics/RecentActivity";
import {
  ActivitySkeleton,
  StatsSkeleton,
  StatusSkeleton,
  UserStatsSkeleton,
} from "@/app/dashboard/_components/statistics/StatisticsSkeletons";
import { SystemStatus } from "@/app/dashboard/_components/statistics/SystemStatus";
import { UserStats } from "@/app/dashboard/_components/statistics/UserStats";

import { requireAuth } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const { user } = await requireAuth("/dashboard");

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

      {/* admin and superadmin views */}
      {(user.role === "ADMIN" || user.role === "SUPERADMIN") && (
        <>
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
        </>
      )}

      {/* regular user view */}
      {user.role === "USER" && (
        <Suspense fallback={<UserStatsSkeleton />}>
          <UserStats userId={user.id} />
        </Suspense>
      )}
    </div>
  );
}
