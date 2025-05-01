import { getSystemStats } from "@/actions/stats.actions";
import { AlertCircle } from "lucide-react";
import type { User } from "next-auth";

import { ProgressBar } from "@/components/global/ProgressBar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SystemStatusProps {
  user: User;
}

export async function SystemStatus({ user }: SystemStatusProps) {
  const stats = await getSystemStats(user);
  const isSuperAdmin = user.role === "SUPERADMIN";
  const hasData = stats.totalDocs > 0 || stats.totalTemplates > 0;

  return (
    <Card className="bg-card/40">
      <CardHeader>
        <CardTitle>System Status</CardTitle>
        <CardDescription>
          {isSuperAdmin
            ? "Current system performance and limits"
            : "Current company performance and limits"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>
                  {isSuperAdmin ? "Document Storage" : "Company Documents"}
                </span>
                <span className="font-medium">{stats.totalDocs} documents</span>
              </div>
              <ProgressBar
                current={stats.totalDocs}
                total={stats.totalAllowedDocs}
                description={`${stats.totalAllowedDocs - stats.totalDocs} documents remaining until next tier`}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>
                  {isSuperAdmin ? "Template Usage" : "Company Templates"}
                </span>
                <span className="font-medium">
                  {stats.totalTemplates} templates
                </span>
              </div>

              <ProgressBar
                current={stats.totalTemplates}
                total={stats.totalAllowedTemplates}
                description={`${stats.totalAllowedTemplates - stats.totalTemplates} templates remaining until next tier`}
              />
            </div>

            <div className="rounded-md bg-muted p-3">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-green-500 p-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                </div>
                <span className="text-sm">All systems operational</span>
              </div>
            </div>
          </div>
        ) : (
          <Alert variant="default" className="border-muted bg-muted/50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {isSuperAdmin
                ? "No documents or templates have been created yet across the platform."
                : "No documents or templates have been created yet in your company."}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
