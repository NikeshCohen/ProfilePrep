import { Suspense } from "react";

import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ActiveUsers } from "@/app/dashboard/analytics/_components/ActiveUsers";
import {
  ActiveUsersSkeleton,
  TemplateUsageSkeleton,
  TopCompaniesSkeleton,
} from "@/app/dashboard/analytics/_components/AnalyticsSkeletons";
import { TemplateUsage } from "@/app/dashboard/analytics/_components/TemplateUsage";
import { TopCompanies } from "@/app/dashboard/analytics/_components/TopCompanies";

import { requireAuth } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Analytics",
};

export default async function AnalyticsPage() {
  const { user } = await requireAuth("/dashboard/analytics");

  // only admin and superadmin can access analytics
  if (user.role !== "ADMIN" && user.role !== "SUPERADMIN") {
    redirect("/app");
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Suspense fallback={<TopCompaniesSkeleton />}>
          <TopCompanies user={user} />
        </Suspense>

        <Suspense fallback={<ActiveUsersSkeleton />}>
          <ActiveUsers user={user} />
        </Suspense>

        <Suspense fallback={<TemplateUsageSkeleton />}>
          <TemplateUsage user={user} />
        </Suspense>
      </div>
    </div>
  );
}
