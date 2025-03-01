"use server";

import { NewUserData } from "@/app/app/users/_components/UserManipulations";
import prisma from "@/prisma/prisma";
import { User } from "next-auth";

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
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // If the user is a superadmin, fetch all users
  return await prisma.user.findMany({
    include: {
      company: true,
    },
    orderBy: {
      createdAt: "desc",
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

export const deleteUser = async (userId: string, sessionUser: User) => {
  // Check permissions
  if (sessionUser.role === "USER") {
    throw new Error(
      "403 Forbidden: You do not have permission to delete users.",
    );
  }

  // If admin, verify the user belongs to their company
  if (sessionUser.role === "ADMIN") {
    const userToDelete = await prisma.user.findUnique({
      where: { id: userId },
      select: { companyId: true },
    });

    if (!userToDelete || userToDelete.companyId !== sessionUser.company?.id) {
      throw new Error(
        "403 Forbidden: You can only delete users from your company.",
      );
    }
  }

  // Perform the deletion
  return await prisma.user.delete({
    where: { id: userId },
  });
};

export const createCompany = async (companyName: string) => {
  return await prisma.company.create({
    data: {
      name: companyName,
    },
  });
};

export const fetchAllCompanies = async () => {
  return await prisma.company.findMany();
};
