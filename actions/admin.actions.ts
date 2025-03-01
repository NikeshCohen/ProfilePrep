"use server";

import { NewUserData } from "@/app/app/users/_components/UserManipulations";
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

export const createUser = async (userData: NewUserData) => {
  return await prisma.user.create({
    data: {
      name: userData.name,
      email: userData.email,
      role:
        userData.role === "user"
          ? "USER"
          : userData.role === "admin"
            ? "ADMIN"
            : "SUPERADMIN",
      ...(userData.companyId && { companyId: userData.companyId }),
    },
  });
};

export const editUser = async (userId: string, userData: NewUserData) => {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      name: userData.name,
      email: userData.email,
      role:
        userData.role === "user"
          ? "USER"
          : userData.role === "admin"
            ? "ADMIN"
            : "SUPERADMIN",
      ...(userData.companyId && { companyId: userData.companyId }),
    },
  });
};

export const fetchAllCompanies = async () => {
  return await prisma.company.findMany();
};
