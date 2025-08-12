import { Metadata } from "next";

import { getRecruiterDocuments } from "@/actions/user.actions";
import {
  BarChart3,
  Bell,
  Building2,
  FileText,
  Shield,
  User,
} from "lucide-react";

import { ProgressBar } from "@/components/global/ProgressBar";
import ThemeToggle from "@/components/global/ThemeToggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

import { requireAuth } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Settings | Recruiter Dashboard",
  description: "Manage your recruiter profile and company settings",
};

export default async function RecruiterSettingsPage() {
  const { user } = await requireAuth("/recruiter/settings");
  const isAdmin = user.role === "ADMIN" || user.role === "SUPERADMIN";
  const isRecruiterAdmin = isAdmin && user.userType === "RECRUITER";

  // Fetch actual documents count
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        {isRecruiterAdmin ? (
          <p className="text-muted-foreground">
            Administrative settings and recruiter preferences
          </p>
        ) : (
          <p className="text-muted-foreground">
            Manage your recruiter profile and preferences
          </p>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Information */}
        <Card className="bg-card/40">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <CardTitle>Profile Information</CardTitle>
            </div>
            <CardDescription>
              Your recruiter account details and preferences
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
                    {user.role === "USER" ? "Recruiter" : user.role}
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
                <div className="mb-2 flex items-center space-x-2">
                  <Building2 className="h-4 w-4" />
                  <h3 className="font-medium">Company Information</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  You are affiliated with{" "}
                  <span className="font-medium">{user.company.name}</span>
                  {isRecruiterAdmin && " (Administrator)"}
                </p>
              </div>
            )}

            <Separator />
            <div className="flex justify-end">
              <Button variant="outline">Edit Profile</Button>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="bg-card/40">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <CardTitle>Notification Settings</CardTitle>
            </div>
            <CardDescription>
              Configure how you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">Document Processing</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when document generation is complete
                </p>
              </div>
              <Switch id="email-notifications" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="client-updates">Client Updates</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications about client document status
                </p>
              </div>
              <Switch id="client-updates" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="marketing-emails">Product Updates</Label>
                <p className="text-sm text-muted-foreground">
                  Get emails about new features and improvements
                </p>
              </div>
              <Switch id="marketing-emails" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save Preferences</Button>
          </CardFooter>
        </Card>
      </div>

      {/* Document Usage Progress */}
      <Card className="bg-card/40">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <CardTitle>Document Usage</CardTitle>
          </div>
          <CardDescription>
            Your current month&apos;s document generation usage and limits
            (resets monthly)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ProgressBar
            current={actualDocsCount}
            total={user.allowedDocs || 5}
            showText={true}
            description={`${(user.allowedDocs || 5) - actualDocsCount} documents remaining in your plan`}
          />

          {user.company && (
            <div className="rounded-md bg-muted p-4">
              <h3 className="mb-2 font-medium">Company Limits</h3>
              <p className="text-sm text-muted-foreground">
                Your account allows up to{" "}
                <span className="font-medium">{user.allowedDocs || 5}</span>{" "}
                documents
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Workflow Settings */}
      <Card className="bg-card/40">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <CardTitle>Workflow Preferences</CardTitle>
          </div>
          <CardDescription>
            Customize your document generation workflow
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">Auto-save Templates</h4>
                <p className="text-sm text-muted-foreground">
                  Automatically save custom templates for reuse
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">Client Branding</h4>
                <p className="text-sm text-muted-foreground">
                  Include company branding in generated documents
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">Quality Checks</h4>
                <p className="text-sm text-muted-foreground">
                  Run additional quality validation on documents
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button>Update Preferences</Button>
        </CardFooter>
      </Card>

      {/* Admin-only settings for recruiter companies */}
      {isRecruiterAdmin && (
        <>
          <Card className="border-primary/20 bg-card/40">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <CardTitle>Company Administration</CardTitle>
              </div>
              <CardDescription>
                Administrative controls for your recruitment company
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Default Document Limit
                  </label>
                  <p className="text-sm">
                    {user.allowedDocs || 5} documents per account
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Default document limit for company recruiters
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Company Recruiters
                  </label>
                  <p className="text-sm">0 active recruiters</p>
                  <p className="text-xs text-muted-foreground">
                    Total recruiters in your company
                  </p>
                </div>
              </div>

              <div className="rounded-md bg-muted p-4">
                <h3 className="mb-2 font-medium">Administrative Role</h3>
                <p className="text-sm text-muted-foreground">
                  You have {user.role.toLowerCase()} permissions for company
                  management.
                </p>
                {user.role === "SUPERADMIN" && (
                  <p className="mt-1 text-sm font-medium text-orange-600">
                    Super Admin: Full system access across all companies
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-card/40">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <CardTitle>Company Management</CardTitle>
              </div>
              <CardDescription>
                Quick access to company management functions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <Button variant="outline" asChild>
                  <a href="/recruiter/users">Manage Team</a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/recruiter/templates">Manage Templates</a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/recruiter/analytics">View Analytics</a>
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">
                    Team Notifications
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Send notifications to company recruiters
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

      {/* Theme Toggle */}
      <Card className="bg-card/40">
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>
            Customize the look and feel of your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium">Theme</h4>
              <p className="text-sm text-muted-foreground">
                Switch between light and dark themes
              </p>
            </div>
            <ThemeToggle />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
