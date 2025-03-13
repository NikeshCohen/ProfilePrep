"use server";

import { NewCompanyData } from "@/app/app/companies/_components/CompanyManipulations";
import { NewUserData } from "@/app/app/users/_components/UserManipulations";
import prisma from "@/prisma/prisma";
import { User } from "next-auth";

import { handleError } from "@/lib/apiUtils";
import { getQueryClient } from "@/lib/getQueryClient";

interface CreateTemplateData {
  name: string;
  templateContent: string;
  companyId: string;
}

interface EditTemplateData {
  name: string;
  companyId?: string;
}

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

export async function fetchAllTemplates(sessionUser: User) {
  try {
    // If admin or user, fetch only company templates
    if (sessionUser.role === "ADMIN" || sessionUser.role === "USER") {
      const templates = await prisma.template.findMany({
        where: {
          companyId: sessionUser.company?.id,
        },
        select: {
          id: true,
          name: true,
          createdAt: true,
          updatedAt: true,
          templateContent: true,
          company: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return { success: true, templates };
    }

    const templates = await prisma.template.findMany({
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        templateContent: true,
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, templates };
  } catch (error) {
    console.error("Failed to fetch templates:", error);
    return { success: false, error: "Failed to fetch templates" };
  }
}

export async function checkTemplateLimit(companyId: string) {
  try {
    const company = await prisma.company.findUnique({
      where: {
        id: companyId,
      },
      select: {
        allowedTemplates: true,
        createdTemplates: true,
      },
    });

    if (!company) {
      return {
        success: false,
        error: "Company not found",
      };
    }

    return {
      success: true,
      limitReached: company.createdTemplates >= company.allowedTemplates,
    };
  } catch (error) {
    console.error("Failed to fetch templates:", error);
    return { success: false, error: "Failed to fetch templates" };
  }
}

export const createTemplate = async (
  templateData: CreateTemplateData,
  sessionUser: User,
) => {
  // Check permissions
  if (sessionUser.role === "USER") {
    return {
      success: false,
      message: "403 Forbidden: You do not have permission to create templates.",
    };
  }

  try {
    // If admin, verify the template is being created for their company
    if (
      sessionUser.role === "ADMIN" &&
      templateData.companyId !== sessionUser.company?.id
    ) {
      return {
        success: false,
        message:
          "403 Forbidden: You can only create templates for your company.",
      };
    }

    // Check company template limits
    const company = await prisma.company.findUnique({
      where: { id: templateData.companyId },
      select: { allowedTemplates: true, createdTemplates: true },
    });

    if (!company) {
      return {
        success: false,
        message: "Company not found.",
      };
    }

    if (company.createdTemplates >= company.allowedTemplates) {
      return {
        success: false,
        message: "Template limit reached for this company.",
      };
    }

    // Create the template
    const template = await prisma.template.create({
      data: {
        name: templateData.name,
        templateContent: templateData.templateContent,
        companyId: templateData.companyId,
      },
    });

    // Increment the company's created templates count
    await prisma.company.update({
      where: { id: templateData.companyId },
      data: { createdTemplates: { increment: 1 } },
    });

    // Invalidate the templates query cache
    const queryClient = getQueryClient();
    queryClient.invalidateQueries({ queryKey: ["templates"] });

    return {
      success: true,
      message: "Template created successfully.",
      data: template,
    };
  } catch (error: unknown) {
    return handleError(error);
  }
};

export const editTemplate = async (
  templateId: string,
  templateData: EditTemplateData,
  sessionUser: User,
) => {
  // Check permissions
  if (sessionUser.role === "USER") {
    return {
      success: false,
      message: "403 Forbidden: You do not have permission to edit templates.",
    };
  }

  try {
    // Get the current template to check ownership and company
    const currentTemplate = await prisma.template.findUnique({
      where: { id: templateId },
      select: { companyId: true },
    });

    if (!currentTemplate) {
      return {
        success: false,
        message: "Template not found.",
      };
    }

    // If admin, verify they're editing a template from their company
    if (
      sessionUser.role === "ADMIN" &&
      currentTemplate.companyId !== sessionUser.company?.id
    ) {
      return {
        success: false,
        message:
          "403 Forbidden: You can only edit templates from your company.",
      };
    }

    // If admin, ensure they can't change the company
    if (sessionUser.role === "ADMIN" && templateData.companyId) {
      delete templateData.companyId;
    }

    // If superadmin is changing company, verify the new company exists
    if (
      sessionUser.role === "SUPERADMIN" &&
      templateData.companyId &&
      templateData.companyId !== currentTemplate.companyId
    ) {
      const newCompany = await prisma.company.findUnique({
        where: { id: templateData.companyId },
        select: { allowedTemplates: true, createdTemplates: true },
      });

      if (!newCompany) {
        return {
          success: false,
          message: "New company not found.",
        };
      }

      // Check if new company has room for another template
      if (newCompany.createdTemplates >= newCompany.allowedTemplates) {
        return {
          success: false,
          message: "Template limit reached for the target company.",
        };
      }

      // Update template counts for both companies
      await prisma.$transaction([
        // Decrement old company's count
        prisma.company.update({
          where: { id: currentTemplate.companyId },
          data: { createdTemplates: { decrement: 1 } },
        }),
        // Increment new company's count
        prisma.company.update({
          where: { id: templateData.companyId },
          data: { createdTemplates: { increment: 1 } },
        }),
      ]);
    }

    // Update the template
    const template = await prisma.template.update({
      where: { id: templateId },
      data: {
        name: templateData.name,
        ...(templateData.companyId && { companyId: templateData.companyId }),
        updatedAt: new Date(),
      },
    });

    // Invalidate the templates query cache
    const queryClient = getQueryClient();
    queryClient.invalidateQueries({ queryKey: ["templates"] });

    return {
      success: true,
      message: "Template updated successfully.",
      data: template,
    };
  } catch (error: unknown) {
    return handleError(error);
  }
};

export const deleteTemplate = async (templateId: string, sessionUser: User) => {
  // Check permissions
  if (sessionUser.role !== "SUPERADMIN") {
    return {
      success: false,
      message: "403 Forbidden: Only Super Admins can delete templates.",
    };
  }

  try {
    // Get the template to check company association
    const template = await prisma.template.findUnique({
      where: { id: templateId },
      select: { companyId: true },
    });

    if (!template) {
      return {
        success: false,
        message: "Template not found.",
      };
    }

    // Delete the template
    await prisma.template.delete({
      where: { id: templateId },
    });

    // Decrement the company's created templates count
    await prisma.company.update({
      where: { id: template.companyId },
      data: { createdTemplates: { decrement: 1 } },
    });

    // Invalidate the templates query cache
    const queryClient = getQueryClient();
    queryClient.invalidateQueries({ queryKey: ["templates"] });

    return {
      success: true,
      message: "Template deleted successfully.",
    };
  } catch (error: unknown) {
    return handleError(error);
  }
};
