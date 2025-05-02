"use client";

import Link from "next/link";

import { useUserStatsQuery } from "@/actions/queries/stats.queries";
import { StatisticsCard } from "@/app/dashboard/_components/statistics/StatisticsCard";
import { UserStatsSkeleton } from "@/app/dashboard/_components/statistics/StatisticsSkeletons";
import { Briefcase, FileText } from "lucide-react";

import { EmptyState } from "@/components/global/EmptyState";
import { Button } from "@/components/ui/button";

interface UserStatsProps {
  userId?: string;
}

export function UserStats({ userId }: UserStatsProps) {
  const { data: stats, isLoading, error } = useUserStatsQuery(userId);

  if (isLoading) {
    return <UserStatsSkeleton />;
  }

  if (error || !userId) {
    return (
      <EmptyState
        message={
          !userId
            ? "User information not available"
            : "Failed to load user statistics"
        }
        variant={error ? "destructive" : "default"}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <StatisticsCard
          title="Your Documents"
          value={stats?.recentDocs ?? 0}
          description="Documents created in the last 30 days"
          icon={<FileText className="h-5 w-5" />}
        />
        <StatisticsCard
          title="Your Subscription"
          value={"Free Plan"}
          description="Upgrade to a premium plan"
          icon={<Briefcase className="h-5 w-5" />}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Button asChild className="w-full">
          <Link href="/dashboard/settings">View Limits</Link>
        </Button>

        <Button asChild className="w-full">
          <Link href="/pricing">Upgrade Plan</Link>
        </Button>
      </div>
    </div>
  );
}
