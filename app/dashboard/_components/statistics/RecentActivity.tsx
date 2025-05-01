import { getRecentActivity } from "@/actions/stats.actions";
import { FileText } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface RecentActivityProps {
  userId?: string;
}

export async function RecentActivity({ userId }: RecentActivityProps) {
  const recentActivity = await getRecentActivity(userId);

  return (
    <Card className="bg-card/40">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          The latest document generations across the platform
        </CardDescription>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
}
