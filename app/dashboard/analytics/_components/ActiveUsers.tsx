"use client";

import { useActiveUsersQuery } from "@/actions/queries/analytics.queries";
import { ActiveUsersSkeleton } from "@/app/dashboard/analytics/_components/AnalyticsSkeletons";
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

interface ActiveUsersProps {
  user: User;
}

export function ActiveUsers({ user }: ActiveUsersProps) {
  const { data: activeUsers, isLoading, error } = useActiveUsersQuery(user);
  const isSuperAdminUser = isSuperAdmin(user);

  if (isLoading) {
    return <ActiveUsersSkeleton />;
  }

  if (error) {
    return (
      <EmptyState
        message="Failed to load active users data"
        variant="destructive"
      />
    );
  }

  return (
    <Card className="bg-card/40">
      <CardHeader>
        <CardTitle>Most Active Users</CardTitle>
        <CardDescription>
          {isSuperAdminUser
            ? "Users who have generated the most documents across the platform"
            : "Users who have generated the most documents in your company"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {activeUsers && activeUsers.length > 0 ? (
          <div className="space-y-4">
            {activeUsers.map((activeUser) => (
              <div key={activeUser.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">
                    {activeUser.name || activeUser.email.split("@")[0]}
                  </span>
                  <span>
                    {activeUser.createdDocs} / {activeUser.allowedDocs}
                  </span>
                </div>
                <ProgressBar
                  current={activeUser.createdDocs}
                  total={activeUser.allowedDocs}
                />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            message={
              isSuperAdminUser
                ? "No users have generated documents yet."
                : "No users in your company have generated documents yet."
            }
          />
        )}
      </CardContent>
    </Card>
  );
}
