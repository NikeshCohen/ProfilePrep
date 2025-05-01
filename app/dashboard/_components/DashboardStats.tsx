import { Suspense } from "react";

import {
  getAvgDocsPerUser,
  getDocsWithTrend,
  getTotalCompanies,
  getTotalUsers,
} from "@/actions/stats.actions";
import { StatCardSkeleton } from "@/app/dashboard/_components/DashboardLoading";
import { StatisticsCard } from "@/app/dashboard/_components/StatisticsCard";
import { BarChart3, Briefcase, FileText, Users } from "lucide-react";

interface DashboardStatsProps {
  userId?: string;
}

export function DashboardStats({ userId }: DashboardStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Suspense fallback={<StatCardSkeleton />}>
        <TotalUsersCard />
      </Suspense>

      <Suspense fallback={<StatCardSkeleton />}>
        <CompaniesCard />
      </Suspense>

      <Suspense fallback={<StatCardSkeleton />}>
        <AvgDocsCard />
      </Suspense>

      <Suspense fallback={<StatCardSkeleton />}>
        <DocumentsCard userId={userId} />
      </Suspense>
    </div>
  );
}

// internal comps
async function TotalUsersCard() {
  const totalUsers = await getTotalUsers();

  return (
    <StatisticsCard
      title="Total Users"
      value={totalUsers}
      icon={<Users className="h-5 w-5" />}
    />
  );
}

async function DocumentsCard({ userId }: { userId?: string }) {
  const docsData = await getDocsWithTrend(userId);

  return (
    <StatisticsCard
      title="Total Documents"
      value={docsData.totalDocs}
      description={`${docsData.recentDocs} created in the last 30 days`}
      icon={<FileText className="h-5 w-5" />}
      trend={{
        value: docsData.docsTrend,
        isPositive: docsData.docsTrend >= 0,
      }}
    />
  );
}

async function AvgDocsCard() {
  const avgDocsPerUser = await getAvgDocsPerUser();

  return (
    <StatisticsCard
      title="Avg. Docs per User"
      value={avgDocsPerUser}
      icon={<BarChart3 className="h-5 w-5" />}
    />
  );
}

async function CompaniesCard() {
  const totalCompanies = await getTotalCompanies();

  return (
    <StatisticsCard
      title="Companies"
      value={totalCompanies}
      icon={<Briefcase className="h-5 w-5" />}
    />
  );
}
