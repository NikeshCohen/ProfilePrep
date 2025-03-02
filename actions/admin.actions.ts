"use server";

import { NewUserData } from "@/app/app/users/_components/UserManipulations";
import prisma from "@/prisma/prisma";
import { User } from "next-auth";

import { handleError } from "@/lib/apiUtils";

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
  try {
    const user = await prisma.user.create({
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

    return {
      success: true,
      message: "User created successfully.",
      data: user,
    };
  } catch (error: unknown) {
    return handleError(error);
  }
};

export const editUser = async (
  userId: string,
  userData: NewUserData,
  sessionUser: User,
) => {
  // Check permissions
  if (sessionUser.role === "USER") {
    return {
      success: false,
      message: "403 Forbidden: You do not have permission to edit users.",
    };
  }

  // If admin, verify the user belongs to their company
  if (sessionUser.role === "ADMIN") {
    if (userData.companyId !== sessionUser.company?.id) {
      return {
        success: false,
        message: "403 Forbidden: You can only edit users from your company.",
      };
    }
  }

  try {
    const user = await prisma.user.update({
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
    return {
      success: true,
      message: "User updated successfully.",
      data: user,
    };
  } catch (error: unknown) {
    return handleError(error);
  }
};

export const deleteUser = async (userId: string, sessionUser: User) => {
  // Check permissions
  if (sessionUser.role === "USER") {
    return {
      success: false,
      message: "403 Forbidden: You do not have permission to delete users.",
    };
  }

  // If admin, verify the user belongs to their company
  if (sessionUser.role === "ADMIN") {
    const userToDelete = await prisma.user.findUnique({
      where: { id: userId },
      select: { companyId: true },
    });

    if (!userToDelete || userToDelete.companyId !== sessionUser.company?.id) {
      return {
        success: false,
        message: "403 Forbidden: You can only delete users from your company.",
      };
    }
  }

  // Perform the deletion
  try {
    await prisma.user.delete({
      where: { id: userId },
    });
    return {
      success: true,
      message: "User deleted successfully.",
    };
  } catch (error: unknown) {
    return handleError(error);
  }
};

export const createCompany = async (companyName: string) => {
  try {
    const company = await prisma.company.create({
      data: {
        name: companyName,
      },
    });
    return company;
  } catch (error: unknown) {
    return handleError(error);
  }
};

export const fetchAllCompanies = async (sessionUser: User) => {
  if (sessionUser.role !== "SUPERADMIN") {
    throw new Error(
      "403 Forbidden: You do not have permission to access this resource.",
    );
  }

  return await prisma.company.findMany();
};
