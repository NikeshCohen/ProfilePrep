import { getDashboardStats } from "@/actions/stats.actions";
import { StatisticsCard } from "@/app/dashboard/_components/StatisticsCard";
import { BarChart3, Briefcase, FileText, Users } from "lucide-react";

interface DashboardStatsProps {
  userId?: string;
}

export async function DashboardStats({ userId }: DashboardStatsProps) {
  const stats = await getDashboardStats(userId);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatisticsCard
        title="Total Users"
        value={stats.totalUsers}
        icon={<Users className="h-5 w-5" />}
      />
      <StatisticsCard
        title="Total Documents"
        value={stats.totalDocs}
        description={`${stats.recentDocs} created in the last 30 days`}
        icon={<FileText className="h-5 w-5" />}
        trend={{
          value: stats.docsTrend,
          isPositive: stats.docsTrend >= 0,
        }}
      />
      <StatisticsCard
        title="Avg. Docs per User"
        value={stats.avgDocsPerUser}
        icon={<BarChart3 className="h-5 w-5" />}
      />
      <StatisticsCard
        title="Companies"
        value={stats.totalCompanies}
        icon={<Briefcase className="h-5 w-5" />}
      />
    </div>
  );
}
