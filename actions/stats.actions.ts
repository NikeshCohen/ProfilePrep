"use server";

import prisma from "@/prisma/prisma";

export async function getDashboardStats(userId?: string) {
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

  return {
    totalUsers,
    totalDocs,
    totalCompanies,
    totalTemplates,
    recentDocs,
    docsTrend,
    avgDocsPerUser,
    // denominator being '0' would result in an undefined output
    totalAllowedDocs: totalAllowedDocs._sum.allowedDocs || 1,
    totalAllowedTemplates: totalAllowedTemplates._sum.allowedTemplates || 1,
  };
}

export async function getRecentActivity(userId?: string) {
  return userId
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
}

export async function getSystemStats() {
  const totalDocs = await prisma.generatedDocs.count();
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

  return {
    totalDocs,
    totalTemplates,
    totalAllowedDocs: totalAllowedDocs._sum.allowedDocs || 1,
    totalAllowedTemplates: totalAllowedTemplates._sum.allowedTemplates || 1,
  };
}

export async function getUserStats(userId?: string) {
  if (!userId) {
    return {
      recentDocs: 0,
    };
  }

  // documents created in the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentDocs = await prisma.generatedDocs.count({
    where: {
      createdAt: {
        gte: thirtyDaysAgo,
      },
      createdBy: userId,
    },
  });

  return {
    recentDocs,
  };
}
