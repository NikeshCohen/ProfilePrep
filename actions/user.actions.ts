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

    return { success: true, createdDocs: updatedUser.createdDocs };
  } catch (error) {
    console.error("Failed to increment user docs:", error);
    return { success: false, error: "Failed to update user docs count" };
  }
}
