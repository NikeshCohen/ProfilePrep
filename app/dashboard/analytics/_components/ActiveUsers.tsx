import { getActiveUsers } from "@/actions/analytics.actions";

import { ProgressBar } from "@/components/global/ProgressBar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export async function ActiveUsers() {
  const activeUsers = await getActiveUsers();

  return (
    <Card className="bg-card/40">
      <CardHeader>
        <CardTitle>Most Active Users</CardTitle>
        <CardDescription>
          Users who have generated the most documents
        </CardDescription>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
}
