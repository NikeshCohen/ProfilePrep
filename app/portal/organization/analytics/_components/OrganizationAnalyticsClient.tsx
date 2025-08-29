"use client";

import { useOrganizationAnalyticsQuery } from "@/actions/queries/admin.queries";
import { BarChart3, FileText, TrendingUp, Users } from "lucide-react";
import { User } from "next-auth";

import { Spinner } from "@/components/global/Spinner";
import AccessDeniedCard from "@/components/shared/AccessDeniedCard";
import EmptyState from "@/components/shared/EmptyState";
import ErrorCard from "@/components/shared/ErrorCard";
import StatsCard from "@/components/shared/StatsCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface OrganizationAnalyticsClientProps {
  user: User;
}

export default function OrganizationAnalyticsClient({
  user,
}: OrganizationAnalyticsClientProps) {
  // Check if user has admin permissions for candidate organization
  const isAuthorized =
    (user.role === "ADMIN" || user.role === "SUPERADMIN") &&
    user.userType === "CANDIDATE";

  const {
    data: analyticsData,
    isLoading,
    error,
  } = useOrganizationAnalyticsQuery(user);

  if (!isAuthorized) {
    return (
      <AccessDeniedCard message="You need admin permissions to access organization analytics." />
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="space-y-4 text-center">
          <Spinner />
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorCard message="Failed to load organization analytics. Please try again." />
    );
  }

  if (!analyticsData) {
    return null;
  }

  const { members: orgMembers, analyses: orgAnalyses, stats } = analyticsData;
  const { totalMembers, totalAnalyses, avgScore, usageRate } = stats;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Organization Analytics
        </h1>
        <p className="text-muted-foreground">
          Performance metrics and insights for {user.company?.name}
        </p>
      </div>

      <div className="grid gap-6">
        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Members"
            value={totalMembers}
            description="Active organization members"
            icon={Users}
          />
          <StatsCard
            title="Documents Analyzed"
            value={totalAnalyses}
            description="Total CV analyses completed"
            icon={FileText}
          />
          <StatsCard
            title="Average Score"
            value={avgScore > 0 ? avgScore : "N/A"}
            description="Average CV analysis score"
            icon={TrendingUp}
          />
          <StatsCard
            title="Usage Rate"
            value={`${usageRate}%`}
            description="Of document limit used"
            icon={BarChart3}
          />
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest actions by organization members
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orgAnalyses.slice(0, 5).length > 0 ? (
                orgAnalyses.slice(0, 5).map((analysis) => (
                  <div
                    key={analysis.id}
                    className="flex items-center space-x-4"
                  >
                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {analysis.user.name || analysis.user.email} analyzed
                        &quot;
                        {analysis.fileName}&quot;
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(analysis.createdAt).toLocaleDateString()} •
                        Score: {analysis.overallScore}/100
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState
                  icon={BarChart3}
                  title="No activity yet"
                  description="Organization activity will appear here once members start using the platform."
                  className="py-8"
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Member Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Member Performance</CardTitle>
            <CardDescription>
              Document usage and performance by member
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orgMembers.length > 0 ? (
                orgMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <h4 className="font-medium">
                        {member.name || member.email}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Joined {new Date(member.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {member.createdDocs}/{member.allowedDocs}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Documents used
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState
                  icon={Users}
                  title="No member data yet"
                  description="Member performance metrics will be displayed here as they use the platform."
                  className="py-8"
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Organization Limits */}
        <Card>
          <CardHeader>
            <CardTitle>Organization Limits</CardTitle>
            <CardDescription>
              Current usage against organization limits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Documents per Member</span>
                  <span>5</span>
                </div>
                <div className="h-2 w-full rounded-full bg-secondary">
                  <div className="h-2 w-0 rounded-full bg-primary"></div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Current limit per organization member
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Total Usage</span>
                  <span>0 / 5</span>
                </div>
                <div className="h-2 w-full rounded-full bg-secondary">
                  <div className="h-2 w-0 rounded-full bg-green-600"></div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Organization-wide document usage
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
