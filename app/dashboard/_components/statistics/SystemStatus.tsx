"use client";

import { useSystemStatsQuery } from "@/actions/queries/stats.queries";
import { StatusSkeleton } from "@/app/dashboard/_components/statistics/StatisticsSkeletons";
import type { User } from "next-auth";

import { EmptyState } from "@/components/global/EmptyState";
import { ProgressBar } from "@/components/global/ProgressBar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { isSuperAdmin } from "@/lib/roleUtils";

interface SystemStatusProps {
  user: User;
}

export function SystemStatus({ user }: SystemStatusProps) {
  const { data: stats, isLoading, error } = useSystemStatsQuery(user);
  const isSuperAdminUser = isSuperAdmin(user);

  if (isLoading) {
    return <StatusSkeleton />;
  }

  if (error) {
    return (
      <EmptyState
        message="Failed to load system status"
        variant="destructive"
      />
    );
  }

  const hasData = stats && (stats.totalDocs > 0 || stats.totalTemplates > 0);

  return (
    <Card className="bg-card/40">
      <CardHeader>
        <CardTitle>System Status</CardTitle>
        <CardDescription>
          {isSuperAdminUser
            ? "Current system performance and limits"
            : "Current company performance and limits"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>
                  {isSuperAdminUser ? "Document Storage" : "Company Documents"}
                </span>
                <span className="font-medium">{stats.totalDocs} documents</span>
              </div>
              <ProgressBar
                current={stats.totalDocs}
                total={stats.totalAllowedDocs}
                description={`${stats.totalAllowedDocs - stats.totalDocs} documents remaining until next tier`}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>
                  {isSuperAdminUser ? "Template Usage" : "Company Templates"}
                </span>
                <span className="font-medium">
                  {stats.totalTemplates} templates
                </span>
              </div>

              <ProgressBar
                current={stats.totalTemplates}
                total={stats.totalAllowedTemplates}
                description={`${stats.totalAllowedTemplates - stats.totalTemplates} templates remaining until next tier`}
              />
            </div>

            <div className="rounded-md bg-muted p-3">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-green-500 p-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                </div>
                <span className="text-sm">All systems operational</span>
              </div>
            </div>
          </div>
        ) : (
          <EmptyState
            message={
              isSuperAdminUser
                ? "No documents or templates have been created yet across the platform."
                : "No documents or templates have been created yet in your company."
            }
          />
        )}
      </CardContent>
    </Card>
  );
}
