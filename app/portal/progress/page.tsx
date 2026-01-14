import Link from "next/link";

import { getUserCVAnalyses } from "@/actions/cv.actions";
import {
  MinusIcon,
  PlusIcon,
  TrendingDownIcon,
  TrendingUpIcon,
} from "lucide-react";

import { EmptyState } from "@/components/global/EmptyState";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ProgressData {
  overallScore: {
    current: number;
    previous: number | null;
    change: number | null;
  };
  atsScore: {
    current: number;
    previous: number | null;
    change: number | null;
  };
  categoryScores: {
    toneScore: {
      current: number;
      previous: number | null;
      change: number | null;
    };
    contentScore: {
      current: number;
      previous: number | null;
      change: number | null;
    };
    structureScore: {
      current: number;
      previous: number | null;
      change: number | null;
    };
    skillsScore: {
      current: number;
      previous: number | null;
      change: number | null;
    };
    grammarScore: {
      current: number;
      previous: number | null;
      change: number | null;
    };
    keywordScore: {
      current: number;
      previous: number | null;
      change: number | null;
    };
  };
}

function getChangeIcon(change: number | null) {
  if (change === null || change === 0)
    return <MinusIcon className="h-4 w-4 text-muted-foreground" />;
  if (change > 0) return <TrendingUpIcon className="h-4 w-4 text-green-600" />;
  return <TrendingDownIcon className="h-4 w-4 text-red-600" />;
}

function getChangeColor(change: number | null) {
  if (change === null || change === 0) return "text-muted-foreground";
  if (change > 0) return "text-green-600";
  return "text-red-600";
}

