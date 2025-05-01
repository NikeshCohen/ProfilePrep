"use server";

import { isSuperAdmin } from "@/app/dashboard/_components/statistics/DashboardStats";
import prisma from "@/prisma/prisma";
import type { User } from "next-auth";

function getCompanyFilter(user: User) {
  // no company filter - see all data (superadmins)
  if (isSuperAdmin(user)) {
    return {};
  }

  // filter by their company (admins)
  return {
    companyId: user.company?.id,
  };
}

export async function getTotalUsers(user: User) {
  // count all users (superadmins)
  if (isSuperAdmin(user)) {
    return await prisma.user.count();
  }

  // count only users in their company (admins)
  return await prisma.user.count({
    where: {
      companyId: user.company?.id,
    },
  });
}

export async function getTotalDocs(user: User) {
  // count all docs (superadmins)
  if (isSuperAdmin(user)) {
    return await prisma.generatedDocs.count();
  }

  // count only docs from their company (admins)
  return await prisma.generatedDocs.count({
    where: {
      companyId: user.company?.id,
    },
  });
}

export async function getDocsWithTrend(user: User, userId?: string) {
  // documents created in the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // base filter - filter by specific user if provided
  const userFilter = userId ? { createdBy: userId } : {};

  // company filter based on user role
  const companyFilter = getCompanyFilter(user);

  // combine filters
  const whereFilter = {
    ...userFilter,
    ...companyFilter,
    createdAt: {
      gte: thirtyDaysAgo,
    },
  };

  const recentDocs = await prisma.generatedDocs.count({
    where: whereFilter,
  });

  // previous 30 days docs for trend calculation
  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

  const previousPeriodDocs = await prisma.generatedDocs.count({
    where: {
      ...userFilter,
      ...companyFilter,
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
    totalDocs: await getTotalDocs(user),
    recentDocs,
    docsTrend,
  };
}

export async function getAvgDocsPerUser(user: User) {
  const totalUsers = await getTotalUsers(user);
  const totalDocs = await getTotalDocs(user);

  // average docs per user
  const avgDocsPerUser =
    totalUsers > 0 ? Math.round((totalDocs / totalUsers) * 10) / 10 : 0;

  return avgDocsPerUser;
}

export async function getTotalCompanies(user: User) {
  // all companies (superadmins)
  if (isSuperAdmin(user)) {
    return await prisma.company.count();
  }

  // return their own company count (admins)
  return 1;
}

export async function getRecentActivity(user: User, userId?: string) {
  // base filter - filter by specific user if provided
  const userFilter = userId ? { createdBy: userId } : {};

  // company filter based on user role
  const companyFilter = getCompanyFilter(user);

  return await prisma.generatedDocs.findMany({
    where: {
      ...userFilter,
      ...companyFilter,
    },
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

export async function getSystemStats(user: User) {
  // role-based filtering
  const totalDocs = await getTotalDocs(user);

  // filter by company (admins)
  let totalTemplates;
  let totalAllowedTemplates;

  if (isSuperAdmin(user)) {
    // all templates (superadmins)
    totalTemplates = await prisma.template.count();

    // sum of allowed templates across all companies
    const allowedTemplatesAgg = await prisma.company.aggregate({
      _sum: {
        allowedTemplates: true,
      },
    });
    totalAllowedTemplates = allowedTemplatesAgg._sum.allowedTemplates || 1;
  } else {
    // only their company's templates (admins)
    totalTemplates = await prisma.template.count({
      where: {
        companyId: user.company?.id,
      },
    });

    // allowed templates for this company
    const company = await prisma.company.findUnique({
      where: {
        id: user.company?.id,
      },
      select: {
        allowedTemplates: true,
      },
    });
    totalAllowedTemplates = company?.allowedTemplates || 1;
  }

  // filter by company (admins)
  let totalAllowedDocs;

  if (isSuperAdmin(user)) {
    // sum of allowed docs across all users (superadmins)
    const allowedDocsAgg = await prisma.user.aggregate({
      _sum: {
        allowedDocs: true,
      },
    });
    totalAllowedDocs = allowedDocsAgg._sum.allowedDocs || 1;
  } else {
    // sum of allowed docs for users in this company (admins)
    const allowedDocsAgg = await prisma.user.aggregate({
      where: {
        companyId: user.company?.id,
      },
      _sum: {
        allowedDocs: true,
      },
    });
    totalAllowedDocs = allowedDocsAgg._sum.allowedDocs || 1;
  }

  return {
    totalDocs,
    totalTemplates,
    totalAllowedDocs,
    totalAllowedTemplates,
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
