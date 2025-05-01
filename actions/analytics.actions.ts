"use server";

import prisma from "@/prisma/prisma";

export async function getTopCompanies() {
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

  return topCompanies;
}

export async function getActiveUsers() {
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

  return activeUsers;
}

export async function getTemplateUsage() {
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

  return templateUsage;
}
