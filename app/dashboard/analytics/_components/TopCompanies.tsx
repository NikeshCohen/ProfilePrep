import { getTopCompanies } from "@/actions/analytics.actions";
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

interface TopCompaniesProps {
  user: User;
}

export async function TopCompanies({ user }: TopCompaniesProps) {
  const topCompanies = await getTopCompanies(user);
  const isSuperAdmin = user.role === "SUPERADMIN";

  return (
    <Card className="bg-card/40">
      <CardHeader>
        <CardTitle>
          {isSuperAdmin
            ? "Top Companies by Document Generation"
            : "Top Users by Document Generation"}
        </CardTitle>
        <CardDescription>
          {isSuperAdmin
            ? "Companies with the highest document generation volume"
            : "Users in your company with the highest document generation volume"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {topCompanies.length > 0 ? (
          <div className="space-y-4">
            {topCompanies.map((company, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{company.name}</span>
                  <span>{company.count} documents</span>
                </div>
                <ProgressBar
                  current={company.count}
                  total={topCompanies[0]?.count || 1}
                />
              </div>
            ))}
          </div>
        ) : (
          <Alert variant="default" className="border-muted bg-muted/50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {isSuperAdmin
                ? "No companies have generated documents yet."
                : "No users in your company have generated documents yet."}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
