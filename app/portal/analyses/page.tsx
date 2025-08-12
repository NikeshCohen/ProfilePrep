import Link from "next/link";

import { getUserCVAnalyses } from "@/actions/cv.actions";
import {
  CalendarIcon,
  FileTextIcon,
  PlusIcon,
  TargetIcon,
  TrendingUpIcon,
} from "lucide-react";

import { EmptyState } from "@/components/global/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function getScoreColor(score: number) {
  if (score >= 90) return "bg-green-100 text-green-800 border-green-200";
  if (score >= 70) return "bg-blue-100 text-blue-800 border-blue-200";
  if (score >= 50) return "bg-yellow-100 text-yellow-800 border-yellow-200";
  if (score >= 30) return "bg-orange-100 text-orange-800 border-orange-200";
  return "bg-red-100 text-red-800 border-red-200";
}

function getScoreLabel(score: number) {
  if (score >= 90) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Average";
  if (score >= 30) return "Needs Work";
  return "Poor";
}

export default async function CVAnalysesPage() {
  const result = await getUserCVAnalyses();

  if (!result.success || !result.analyses) {
    return (
      <div className="min-h-screen p-6">
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-bold">My CV Analyses</h1>
          <p className="text-muted-foreground">
            View all your CV analyses and track your progress over time.
          </p>
        </div>
        <EmptyState
          message={
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Failed to load analyses</h3>
                <p className="text-sm text-muted-foreground">
                  There was an error loading your CV analyses. Please try again.
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
          <h1 className="text-3xl font-bold">My CV Analyses</h1>
          <p className="text-muted-foreground">
            View all your CV analyses and track your progress over time.
          </p>
        </div>
        <EmptyState
          message={
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">No analyses yet</h3>
                <p className="text-sm text-muted-foreground">
                  Upload your first CV to get started with AI-powered feedback
                  and ATS scoring.
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

  return (
    <div className="min-h-screen space-y-8 p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">My CV Analyses</h1>
          <p className="text-muted-foreground">
            View all your CV analyses and track your progress over time.
          </p>
        </div>
        <Button asChild>
          <Link href="/app">
            <PlusIcon className="mr-2 h-4 w-4" />
            New Analysis
          </Link>
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Analyses
            </CardTitle>
            <FileTextIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyses.length}</div>
            <p className="text-xs text-muted-foreground">
              CV analyses completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyses.length > 0
                ? Math.round(
                    analyses.reduce(
                      (acc: number, analysis) => acc + analysis.overallScore,
                      0,
                    ) / analyses.length,
                  )
                : 0}
            </div>
            <p className="text-xs text-muted-foreground">Overall rating</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Best ATS Score
            </CardTitle>
            <TargetIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyses.length > 0
                ? Math.max(...analyses.map((analysis) => analysis.atsScore))
                : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Highest ATS compatibility
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Analyses List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Recent Analyses</h2>
        <div className="grid grid-cols-1 gap-4">
          {analyses.map((analysis) => (
            <Card
              key={analysis.id}
              className="transition-shadow hover:shadow-md"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <FileTextIcon className="h-5 w-5 text-muted-foreground" />
                      {analysis.fileName}
                    </CardTitle>
                    <CardDescription className="space-y-1">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="h-3 w-3" />
                          {new Date(analysis.createdAt).toLocaleDateString()}
                        </span>
                        <Badge variant="secondary">{analysis.jobTitle}</Badge>
                        {analysis.companyName && (
                          <Badge variant="outline">
                            {analysis.companyName}
                          </Badge>
                        )}
                      </div>
                    </CardDescription>
                  </div>
                  <div className="space-y-2 text-right">
                    <div
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${getScoreColor(analysis.overallScore)}`}
                    >
                      {analysis.overallScore} -{" "}
                      {getScoreLabel(analysis.overallScore)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      ATS: {analysis.atsScore}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Click to view detailed feedback and improvement
                    recommendations
                  </div>
                  <Button asChild>
                    <Link href={`/portal/analysis/${analysis.id}`}>
                      View Details
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
