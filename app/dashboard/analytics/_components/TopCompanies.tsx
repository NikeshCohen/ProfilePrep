"use client";

import { useTopCompaniesQuery } from "@/actions/queries/analytics.queries";
import { TopCompaniesSkeleton } from "@/app/dashboard/analytics/_components/AnalyticsSkeletons";
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

interface TopCompaniesProps {
  user: User;
}

export function TopCompanies({ user }: TopCompaniesProps) {
  const { data: topCompanies, isLoading, error } = useTopCompaniesQuery(user);
  const isSuperAdminUser = isSuperAdmin(user);

  if (isLoading) {
    return <TopCompaniesSkeleton />;
  }

  if (error) {
    return (
      <EmptyState
        message="Failed to load top companies data"
        variant="destructive"
      />
    );
  }

  return (
    <Card className="bg-card/40">
      <CardHeader>
        <CardTitle>
          {isSuperAdminUser
            ? "Top Companies by Document Generation"
            : "Top Users by Document Generation"}
        </CardTitle>
        <CardDescription>
          {isSuperAdminUser
            ? "Companies with the highest document generation volume"
            : "Users in your company with the highest document generation volume"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {topCompanies && topCompanies.length > 0 ? (
          <div className="space-y-4">
            {topCompanies.map((company, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{company.name}</span>
                  <span>{company.count} documents</span>
                </div>
                <ProgressBar
                  current={company.count}
                  total={topCompanies[0]?.count || 1}
                />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            message={
              isSuperAdminUser
                ? "No companies have generated documents yet."
                : "No users in your company have generated documents yet."
            }
          />
        )}
      </CardContent>
    </Card>
  );
}
