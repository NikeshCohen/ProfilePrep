import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { requireAuth } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Analytics | Recruiter Dashboard",
  description:
    "View your company's recruitment analytics and performance metrics",
};

async function RecruiterAnalyticsPage() {
  const { user } = await requireAuth("/recruiter/analytics");

  // Only allow recruiter admins (not candidates or superadmins)
  if (user.role !== "ADMIN" || user.userType !== "RECRUITER") {
    redirect("/recruiter");
  }

  // Ensure they have a company
  if (!user.company?.id) {
    redirect("/recruiter");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Company Analytics</h1>
        <p className="text-muted-foreground">
          Performance metrics and insights for {user.company.name}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Analytics content will be implemented later */}
        <div className="rounded-lg border p-6">
          <h3 className="font-semibold">Document Generation</h3>
          <p className="text-sm text-muted-foreground">
            Track CV generation activity across your team
          </p>
        </div>

        <div className="rounded-lg border p-6">
          <h3 className="font-semibold">Team Performance</h3>
          <p className="text-sm text-muted-foreground">
            Monitor individual recruiter performance metrics
          </p>
        </div>

        <div className="rounded-lg border p-6">
          <h3 className="font-semibold">Template Usage</h3>
          <p className="text-sm text-muted-foreground">
            See which templates are most popular with your team
          </p>
        </div>

        <div className="rounded-lg border p-6">
          <h3 className="font-semibold">Client Satisfaction</h3>
          <p className="text-sm text-muted-foreground">
            Track client feedback and satisfaction scores
          </p>
        </div>
      </div>
    </div>
  );
}

export default RecruiterAnalyticsPage;
