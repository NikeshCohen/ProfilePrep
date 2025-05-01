import { Suspense } from "react";

import {
  getAvgDocsPerUser,
  getDocsWithTrend,
  getTotalCompanies,
  getTotalUsers,
} from "@/actions/stats.actions";
import { StatCardSkeleton } from "@/app/dashboard/_components/DashboardLoading";
import { StatisticsCard } from "@/app/dashboard/_components/statistics/StatisticsCard";
import { BarChart3, Briefcase, FileText, Users } from "lucide-react";
import type { User } from "next-auth";

interface DashboardStatsProps {
  user: User;
  userId?: string;
}

// check if user is superadmin
export function isSuperAdmin(user: User) {
  return user.role === "SUPERADMIN";
}

export function DashboardStats({ user, userId }: DashboardStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Suspense fallback={<StatCardSkeleton />}>
        <TotalUsersCard user={user} />
      </Suspense>

      <Suspense fallback={<StatCardSkeleton />}>
        <CompaniesCard user={user} />
      </Suspense>

      <Suspense fallback={<StatCardSkeleton />}>
        <AvgDocsCard user={user} />
      </Suspense>

      <Suspense fallback={<StatCardSkeleton />}>
        <DocumentsCard user={user} userId={userId} />
      </Suspense>
    </div>
  );
}

// internal comps
async function TotalUsersCard({ user }: { user: User }) {
  const totalUsers = await getTotalUsers(user);
  const title = isSuperAdmin(user) ? "Total Users" : "Company Users";

  return (
    <StatisticsCard
      title={title}
      value={totalUsers}
      icon={<Users className="h-5 w-5" />}
    />
  );
}

async function DocumentsCard({
  user,
  userId,
}: {
  user: User;
  userId?: string;
}) {
  const docsData = await getDocsWithTrend(user, userId);
  const title = isSuperAdmin(user) ? "Total Documents" : "Company Documents";

  return (
    <StatisticsCard
      title={title}
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

async function AvgDocsCard({ user }: { user: User }) {
  const avgDocsPerUser = await getAvgDocsPerUser(user);
  const title = isSuperAdmin(user)
    ? "Avg. Docs per User"
    : "Avg. Docs per User";

  return (
    <StatisticsCard
      title={title}
      value={avgDocsPerUser}
      icon={<BarChart3 className="h-5 w-5" />}
    />
  );
}

async function CompaniesCard({ user }: { user: User }) {
  const totalCompanies = await getTotalCompanies(user);
  const title = isSuperAdmin(user) ? "Companies" : "Your Company";

  return (
    <StatisticsCard
      title={title}
      value={totalCompanies}
      icon={<Briefcase className="h-5 w-5" />}
    />
  );
}
