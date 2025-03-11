"use server";

import { NewCompanyData } from "@/app/app/companies/_components/CompanyManipulations";
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
    // Get the current user to check if company is changing
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { companyId: true },
    });

    if (!currentUser) {
      return {
        success: false,
        message: "User not found.",
      };
    }

    // If company is changing, get the new company's allowedDocsPerUsers
    let allowedDocs = undefined;
    if (userData.companyId && userData.companyId !== currentUser.companyId) {
      const newCompany = await prisma.company.findUnique({
        where: { id: userData.companyId },
        select: { allowedDocsPerUsers: true },
      });

      if (newCompany) {
        allowedDocs = newCompany.allowedDocsPerUsers;
      }
    }

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
        ...(allowedDocs !== undefined && { allowedDocs }),
        updatedAt: new Date(),
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

export const createCompany = async (companyData: NewCompanyData) => {
  try {
    const company = await prisma.company.create({
      data: {
        name: companyData.name,
        allowedDocsPerUsers: companyData.allowedDocsPerUsers,
        allowedTemplates: companyData.allowedTemplates,
        createdTemplates: 0,
      },
    });
    return company;
  } catch (error: unknown) {
    return handleError(error);
  }
};

export const updateCompany = async (
  companyId: string,
  companyData: NewCompanyData,
  sessionUser: User,
) => {
  // Check permissions
  if (sessionUser.role !== "SUPERADMIN") {
    return {
      success: false,
      message: "403 Forbidden: Only superadmins can update companies.",
    };
  }

  try {
    // First get the current company to check if allowedDocsPerUsers changed
    const currentCompany = await prisma.company.findUnique({
      where: { id: companyId },
      select: {
        allowedDocsPerUsers: true,
        allowedTemplates: true,
        createdTemplates: true,
      },
    });

    if (!currentCompany) {
      return {
        success: false,
        message: "Company not found.",
      };
    }

    // Validate template limits
    if (companyData.allowedTemplates < currentCompany.createdTemplates) {
      return {
        success: false,
        message:
          "Cannot set allowed templates lower than current created templates count.",
      };
    }

    // Update company
    const updatedCompany = await prisma.company.update({
      where: { id: companyId },
      data: {
        name: companyData.name,
        allowedDocsPerUsers: companyData.allowedDocsPerUsers,
        allowedTemplates: companyData.allowedTemplates,
      },
    });

    // If allowedDocsPerUsers changed, update all users in the company
    if (
      currentCompany.allowedDocsPerUsers !== companyData.allowedDocsPerUsers
    ) {
      await prisma.user.updateMany({
        where: { companyId },
        data: { allowedDocs: companyData.allowedDocsPerUsers },
      });
    }

    return {
      success: true,
      message: "Company updated successfully.",
      data: updatedCompany,
    };
  } catch (error: unknown) {
    return handleError(error);
  }
};

export const deleteCompany = async (companyId: string, sessionUser: User) => {
  // Check permissions
  if (sessionUser.role !== "SUPERADMIN") {
    return {
      success: false,
      message: "403 Forbidden: Only superadmins can delete companies.",
    };
  }

  try {
    // First, delete all generated documents for users in this company
    await prisma.generatedDocs.deleteMany({
      where: {
        user: {
          companyId: companyId,
        },
      },
    });

    // Delete all templates for this company
    await prisma.template.deleteMany({
      where: {
        companyId: companyId,
      },
    });

    // Then, delete all users in the company
    await prisma.user.deleteMany({
      where: {
        companyId: companyId,
      },
    });

    // Finally, delete the company
    await prisma.company.delete({
      where: {
        id: companyId,
      },
    });

    return {
      success: true,
      message: "Company deleted successfully.",
    };
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

  return await prisma.company.findMany({
    include: {
      _count: {
        select: {
          users: true,
          GeneratedDocs: true,
          templates: true,
        },
      },
      users: {
        select: {
          allowedDocs: true,
        },
      },
      templates: {
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export async function getAllUserDocs(sessionUser: User) {
  if (sessionUser.role !== "SUPERADMIN") {
    return {
      success: false,
      message: "403 Forbidden: You do not have permission to delete users.",
    };
  }

  try {
    const docInfo = await prisma.generatedDocs.findMany({
      select: {
        id: true,
        createdAt: true,
        candidateName: true,
        location: true,
        notes: true,
        user: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
        company: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, docInfo };
  } catch (error) {
    console.error("Failed to fetch basic document info:", error);
    return { success: false, error: "Failed to fetch document info" };
  }
}
