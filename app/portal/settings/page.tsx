import { Metadata } from "next";

import { getRecruiterDocuments } from "@/actions/user.actions";
import { auth } from "@/auth";
import { BarChart3, Bell, FileText, Shield, User } from "lucide-react";

import { ProgressBar } from "@/components/global/ProgressBar";
import { GuidancePreferences } from "@/components/settings/GuidancePreferences";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Settings | Candidate Dashboard",
  description: "Manage your candidate profile and preferences",
};

export default async function CandidateSettingsPage() {
  const session = await auth();

  if (!session?.user) {
    return <div>Please log in to access settings.</div>;
  }

  const user = session.user;
  const isAdmin = user.role === "ADMIN" || user.role === "SUPERADMIN";
  const isCandidateAdmin = isAdmin && user.userType === "CANDIDATE";

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
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        {isCandidateAdmin ? (
          <p className="text-muted-foreground">
            Administrative settings and candidate preferences
          </p>
        ) : (
          <p className="text-muted-foreground">
            Manage your profile and preferences for CV analysis
          </p>
        )}
      </div>

      <div className="grid gap-6">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <CardTitle>Profile Information</CardTitle>
            </div>
            <CardDescription>
              Your basic profile information used for CV analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Full Name
                </label>
                <p className="text-sm">{user.name || "Not provided"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Email Address
                </label>
                <p className="text-sm">{user.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Account Type
                </label>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">
                    {user.userType === "CANDIDATE"
                      ? "Job Seeker"
                      : user.userType}
                  </Badge>
                  {user.isTestAccount && (
                    <Badge
                      variant="outline"
                      className="border-orange-600 text-orange-600"
                    >
                      Demo Account
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {user.company && (
              <div className="rounded-md bg-muted p-4">
                <h3 className="mb-2 font-medium">Organization Information</h3>
                <p className="text-sm text-muted-foreground">
                  You are a member of{" "}
                  <span className="font-medium">{user.company.name}</span>
                </p>
              </div>
            )}

            <Separator />
            <div className="flex justify-end">
              <Button variant="outline">Edit Profile</Button>
            </div>
          </CardContent>
        </Card>

        {/* Guidance Preferences */}
        <GuidancePreferences
          userType="CANDIDATE"
          currentPreferences={
            (user as { guidancePreferences?: Record<string, unknown> })
              .guidancePreferences
          }
        />

        {/* CV Analysis Preferences */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <CardTitle>CV Analysis Preferences</CardTitle>
            </div>
            <CardDescription>
              Customize how your CV is analyzed and scored
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">
                    ATS Optimization Focus
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Emphasize Applicant Tracking System compatibility
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">Industry Preferences</h4>
                  <p className="text-sm text-muted-foreground">
                    Set your target industries for tailored feedback
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Set Industries
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">Skills Tracking</h4>
                  <p className="text-sm text-muted-foreground">
                    Track specific skills and get targeted recommendations
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Manage Skills
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>
              Choose what notifications you want to receive
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">Analysis Complete</h4>
                  <p className="text-sm text-muted-foreground">
                    Get notified when CV analysis is complete
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Enabled
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">Improvement Tips</h4>
                  <p className="text-sm text-muted-foreground">
                    Weekly tips to improve your CV score
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Enabled
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">Job Match Alerts</h4>
                  <p className="text-sm text-muted-foreground">
                    Get notified about jobs matching your profile
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Document Limits */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <CardTitle>Document Limits</CardTitle>
            </div>
            <CardDescription>
              Your current month&apos;s document usage and limits (resets
              monthly)
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
                <h3 className="mb-2 font-medium">Organization Limits</h3>
                <p className="text-sm text-muted-foreground">
                  Your organization allows up to{" "}
                  <span className="font-medium">5</span> documents per user
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Progress Tracking */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <CardTitle>Progress Tracking</CardTitle>
            </div>
            <CardDescription>
              Monitor your CV improvement journey
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {user.isTestAccount ? "12" : "0"}
                </div>
                <p className="text-sm text-muted-foreground">CVs Analyzed</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {user.isTestAccount ? "85%" : "N/A"}
                </div>
                <p className="text-sm text-muted-foreground">Best Score</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {user.isTestAccount ? "+23%" : "N/A"}
                </div>
                <p className="text-sm text-muted-foreground">Improvement</p>
              </div>
            </div>
            <Separator />
            <div className="flex justify-center">
              <Button variant="outline">View Detailed Progress</Button>
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <CardTitle>Privacy & Security</CardTitle>
            </div>
            <CardDescription>
              Manage your privacy preferences and account security
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">Data Retention</h4>
                  <p className="text-sm text-muted-foreground">
                    How long we keep your CV data
                  </p>
                </div>
                <Badge variant="outline">90 days</Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">Delete Account</h4>
                  <p className="text-sm text-muted-foreground">
                    Permanently remove your account and data
                  </p>
                </div>
                <Button variant="destructive" size="sm">
                  Delete Account
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Admin-only settings for candidate organizations */}
        {isCandidateAdmin && (
          <>
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <CardTitle>Organization Administration</CardTitle>
                </div>
                <CardDescription>
                  Administrative controls for your candidate organization
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Default Document Limit
                    </label>
                    <p className="text-sm">5 documents per member</p>
                    <p className="text-xs text-muted-foreground">
                      Default document limit for organization members
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Organization Members
                    </label>
                    <p className="text-sm">0 active members</p>
                    <p className="text-xs text-muted-foreground">
                      Total members in your organization
                    </p>
                  </div>
                </div>

                <div className="rounded-md bg-muted p-4">
                  <h3 className="mb-2 font-medium">Administrative Role</h3>
                  <p className="text-sm text-muted-foreground">
                    You have {user.role.toLowerCase()} permissions for candidate
                    organization management.
                  </p>
                  {user.role === "SUPERADMIN" && (
                    <p className="mt-1 text-sm font-medium text-orange-600">
                      Super Admin: Full system access across all organizations
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <CardTitle>Organization Management</CardTitle>
                </div>
                <CardDescription>
                  Quick access to organization management functions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Button variant="outline" asChild>
                    <a href="/portal/organization/members">Manage Members</a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="/portal/organization/analytics">View Analytics</a>
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">
                      Member Notifications
                    </label>
                    <p className="text-sm text-muted-foreground">
                      Send notifications to organization members
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
