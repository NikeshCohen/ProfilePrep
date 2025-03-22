import type { Metadata } from "next";
import Link from "next/link";

import { StatisticsCard } from "@/app/dashboard/_components/StatisticsCard";
import prisma from "@/prisma/prisma";
import {
  BarChart3,
  BookDashed,
  Briefcase,
  FileText,
  Users,
} from "lucide-react";

import { ProgressBar } from "@/components/global/ProgressBar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { requireAuth } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Dashboard",
};

async function getStats(userId?: string) {
  const totalUsers = await prisma.user.count();
  const totalDocs = await prisma.generatedDocs.count();
  const totalCompanies = await prisma.company.count();
  const totalTemplates = await prisma.template.count();

  // total allowed docs across all users
  const totalAllowedDocs = await prisma.user.aggregate({
    _sum: {
      allowedDocs: true,
    },
  });

  // total allowed templates across all companies
  const totalAllowedTemplates = await prisma.company.aggregate({
    _sum: {
      allowedTemplates: true,
    },
  });

  // documents created in the last 30 days (for all users)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentDocs = userId
    ? await prisma.generatedDocs.count({
        where: {
          createdAt: {
            gte: thirtyDaysAgo,
          },
          // filter by user if user id is passed
          createdBy: userId,
        },
      })
    : await prisma.generatedDocs.count({
        where: {
          createdAt: {
            gte: thirtyDaysAgo,
          },
        },
      });

  // previous 30 days docs for trend calculation
  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

  const previousPeriodDocs = await prisma.generatedDocs.count({
    where: {
      createdAt: {
        gte: sixtyDaysAgo,
        lt: thirtyDaysAgo,
      },
    },
  });

  // calculate trend percentage
  let docsTrend = 0;
  if (previousPeriodDocs > 0) {
    docsTrend = Math.round(
      ((recentDocs - previousPeriodDocs) / previousPeriodDocs) * 100,
    );
  }

  // average docs per user
  const avgDocsPerUser =
    totalUsers > 0 ? Math.round((totalDocs / totalUsers) * 10) / 10 : 0;

  // recent activity for the user if a user is logged in
  const recentActivity = userId
    ? await prisma.generatedDocs.findMany({
        where: { createdBy: userId },
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      })
    : await prisma.generatedDocs.findMany({
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

  return {
    totalUsers,
    totalDocs,
    totalCompanies,
    totalTemplates,
    recentDocs,
    docsTrend,
    avgDocsPerUser,
    recentActivity,
    // denominator being '0' would result in an undefined output
    totalAllowedDocs: totalAllowedDocs._sum.allowedDocs || 1,
    totalAllowedTemplates: totalAllowedTemplates._sum.allowedTemplates || 1,
  };
}

export default async function DashboardPage() {
  const { user } = await requireAuth("/dashboard");

  const stats = await getStats(user.role === "USER" ? user.id : undefined);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

      {/* display stats for all users if admin/superadmin */}
      {user.role === "ADMIN" ||
        (user.role === "SUPERADMIN" && (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatisticsCard
                title="Total Users"
                value={stats.totalUsers}
                icon={<Users className="h-5 w-5" />}
              />
              <StatisticsCard
                title="Total Documents"
                value={stats.totalDocs}
                description={`${stats.recentDocs} created in the last 30 days`}
                icon={<FileText className="h-5 w-5" />}
                trend={{
                  value: stats.docsTrend,
                  isPositive: stats.docsTrend >= 0,
                }}
              />
              <StatisticsCard
                title="Avg. Docs per User"
                value={stats.avgDocsPerUser}
                icon={<BarChart3 className="h-5 w-5" />}
              />
              {user.role === "SUPERADMIN" ? (
                <StatisticsCard
                  title="Companies"
                  value={stats.totalCompanies}
                  icon={<Briefcase className="h-5 w-5" />}
                />
              ) : (
                <StatisticsCard
                  title="Templates"
                  value={stats.totalTemplates}
                  icon={<BookDashed className="h-5 w-5" />}
                />
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card className="bg-card/40">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    The latest document generations across the platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.recentActivity.map((doc) => (
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

              <Card className="bg-card/40">
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                  <CardDescription>
                    Current system performance and limits
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Document Storage</span>
                        <span className="font-medium">
                          {stats.totalDocs} documents
                        </span>
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
                        {/* TODO: ensure this only renders if 'all systems operational' test passes */}
                        <span className="text-sm">All systems operational</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        ))}

      {/* user view */}
      {user.role === "USER" && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          <StatisticsCard
            title="Your Documents"
            value={stats.recentDocs}
            description="Documents created in the last 30 days"
            icon={<FileText className="h-5 w-5" />}
          />
          <StatisticsCard
            title="Your Subscription"
            // value={user.subscription || "Free Plan"}
            value={"Free Plan"}
            description="Upgrade to a premium plan"
            icon={<Briefcase className="h-5 w-5" />}
          />

          <Button asChild className="mt-2 w-full">
            <Link href="/dashboard/settings">View Limits</Link>
          </Button>

          <Button asChild className="mt-2 w-full">
            <Link href="/pricing">Upgrade Plan</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
