import Link from "next/link";

import { getUserStats } from "@/actions/stats.actions";
import { StatisticsCard } from "@/app/dashboard/_components/statistics/StatisticsCard";
import { Briefcase, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";

interface UserStatsProps {
  userId?: string;
}

export async function UserStats({ userId }: UserStatsProps) {
  if (!userId) {
    // fallback ui or empty state
    return (
      <div className="space-y-4">
        <div className="p-4 text-center">
          <p>User information not available</p>
        </div>
      </div>
    );
  }

  const stats = await getUserStats(userId);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <StatisticsCard
          title="Your Documents"
          value={stats.recentDocs}
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
