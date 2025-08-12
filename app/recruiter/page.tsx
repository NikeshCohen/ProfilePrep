import { Metadata } from "next";
import Link from "next/link";

import { getRecruiterDocuments } from "@/actions/user.actions";
import { auth } from "@/auth";
import { formatDistanceToNow } from "date-fns";
import {
  BarChart3,
  Building,
  FileText,
  Sparkles,
  Upload,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Recruiter Dashboard | ProfilePrep",
  description: "Manage your recruitment workflow with AI-powered CV processing",
};

export default async function RecruiterDashboard() {
  const session = await auth();

  if (!session?.user) {
    return <div>Please log in to access the recruiter dashboard.</div>;
  }

  const user = session.user;

  // Fetch actual documents for recent activity
  const documentsResult = await getRecruiterDocuments(user.id!);
  const allDocuments = documentsResult.success
    ? documentsResult.documents || []
    : [];
  const limitedDocs = allDocuments.slice(0, 3); // Show only last 3 documents

  // Calculate current month documents for monthly allocation
  const now = new Date();
  const thisMonthDocs = allDocuments.filter((doc) => {
    const docDate = new Date(doc.createdAt);
    return (
      docDate.getMonth() === now.getMonth() &&
      docDate.getFullYear() === now.getFullYear()
    );
  });

  const remainingThisMonth = user.allowedDocs - thisMonthDocs.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Recruiter Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome back, {user.name}! Manage your recruitment workflow and
          generate client-ready CVs.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Documents Created
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{thisMonthDocs.length}</div>
            <p className="text-xs text-muted-foreground">
              {remainingThisMonth} remaining this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Company</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {user.company?.name || "No Company"}
            </div>
            <p className="text-xs text-muted-foreground">Your organization</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Account Type</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">
                {user.role === "USER" ? "Recruiter" : user.role}
              </Badge>
              {user.isTestAccount && (
                <Badge
                  variant="outline"
                  className="border-orange-600 text-orange-600"
                >
                  Demo
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">Role permissions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {user.isTestAccount ? "94%" : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">Client satisfaction</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-primary/20 transition-colors hover:border-primary/40">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <CardTitle>Generate CV Documents</CardTitle>
            </div>
            <CardDescription>
              Upload candidate CVs and create professional client-ready
              documents with AI
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/app" className="flex items-center">
                <Upload className="mr-2 h-4 w-4" />
                Start CV Processing
                {/* <ArrowRight className="ml-2 h-4 w-4" /> */}
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-muted transition-colors hover:border-muted-foreground/40">
          <CardHeader>
            <CardTitle>Document Management</CardTitle>
            <CardDescription>
              View, manage, and download your generated CV documents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild className="w-full">
              <Link href="/recruiter/documents" className="flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                View All Documents
                {/* <ArrowRight className="ml-2 h-4 w-4" /> */}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Your latest document generations and activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          {limitedDocs.length > 0 ? (
            <div className="space-y-4">
              {limitedDocs.map((doc, index) => (
                <div key={doc.id} className="flex items-center space-x-4">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      index === 0
                        ? "bg-green-500"
                        : index === 1
                          ? "bg-blue-500"
                          : "bg-purple-500"
                    }`}
                  ></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      Generated CV for {doc.candidateName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(doc.createdAt), {
                        addSuffix: true,
                      })}{" "}
                      • {doc.company?.name || "Unknown Company"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : user.isTestAccount ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    Generated CV for John Smith
                  </p>
                  <p className="text-xs text-muted-foreground">
                    2 hours ago • TechCorp Solutions
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    Generated CV for Sarah Johnson
                  </p>
                  <p className="text-xs text-muted-foreground">
                    1 day ago • FinTech Solutions
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    Generated CV for Michael Chen
                  </p>
                  <p className="text-xs text-muted-foreground">
                    2 days ago • AI Innovations
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              <FileText className="mx-auto mb-4 h-12 w-12 opacity-50" />
              <p>No recent activity</p>
              <p className="text-sm">
                Start generating documents to see your activity here
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
