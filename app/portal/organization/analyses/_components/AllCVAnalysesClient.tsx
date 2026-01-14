"use client";

import { useOrganizationAnalysesQuery } from "@/actions/queries/admin.queries";
import { Calendar, Download, Eye, FileText, Target } from "lucide-react";
import { User } from "next-auth";

import { Spinner } from "@/components/global/Spinner";
import AccessDeniedCard from "@/components/shared/AccessDeniedCard";
import EmptyState from "@/components/shared/EmptyState";
import ErrorCard from "@/components/shared/ErrorCard";
import StatsCard from "@/components/shared/StatsCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { isCandidateAdmin } from "@/lib/roleUtils";

interface AllCVAnalysesClientProps {
  user: User;
}

export default function AllCVAnalysesClient({
  user,
}: AllCVAnalysesClientProps) {
  // Check if user has admin permissions for candidate organization
  const isAuthorized = isCandidateAdmin(user);

  const {
    data: analyses,
    isLoading,
    error,
  } = useOrganizationAnalysesQuery(user);

  if (!isAuthorized) {
    return (
      <AccessDeniedCard message="You need admin permissions to view all organization CV analyses." />
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="space-y-4 text-center">
          <Spinner />
          <p className="text-muted-foreground">Loading analyses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorCard message="Failed to load CV analyses. Please try again." />
    );
  }

  if (!analyses) {
    return null;
  }

  const thisMonthAnalyses = analyses.filter((analysis) => {
    const analysisDate = new Date(analysis.createdAt);
    const now = new Date();
    return (
      analysisDate.getMonth() === now.getMonth() &&
      analysisDate.getFullYear() === now.getFullYear()
    );
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">All CV Analyses</h1>
        <p className="text-muted-foreground">
          View and manage CV analyses from all {user.company?.name} members
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard
          title="Total Analyses"
          value={analyses.length}
          icon={Target}
        />
        <StatsCard
          title="This Month"
          value={thisMonthAnalyses.length}
          icon={Calendar}
        />
        <StatsCard
          title="Average Score"
          value={
            analyses.length > 0
              ? Math.round(
                  analyses.reduce((sum, a) => sum + a.overallScore, 0) /
                    analyses.length,
                )
              : "N/A"
          }
          icon={FileText}
        />
      </div>

      {/* Analyses List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent CV Analyses</CardTitle>
          <CardDescription>
            CV analyses completed by organization members
          </CardDescription>
        </CardHeader>
        <CardContent>
          {analyses.length > 0 ? (
            <div className="space-y-4">
              {analyses.map((analysis) => (
                <div
                  key={analysis.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center space-x-4">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Target className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{analysis.fileName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {analysis.jobTitle} at {analysis.companyName}
                      </p>
                      <div className="mt-1 flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          Score: {analysis.overallScore}/100
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {analysis.user.name || analysis.user.email}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(analysis.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Target}
              title="No analyses yet"
              description="Organization members haven't completed any CV analyses yet"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
