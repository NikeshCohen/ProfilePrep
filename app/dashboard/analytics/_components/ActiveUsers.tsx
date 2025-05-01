import { getActiveUsers } from "@/actions/analytics.actions";
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

interface ActiveUsersProps {
  user: User;
}

export async function ActiveUsers({ user }: ActiveUsersProps) {
  const activeUsers = await getActiveUsers(user);
  const isSuperAdmin = user.role === "SUPERADMIN";

  return (
    <Card className="bg-card/40">
      <CardHeader>
        <CardTitle>Most Active Users</CardTitle>
        <CardDescription>
          {isSuperAdmin
            ? "Users who have generated the most documents across the platform"
            : "Users who have generated the most documents in your company"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {activeUsers.length > 0 ? (
          <div className="space-y-4">
            {activeUsers.map((activeUser) => (
              <div key={activeUser.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">
                    {activeUser.name || activeUser.email.split("@")[0]}
                  </span>
                  <span>
                    {activeUser.createdDocs} / {activeUser.allowedDocs}
                  </span>
                </div>
                <ProgressBar
                  current={activeUser.createdDocs}
                  total={activeUser.allowedDocs}
                />
              </div>
            ))}
          </div>
        ) : (
          <Alert variant="default" className="border-muted bg-muted/50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {isSuperAdmin
                ? "No users have generated documents yet."
                : "No users in your company have generated documents yet."}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
