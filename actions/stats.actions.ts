"use server";

import prisma from "@/prisma/prisma";
import type { User } from "next-auth";

import { getCompanyFilter, isSuperAdmin } from "@/lib/roleUtils";

export async function getTotalUsers(user: User) {
  // count all users (superadmins)
  if (isSuperAdmin(user)) {
    return await prisma.user.count();
  }

  // count only users in their company with the same user type (admins)
  return await prisma.user.count({
    where: {
      companyId: user.company?.id,
      userType: user.userType, // Only count users of the same type (RECRUITER/CANDIDATE)
    },
  });
}

export async function getTotalDocs(user: User) {
  // count all docs (superadmins)
  if (isSuperAdmin(user)) {
    return await prisma.generatedDocs.count();
  }

  // count only docs from their company for same user type (admins)
  return await prisma.generatedDocs.count({
    where: {
      companyId: user.company?.id,
      user: {
        userType: user.userType,
      },
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

  // combine filters with user type filter for admins
  const whereFilter = {
    ...userFilter,
    ...companyFilter,
    ...(user.role === "ADMIN" && {
      user: {
        userType: user.userType,
      },
    }),
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
      ...(user.role === "ADMIN" && {
        user: {
          userType: user.userType,
        },
      }),
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

  // return their own company count (admins) - always 1 for admins
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
      ...(user.role === "ADMIN" && {
        user: {
          userType: user.userType,
        },
      }),
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
    // sum of allowed docs for users in this company with same user type (admins)
    const allowedDocsAgg = await prisma.user.aggregate({
      where: {
        companyId: user.company?.id,
        userType: user.userType,
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

// Candidate-specific statistics functions
export async function getCandidateStats(user: User) {
  if (user.userType !== "CANDIDATE") {
    return {
      totalAnalyses: 0,
      averageScore: 0,
      bestScore: 0,
      recentAnalyses: 0,
    };
  }

  // Base filter for the user's analyses
  const userFilter = { userId: user.id };

  // Company filter for admin candidates
  let companyFilter = {};
  if (user.role === "ADMIN" && user.company?.id) {
    companyFilter = {
      user: {
        companyId: user.company.id,
        userType: "CANDIDATE",
      },
    };
  }

  const totalAnalyses = await prisma.cVAnalysis.count({
    where: user.role === "ADMIN" ? companyFilter : userFilter,
  });

  // Get average score for the candidate or organization
  const analysesWithScores = await prisma.cVAnalysis.findMany({
    where: user.role === "ADMIN" ? companyFilter : userFilter,
    select: {
      overallScore: true,
    },
  });

  const averageScore =
    analysesWithScores.length > 0
      ? Math.round(
          analysesWithScores.reduce(
            (sum, analysis) => sum + analysis.overallScore,
            0,
          ) / analysesWithScores.length,
        )
      : 0;

  const bestScore =
    analysesWithScores.length > 0
      ? Math.max(...analysesWithScores.map((a) => a.overallScore))
      : 0;

  // Recent analyses (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentAnalyses = await prisma.cVAnalysis.count({
    where: {
      ...(user.role === "ADMIN" ? companyFilter : userFilter),
      createdAt: {
        gte: thirtyDaysAgo,
      },
    },
  });

  return {
    totalAnalyses,
    averageScore,
    bestScore,
    recentAnalyses,
  };
}

export async function getCandidateUserStats(userId: string) {
  if (!userId) {
    return {
      totalAnalyses: 0,
      bestScore: 0,
      averageScore: 0,
    };
  }

  const totalAnalyses = await prisma.cVAnalysis.count({
    where: { userId },
  });

  const analysesWithScores = await prisma.cVAnalysis.findMany({
    where: { userId },
    select: { overallScore: true },
  });

  const bestScore =
    analysesWithScores.length > 0
      ? Math.max(...analysesWithScores.map((a) => a.overallScore))
      : 0;

  const averageScore =
    analysesWithScores.length > 0
      ? Math.round(
          analysesWithScores.reduce(
            (sum, analysis) => sum + analysis.overallScore,
            0,
          ) / analysesWithScores.length,
        )
      : 0;

  return {
    totalAnalyses,
    bestScore,
    averageScore,
  };
}
