import type { Metadata } from "next";
import { redirect } from "next/navigation";

import prisma from "@/prisma/prisma";

import { ProgressBar } from "@/components/global/ProgressBar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { requireAuth } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Analytics",
};

async function getAnalytics() {
  // monthly document generation counts for the last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyDocs = await prisma.generatedDocs.groupBy({
    by: ["companyId"],
    where: {
      createdAt: {
        gte: sixMonthsAgo,
      },
    },
    _count: {
      id: true,
    },
    orderBy: {
      _count: {
        id: "desc",
      },
    },
    take: 5,
  });

  // company names for the top companies
  const companyIds = monthlyDocs.map((doc) => doc.companyId);
  const companies = await prisma.company.findMany({
    where: {
      id: {
        in: companyIds,
      },
    },
    select: {
      id: true,
      name: true,
    },
  });

  // company names to the results
  const topCompanies = monthlyDocs.map((doc) => {
    const company = companies.find((c) => c.id === doc.companyId);
    return {
      name: company?.name || "Unknown",
      count: doc._count.id,
    };
  });

  // user activity - most active users
  const activeUsers = await prisma.user.findMany({
    orderBy: {
      createdDocs: "desc",
    },
    take: 5,
    select: {
      id: true,
      name: true,
      email: true,
      createdDocs: true,
      allowedDocs: true,
    },
  });

  // template usage
  const templateUsage = await prisma.template.findMany({
    select: {
      id: true,
      name: true,
      company: {
        select: {
          name: true,
        },
      },
    },
    take: 5,
  });

  return {
    topCompanies,
    activeUsers,
    templateUsage,
  };
}

export default async function AnalyticsPage() {
  const { user } = await requireAuth("/dashboard/analytics");

  // only admin and superadmin can access analytics
  if (user.role !== "ADMIN" && user.role !== "SUPERADMIN") {
    redirect("/app");
  }

  const analytics = await getAnalytics();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-card/40">
          <CardHeader>
            <CardTitle>Top Companies by Document Generation</CardTitle>
            <CardDescription>
              Companies with the highest document generation volume
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topCompanies.map((company, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{company.name}</span>
                    <span>{company.count} documents</span>
                  </div>
                  <ProgressBar
                    current={company.count}
                    total={analytics.topCompanies[0]?.count || 1}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/40">
          <CardHeader>
            <CardTitle>Most Active Users</CardTitle>
            <CardDescription>
              Users who have generated the most documents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.activeUsers.map((activeUser) => (
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
                  {analytics.templateUsage.map((template) => (
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
      </div>
    </div>
  );
}
