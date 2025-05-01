"use server";

import prisma from "@/prisma/prisma";

export async function getTotalUsers() {
  const totalUsers = await prisma.user.count();
  return totalUsers;
}

export async function getTotalDocs() {
  const totalDocs = await prisma.generatedDocs.count();
  return totalDocs;
}

export async function getDocsWithTrend(userId?: string) {
  // documents created in the last 30 days
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

  return {
    totalDocs: await getTotalDocs(),
    recentDocs,
    docsTrend,
  };
}

export async function getAvgDocsPerUser() {
  const totalUsers = await getTotalUsers();
  const totalDocs = await getTotalDocs();

  // average docs per user
  const avgDocsPerUser =
    totalUsers > 0 ? Math.round((totalDocs / totalUsers) * 10) / 10 : 0;

  return avgDocsPerUser;
}

export async function getTotalCompanies() {
  const totalCompanies = await prisma.company.count();
  return totalCompanies;
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
