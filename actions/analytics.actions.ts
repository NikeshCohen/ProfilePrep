"use server";

import prisma from "@/prisma/prisma";
import type { User } from "next-auth";

import { isSuperAdmin, getCompanyFilter } from "@/lib/roleUtils";

export async function getTopCompanies(user: User) {
  // monthly document generation counts for the last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  // show all companies (superadmins)
  if (isSuperAdmin(user)) {
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
    return monthlyDocs.map((doc) => {
      const company = companies.find((c) => c.id === doc.companyId);
      return {
        name: company?.name || "Unknown",
        count: doc._count.id,
      };
    });
  }
  // NOTE: departments/teams can be shown within their company pending expansion
  else {
    // top users in their company instead of companies (admins)
    const companyFilter = getCompanyFilter(user);
    const topUsers = await prisma.generatedDocs.groupBy({
      by: ["createdBy"],
      where: {
        ...companyFilter,
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

    // get user names
    const userIds = topUsers.map((item) => item.createdBy);
    const users = await prisma.user.findMany({
      where: {
        id: {
          in: userIds,
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    // map user names to results
    return topUsers.map((item) => {
      const user = users.find((u) => u.id === item.createdBy);
      return {
        name: user?.name || user?.email?.split("@")[0] || "Unknown User",
        count: item._count.id,
      };
    });
  }
}

export async function getActiveUsers(user: User) {
  // users across all companies (superadmins)
  if (isSuperAdmin(user)) {
    return await prisma.user.findMany({
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
  }

  // only users in their company (admins)
  return await prisma.user.findMany({
    where: getCompanyFilter(user),
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
}

export async function getTemplateUsage(user: User) {
  // templates across all companies (superadmins)
  if (isSuperAdmin(user)) {
    return await prisma.template.findMany({
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
  }

  // templates in their company (admins)
  return await prisma.template.findMany({
    where: getCompanyFilter(user),
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
}
