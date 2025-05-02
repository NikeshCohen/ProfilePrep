"use client";

import { useTemplateUsageQuery } from "@/actions/queries/analytics.queries";
import { TemplateUsageSkeleton } from "@/app/dashboard/analytics/_components/AnalyticsSkeletons";
import type { User } from "next-auth";

import { EmptyState } from "@/components/global/EmptyState";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { isSuperAdmin } from "@/lib/roleUtils";

interface TemplateUsageProps {
  user: User;
}

export function TemplateUsage({ user }: TemplateUsageProps) {
  const { data: templateUsage, isLoading, error } = useTemplateUsageQuery(user);
  // const isSuperAdmin = user.role === "SUPERADMIN";
  const isSuperAdminUser = isSuperAdmin(user);

  if (isLoading) {
    return <TemplateUsageSkeleton />;
  }

  if (error) {
    return (
      <EmptyState
        message="Failed to load template usage data"
        variant="destructive"
      />
    );
  }

  return (
    <Card className="bg-card/40 md:col-span-2">
      <CardHeader>
        <CardTitle>Template Usage</CardTitle>
        <CardDescription>
          {isSuperAdminUser
            ? "Overview of template usage across the platform"
            : "Overview of template usage in your company"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {templateUsage && templateUsage.length > 0 ? (
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium">
                    Template Name
                  </th>
                  <th className="px-4 py-3 text-left font-medium">Company</th>
                  <th className="px-4 py-3 text-right font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {templateUsage.map((template) => (
                  <tr key={template.id} className="border-b">
                    <td className="px-4 py-3">{template.name}</td>
                    <td className="px-4 py-3">{template.company.name}</td>
                    <td className="px-4 py-3 text-right">
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            message={
              isSuperAdminUser
                ? "No templates have been created yet across the platform."
                : "No templates have been created yet in your company."
            }
          />
        )}
      </CardContent>
    </Card>
  );
}
