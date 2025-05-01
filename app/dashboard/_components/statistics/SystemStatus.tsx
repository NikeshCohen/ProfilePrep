import { getSystemStats } from "@/actions/stats.actions";

import { ProgressBar } from "@/components/global/ProgressBar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export async function SystemStatus() {
  const stats = await getSystemStats();

  return (
    <Card className="bg-card/40">
      <CardHeader>
        <CardTitle>System Status</CardTitle>
        <CardDescription>Current system performance and limits</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Document Storage</span>
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
              <span>Template Usage</span>
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
      </CardContent>
    </Card>
  );
}
