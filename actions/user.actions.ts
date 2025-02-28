"use server";

import prisma from "@/prisma/prisma";

export async function incrementUserGenerations(userId: string) {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        createdDocs: {
          increment: 1,
        },
      },
    });

    return { createdDocs: updatedUser.createdDocs };
  } catch (error) {
    console.error("Failed to increment user docs:", error);
    return { error: "Failed to update user docs count" };
  }
}

export async function getUserWithCompany(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return { success: true, user };
  } catch (error) {
    console.error("Failed to fetch user with company:", error);
    return { success: false, error: "Failed to fetch user data" };
  }
}
