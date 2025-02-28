"use server";

import prisma from "@/prisma/prisma";

export const fetchAllUsers = async (user: {
  role: string;
  companyId?: string;
}) => {
  // Check user role
  if (user.role === "USER") {
    throw new Error(
      "403 Forbidden: You do not have permission to access this resource.",
    );
  }

  // If the user is an admin, fetch users from their company
  if (user.role === "ADMIN") {
    return await prisma.user.findMany({
      where: {
        companyId: user.companyId,
      },
      include: {
        company: true,
      },
    });
  }

  // If the user is a superadmin, fetch all users
  return await prisma.user.findMany({
    include: {
      company: true,
    },
  });
};
