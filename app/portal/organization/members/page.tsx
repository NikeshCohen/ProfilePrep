import { Metadata } from "next";

import MemberList from "@/app/portal/organization/members/_components/MemberList";
import MemberManagement from "@/app/portal/organization/members/_components/MemberManagement";

import { Card, CardContent } from "@/components/ui/card";

import { requireAuth } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Organization Members | Candidate Dashboard",
  description: "Manage members in your candidate organization",
};

export default async function OrganizationMembersPage() {
  const { user } = await requireAuth("/portal/organization/members");

  // Check if user has admin permissions for candidate organization
  const isAuthorized =
    (user.role === "ADMIN" || user.role === "SUPERADMIN") &&
    user.userType === "CANDIDATE";

  if (!isAuthorized) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold">Access Denied</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                You need admin permissions to access organization management.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Organization Members
          </h1>
          <p className="text-muted-foreground">
            Manage members in {user.company?.name || "your organization"}
          </p>
        </div>
        <MemberManagement sessionUser={user} />
      </div>

      <MemberList sessionUser={user} />
    </div>
  );
}
