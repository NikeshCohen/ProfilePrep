import type { Metadata } from "next";

import { ProgressBar } from "@/components/global/ProgressBar";
import ThemeToggle from "@/components/global/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import { requireAuth } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Settings",
};

export default async function SettingsPage() {
  const { user } = await requireAuth("/dashboard/settings");
  const isAdmin = user.role === "ADMIN" || user.role === "SUPERADMIN";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        {isAdmin && (
          <p className="text-muted-foreground">
            Administrative settings and user preferences
          </p>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-card/40">
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>
              Manage your account settings and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue={user.name || ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" defaultValue={user.email ?? ""} disabled />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save Changes</Button>
          </CardFooter>
        </Card>

        <Card className="bg-card/40">
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>
              Configure how you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive email notifications for important updates
                </p>
              </div>
              <Switch id="email-notifications" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="marketing-emails">Marketing Emails</Label>
                <p className="text-sm text-muted-foreground">
                  Receive emails about new features and offers
                </p>
              </div>
              <Switch id="marketing-emails" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save Preferences</Button>
          </CardFooter>
        </Card>

        <Card className="bg-card/40 md:col-span-2">
          <CardHeader>
            <CardTitle>Account Limits</CardTitle>
            <CardDescription>
              Your current account usage and limits
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ProgressBar
              current={user.createdDocs}
              total={user.allowedDocs}
              showText={true}
              description={`${user.allowedDocs - user.createdDocs} documents remaining in your plan`}
            />

            {user.company && (
              <div className="rounded-md bg-muted p-4">
                <h3 className="mb-2 font-medium">Company Information</h3>
                <p className="text-sm text-muted-foreground">
                  You are a member of{" "}
                  <span className="font-medium">{user.company.name}</span>
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Admin-only settings */}
        {isAdmin && (
          <>
            <Card className="bg-card/40 md:col-span-2">
              <CardHeader>
                <CardTitle>System Administration</CardTitle>
                <CardDescription>
                  Administrative controls and system management
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="default-docs">Default Document Limit</Label>
                    <Input id="default-docs" type="number" defaultValue="10" />
                    <p className="text-xs text-muted-foreground">
                      Default document limit for new users
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-file-size">Max File Size (MB)</Label>
                    <Input id="max-file-size" type="number" defaultValue="10" />
                    <p className="text-xs text-muted-foreground">
                      Maximum upload file size
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable maintenance mode to prevent new registrations
                    </p>
                  </div>
                  <Switch id="maintenance-mode" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="analytics-tracking">
                      Analytics Tracking
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Enable detailed user analytics and usage tracking
                    </p>
                  </div>
                  <Switch id="analytics-tracking" defaultChecked />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Update System Settings</Button>
              </CardFooter>
            </Card>

            <Card className="bg-card/40 md:col-span-2">
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Quick access to user management functions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <Button variant="outline" asChild>
                    <a href="/dashboard/users">Manage Users</a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="/dashboard/companies">Manage Companies</a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="/dashboard/analytics">View Analytics</a>
                  </Button>
                </div>

                <div className="rounded-md bg-muted p-4">
                  <h3 className="mb-2 font-medium">Administrative Role</h3>
                  <p className="text-sm text-muted-foreground">
                    You have {user.role.toLowerCase()} permissions with access
                    to system management features.
                  </p>
                  {user.role === "SUPERADMIN" && (
                    <p className="mt-1 text-sm font-medium text-orange-600">
                      Super Admin: Full system access including company
                      management
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <footer className="flex justify-end text-end">
        <ThemeToggle />
      </footer>
    </div>
  );
}
