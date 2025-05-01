import { getRecentActivity } from "@/actions/stats.actions";
import { AlertCircle, FileText } from "lucide-react";
import type { User } from "next-auth";

import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface RecentActivityProps {
  user: User;
  userId?: string;
}

export async function RecentActivity({ user, userId }: RecentActivityProps) {
  const recentActivity = await getRecentActivity(user, userId);
  const isSuperAdmin = user.role === "SUPERADMIN";

  return (
    <Card className="bg-card/40">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          {isSuperAdmin
            ? "The latest document generations across the platform"
            : "The latest document generations across your company"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {recentActivity.length > 0 ? (
          <div className="space-y-4">
            {recentActivity.map((doc) => (
              <div key={doc.id} className="flex items-center gap-4">
                <div className="rounded-full bg-primary/10 p-2 text-primary">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {doc.user.name || doc.user.email.split("@")[0]}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Generated &#34;{doc.documentTitle}&#34; for{" "}
                    {doc.candidateName}
                  </p>
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(doc.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Alert variant="default" className="border-muted bg-muted/50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {isSuperAdmin
                ? "No documents have been generated yet across the platform."
                : "No documents have been generated yet in your company."}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
