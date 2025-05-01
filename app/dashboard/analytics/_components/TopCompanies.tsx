import { getTopCompanies } from "@/actions/analytics.actions";

import { ProgressBar } from "@/components/global/ProgressBar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export async function TopCompanies() {
  const topCompanies = await getTopCompanies();

  return (
    <Card className="bg-card/40">
      <CardHeader>
        <CardTitle>Top Companies by Document Generation</CardTitle>
        <CardDescription>
          Companies with the highest document generation volume
        </CardDescription>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
}
