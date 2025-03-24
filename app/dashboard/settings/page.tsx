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

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Settings</h1>

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
      </div>

      <footer className="flex justify-end text-end">
        <ThemeToggle />
      </footer>
    </div>
  );
}
