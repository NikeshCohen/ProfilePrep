import Link from "next/link";

import {
  getCandidateStats,
  getCandidateUserStats,
} from "@/actions/stats.actions";
import { getRecruiterDocuments } from "@/actions/user.actions";
import {
  Building2,
  CheckCircleIcon,
  FileUpIcon,
  TargetIcon,
  TrendingUpIcon,
  Users,
} from "lucide-react";

import { ProgressBar } from "@/components/global/ProgressBar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { requireAuth } from "@/lib/utils";

export default async function CandidateDashboard() {
  const { user } = await requireAuth("/portal");
  const isAdmin = user.role === "ADMIN" || user.role === "SUPERADMIN";
  const isCandidateAdmin = isAdmin && user.userType === "CANDIDATE";

  // Get candidate statistics
  const personalStats = user.id ? await getCandidateUserStats(user.id) : null;
  const orgStats = isCandidateAdmin ? await getCandidateStats(user) : null;

  // Fetch actual documents for monthly usage calculation
  const documentsResult = await getRecruiterDocuments(user.id!);
  const allDocuments = documentsResult.success
    ? documentsResult.documents || []
    : [];

  // Calculate current month documents for monthly allocation
  const now = new Date();
  const thisMonthDocs = allDocuments.filter((doc) => {
    const docDate = new Date(doc.createdAt);
    return (
      docDate.getMonth() === now.getMonth() &&
      docDate.getFullYear() === now.getFullYear()
    );
  });

  const actualDocsCount = thisMonthDocs.length; // Use current month count for usage display
  const remainingThisMonth = user.allowedDocs - thisMonthDocs.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          {isCandidateAdmin ? (
            <p className="text-muted-foreground">
              Organization overview and CV analysis platform for candidates
            </p>
          ) : (
            <p className="text-muted-foreground">
              Analyze your CV and improve your job application success rate with
              AI-powered feedback
            </p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">Job Seeker</Badge>
          {isAdmin && (
            <Badge variant="outline" className="border-primary text-primary">
              Admin
            </Badge>
          )}
        </div>
      </div>

      {/* Organization Stats for Admins */}
      {isCandidateAdmin && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-card/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Organization Members
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Active members</p>
            </CardContent>
          </Card>

          <Card className="bg-card/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Analyses
              </CardTitle>
              <FileUpIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {orgStats?.totalAnalyses || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Organization-wide analyses
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Score
              </CardTitle>
              <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {orgStats?.averageScore ? `${orgStats.averageScore}%` : "-"}
              </div>
              <p className="text-xs text-muted-foreground">
                Organization average
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Recent Activity
              </CardTitle>
              <TargetIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {orgStats?.recentAnalyses || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Analyses this month
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Personal Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Analyses</CardTitle>
            <FileUpIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {personalStats?.totalAnalyses || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              CV analyses completed
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Best Score</CardTitle>
            <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {personalStats?.bestScore ? `${personalStats.bestScore}%` : "-"}
            </div>
            <p className="text-xs text-muted-foreground">
              Personal best CV rating
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Documents Remaining
            </CardTitle>
            <TargetIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{remainingThisMonth}</div>
            <p className="text-xs text-muted-foreground">
              Of {user.allowedDocs || 5} this month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <CheckCircleIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {personalStats?.averageScore
                ? `${personalStats.averageScore}%`
                : "-"}
            </div>
            <p className="text-xs text-muted-foreground">
              Your average CV rating
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Document Usage Progress */}
      <Card className="bg-card/40">
        <CardHeader>
          <CardTitle>Document Usage</CardTitle>
          <CardDescription>
            Your current document usage and limits
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ProgressBar
            current={actualDocsCount}
            total={user.allowedDocs || 5}
            showText={true}
            description={`${remainingThisMonth} documents remaining this month (resets monthly)`}
          />

          {user.company && (
            <div className="rounded-md bg-muted p-4">
              <div className="mb-2 flex items-center space-x-2">
                <Building2 className="h-4 w-4" />
                <h3 className="font-medium">Organization Information</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                You are a member of{" "}
                <span className="font-medium">{user.company.name}</span>
                {isCandidateAdmin && " (Administrator)"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-card/40">
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>
              Upload your CV to receive detailed feedback and improve your job
              application success rate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">1. Upload Your CV</h3>
                  <p className="text-sm text-muted-foreground">
                    Start by uploading your current CV in PDF format.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">2. Get AI Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    Our AI analyzes your CV for ATS compatibility and content
                    quality.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">3. Review Feedback</h3>
                  <p className="text-sm text-muted-foreground">
                    Get detailed feedback on structure, content, and keywords.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">4. Improve & Retest</h3>
                  <p className="text-sm text-muted-foreground">
                    Apply the recommendations and upload an improved version.
                  </p>
                </div>
              </div>
              <div className="pt-4">
                <Button asChild className="w-full">
                  <Link href="/app">
                    <FileUpIcon className="mr-2 h-4 w-4" />
                    Analyze Your CV
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Admin Quick Actions */}
        {isCandidateAdmin && (
          <Card className="border-primary/20 bg-card/40">
            <CardHeader>
              <CardTitle>Organization Management</CardTitle>
              <CardDescription>
                Quick access to organization administrative functions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <Button variant="outline" asChild>
                    <Link href="/portal/organization/members">
                      <Users className="mr-2 h-4 w-4" />
                      Manage Members
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/portal/organization/analytics">
                      <TrendingUpIcon className="mr-2 h-4 w-4" />
                      View Analytics
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/portal/settings">
                      <CheckCircleIcon className="mr-2 h-4 w-4" />
                      Organization Settings
                    </Link>
                  </Button>
                </div>

                <div className="rounded-md border border-primary/20 bg-primary/10 p-3">
                  <p className="text-sm text-primary">
                    <strong>Admin Access:</strong> You can manage organization
                    members and view analytics.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
