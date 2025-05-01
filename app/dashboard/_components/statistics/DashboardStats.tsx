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
      // show a message if no users
      description={totalUsers === 0 ? "No users registered yet" : undefined}
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

  // show a message if no documents
  const description =
    docsData.totalDocs === 0
      ? "No documents generated yet"
      : `${docsData.recentDocs} created in the last 30 days`;

  return (
    <StatisticsCard
      title={title}
      value={docsData.totalDocs}
      description={description}
      icon={<FileText className="h-5 w-5" />}
      trend={
        docsData.totalDocs > 0
          ? {
              value: docsData.docsTrend,
              isPositive: docsData.docsTrend >= 0,
            }
          : undefined
      }
    />
  );
}

async function AvgDocsCard({ user }: { user: User }) {
  const avgDocsPerUser = await getAvgDocsPerUser(user);
  const title = isSuperAdmin(user)
    ? "Avg. Docs per User"
    : "Avg. Docs per User";

  // show a message if average is 0
  const description =
    avgDocsPerUser === 0 ? "No documents generated yet" : undefined;

  return (
    <StatisticsCard
      title={title}
      value={avgDocsPerUser}
      icon={<BarChart3 className="h-5 w-5" />}
      description={description}
    />
  );
}

async function CompaniesCard({ user }: { user: User }) {
  const totalCompanies = await getTotalCompanies(user);
  const title = isSuperAdmin(user) ? "Companies" : "Your Company";

  const description =
    isSuperAdmin(user) && totalCompanies === 0
      ? "No companies registered yet"
      : undefined;

  return (
    <StatisticsCard
      title={title}
      value={totalCompanies}
      icon={<Briefcase className="h-5 w-5" />}
      description={description}
    />
  );
}
