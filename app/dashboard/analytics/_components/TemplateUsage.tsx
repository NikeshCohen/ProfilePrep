import { getTemplateUsage } from "@/actions/analytics.actions";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export async function TemplateUsage() {
  const templateUsage = await getTemplateUsage();

  return (
    <Card className="bg-card/40 md:col-span-2">
      <CardHeader>
        <CardTitle>Template Usage</CardTitle>
        <CardDescription>
          Overview of template usage across the platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium">
                  Template Name
                </th>
                <th className="px-4 py-3 text-left font-medium">Company</th>
                <th className="px-4 py-3 text-right font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {templateUsage.map((template) => (
                <tr key={template.id} className="border-b">
                  <td className="px-4 py-3">{template.name}</td>
                  <td className="px-4 py-3">{template.company.name}</td>
                  <td className="px-4 py-3 text-right">
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