function ProgressCard({
  title,
  current,
  previous,
  change,
}: {
  title: string;
  current: number;
  previous: number | null;
  change: number | null;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold">{current}</div>
          {change !== null && (
            <div
              className={`flex items-center gap-1 text-sm ${getChangeColor(change)}`}
            >
              {getChangeIcon(change)}
              {change > 0 ? "+" : ""}
              {change}
            </div>
          )}
        </div>
        <Progress value={current} className="w-full" />
        {previous !== null && (
          <div className="text-xs text-muted-foreground">
            Previous: {previous}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default async function ProgressPage() {
  const result = await getUserCVAnalyses();

  if (!result.success || !result.analyses) {
    return (
      <div className="min-h-screen p-6">
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-bold">Progress Tracking</h1>
          <p className="text-muted-foreground">
            Track your CV improvement over time across all categories.
          </p>
        </div>
        <EmptyState
          message={
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Unable to load progress data</h3>
                <p className="text-sm text-muted-foreground">
                  There was an error loading your progress data. Please try
                  again.
                </p>
              </div>
              <Button asChild>
                <Link href="/portal">Return to Dashboard</Link>
              </Button>
            </div>
          }
        />
      </div>
    );
  }

  const { analyses } = result;

  if (analyses.length === 0) {
    return (
      <div className="min-h-screen p-6">
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-bold">Progress Tracking</h1>
          <p className="text-muted-foreground">
            Track your CV improvement over time across all categories.
          </p>
        </div>
        <EmptyState
          message={
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">No progress data yet</h3>
                <p className="text-sm text-muted-foreground">
                  Upload at least one CV analysis to start tracking your
                  progress and improvements.
                </p>
              </div>
              <Button asChild>
                <Link href="/app">
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Analyze CV
                </Link>
              </Button>
            </div>
          }
        />
      </div>
    );
  }

  // Calculate progress data
  const sortedAnalyses = [...analyses].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const latest = sortedAnalyses[0];
  const previous = sortedAnalyses.length > 1 ? sortedAnalyses[1] : null;

  // We'll need to fetch full analysis data for detailed scores
  // For now, using basic scores from the list
  const progressData: Partial<ProgressData> = {
    overallScore: {
      current: latest.overallScore,
      previous: previous?.overallScore || null,
      change: previous ? latest.overallScore - previous.overallScore : null,
    },
    atsScore: {
      current: latest.atsScore,
      previous: previous?.atsScore || null,
      change: previous ? latest.atsScore - previous.atsScore : null,
    },
  };

  return (
    <div className="min-h-screen space-y-8 p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Progress Tracking</h1>
          <p className="text-muted-foreground">
            Track your CV improvement over time across all categories.
          </p>
        </div>
        <Button asChild>
          <Link href="/app">
            <PlusIcon className="mr-2 h-4 w-4" />
            New Analysis
          </Link>
        </Button>
      </div>

      {/* Overall Progress */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <ProgressCard
          title="Overall Score"
          current={progressData.overallScore!.current}
          previous={progressData.overallScore!.previous}
          change={progressData.overallScore!.change}
        />
        <ProgressCard
          title="ATS Compatibility"
          current={progressData.atsScore!.current}
          previous={progressData.atsScore!.previous}
          change={progressData.atsScore!.change}
        />
      </div>

      {/* Progress Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Progress Summary</CardTitle>
          <CardDescription>
            Your CV analysis history and improvements over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
              <div>
                <div className="font-medium">Total Analyses</div>
                <div className="text-sm text-muted-foreground">
                  {analyses.length} CV versions analyzed
                </div>
              </div>
              <div className="text-2xl font-bold">{analyses.length}</div>
            </div>

            {analyses.length >= 2 && (
              <div className="space-y-4">
                <h3 className="font-semibold">Recent Improvements</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {progressData.overallScore!.change !== null && (
                    <div className="flex items-center justify-between rounded-lg bg-muted/30 p-3">
                      <div className="flex items-center gap-2">
                        {getChangeIcon(progressData.overallScore!.change)}
                        <span className="font-medium">Overall Score</span>
                      </div>
                      <div
                        className={`font-bold ${getChangeColor(progressData.overallScore!.change)}`}
                      >
                        {progressData.overallScore!.change > 0 ? "+" : ""}
                        {progressData.overallScore!.change}
                      </div>
                    </div>
                  )}
                  {progressData.atsScore!.change !== null && (
                    <div className="flex items-center justify-between rounded-lg bg-muted/30 p-3">
                      <div className="flex items-center gap-2">
                        {getChangeIcon(progressData.atsScore!.change)}
                        <span className="font-medium">ATS Score</span>
                      </div>
                      <div
                        className={`font-bold ${getChangeColor(progressData.atsScore!.change)}`}
                      >
                        {progressData.atsScore!.change > 0 ? "+" : ""}
                        {progressData.atsScore!.change}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <h3 className="font-semibold">Analysis History</h3>
              <div className="space-y-2">
                {sortedAnalyses.slice(0, 5).map((analysis) => (
                  <div
                    key={analysis.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="space-y-1">
                      <div className="font-medium">{analysis.fileName}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(analysis.createdAt).toLocaleDateString()} •{" "}
                        {analysis.jobTitle}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{analysis.overallScore}</div>
                      <div className="text-xs text-muted-foreground">
                        ATS: {analysis.atsScore}
                      </div>
                    </div>
                  </div>
                ))}
                {analyses.length > 5 && (
                  <div className="pt-2 text-center">
                    <Button variant="outline" asChild>
                      <Link href="/portal/analyses">View All Analyses</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips for Improvement */}
      <Card>
        <CardHeader>
          <CardTitle>Improvement Tips</CardTitle>
          <CardDescription>
            General recommendations to enhance your CV performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h4 className="font-medium">Consistency is Key</h4>
                <p className="text-sm text-muted-foreground">
                  Regular analysis helps track improvements and maintain quality
                  across different job applications.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Target Specific Roles</h4>
                <p className="text-sm text-muted-foreground">
                  Customize your CV for each application by including relevant
                  job descriptions in your analysis.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Focus on ATS Scores</h4>
                <p className="text-sm text-muted-foreground">
                  High ATS compatibility increases your chances of passing
                  initial screening filters.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Implement Feedback</h4>
                <p className="text-sm text-muted-foreground">
                  Apply the specific recommendations from each analysis to see
                  measurable improvements.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
