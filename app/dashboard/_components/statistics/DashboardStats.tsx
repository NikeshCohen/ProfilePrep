"use client";

import {
  useAvgDocsPerUserQuery,
  useDocsWithTrendQuery,
  useTotalCompaniesQuery,
  useTotalUsersQuery,
} from "@/actions/queries/stats.queries";
import { StatisticsCard } from "@/app/dashboard/_components/statistics/StatisticsCard";
import { StatCardSkeleton } from "@/app/dashboard/_components/statistics/StatisticsSkeletons";
import { BarChart3, Briefcase, FileText, Users } from "lucide-react";
import type { User } from "next-auth";

import { EmptyState } from "@/components/global/EmptyState";

import { isSuperAdmin } from "@/lib/roleUtils";

interface DashboardStatsProps {
  user: User;
  userId?: string;
}

export function DashboardStats({ user, userId }: DashboardStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <TotalUsersCard user={user} />
      <CompaniesCard user={user} />
      <AvgDocsCard user={user} />
      <DocumentsCard user={user} userId={userId} />
    </div>
  );
}

// internal comps
function TotalUsersCard({ user }: { user: User }) {
  const { data: totalUsers, isLoading, error } = useTotalUsersQuery(user);
  const title = isSuperAdmin(user) ? "Total Users" : "Company Users";

  if (isLoading) {
    return <StatCardSkeleton />;
  }

  if (error) {
    return (
      <EmptyState message="Failed to load user count" variant="destructive" />
    );
  }

  return (
    <StatisticsCard
      title={title}
      value={
        totalUsers ??
        // a null coalescing operator to provide a default value
        0
      }
      icon={<Users className="h-5 w-5" />}
      // show a message if no users
      description={totalUsers === 0 ? "No users registered yet" : undefined}
    />
  );
}

function DocumentsCard({ user, userId }: { user: User; userId?: string }) {
  const {
    data: docsData,
    isLoading,
    error,
  } = useDocsWithTrendQuery(user, userId);
  const title = isSuperAdmin(user) ? "Total Documents" : "Company Documents";

  if (isLoading) {
    return <StatCardSkeleton />;
  }

  if (error) {
    return (
      <EmptyState
        message="Failed to load document data"
        variant="destructive"
      />
    );
  }

  const totalDocs = docsData?.totalDocs ?? 0;
  const recentDocs = docsData?.recentDocs ?? 0;
  const docsTrend = docsData?.docsTrend ?? 0;

  // show a message if no documents
  const description =
    totalDocs === 0
      ? "No documents generated yet"
      : `${recentDocs} created in the last 30 days`;

  return (
    <StatisticsCard
      title={title}
      value={totalDocs}
      description={description}
      icon={<FileText className="h-5 w-5" />}
      trend={
        totalDocs > 0
          ? {
              value: docsTrend,
              isPositive: docsTrend >= 0,
            }
          : undefined
      }
    />
  );
}

function AvgDocsCard({ user }: { user: User }) {
  const {
    data: avgDocsPerUser,
    isLoading,
    error,
  } = useAvgDocsPerUserQuery(user);
  const title = isSuperAdmin(user)
    ? "Avg. Docs per User"
    : "Avg. Docs per User";

  if (isLoading) {
    return <StatCardSkeleton />;
  }

  if (error) {
    return (
      <EmptyState
        message="Failed to load average document data"
        variant="destructive"
      />
    );
  }

  // show a message if average is 0
  const description =
    (avgDocsPerUser ?? 0) === 0 ? "No documents generated yet" : undefined;

  return (
    <StatisticsCard
      title={title}
      value={avgDocsPerUser ?? 0}
      icon={<BarChart3 className="h-5 w-5" />}
      description={description}
    />
  );
}

function CompaniesCard({ user }: { user: User }) {
  const {
    data: totalCompanies,
    isLoading,
    error,
  } = useTotalCompaniesQuery(user);
  const title = isSuperAdmin(user) ? "Companies" : "Your Company";

  if (isLoading) {
    return <StatCardSkeleton />;
  }

  if (error) {
    return (
      <EmptyState message="Failed to load company data" variant="destructive" />
    );
  }

  const description =
    isSuperAdmin(user) && (totalCompanies ?? 0) === 0
      ? "No companies registered yet"
      : undefined;

  return (
    <StatisticsCard
      title={title}
      value={totalCompanies ?? 0}
      icon={<Briefcase className="h-5 w-5" />}
      description={description}
    />
  );
}
