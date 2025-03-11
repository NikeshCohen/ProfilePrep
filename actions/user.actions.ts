"use server";

import prisma from "@/prisma/prisma";
import { CandidateData } from "@/types";

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

export async function getUserDocs(userId: string) {
  try {
    const docInfo = await prisma.generatedDocs.findMany({
      where: { createdBy: userId },
      select: {
        id: true,
        createdAt: true,
        candidateName: true,
        salaryExpectation: true,
        rightToWork: true,
        location: true,
        notes: true,
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

export async function deleteDoc(docId: string) {
  try {
    await prisma.generatedDocs.delete({
      where: { id: docId },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to delete document:", error);
    return { success: false, error: "Failed to delete document" };
  }
}

export async function getDocContent(docId: string) {
  try {
    const docContent = await prisma.generatedDocs.findUnique({
      where: { id: docId },
      select: {
        content: true,
        documentTitle: true,
      },
    });

    if (!docContent) {
      throw new Error("Document not found");
    }

    return { success: true, docContent };
  } catch (error) {
    console.error("Failed to fetch document content:", error);
    return { success: false, error: "Failed to fetch document content" };
  }
}

export async function createGeneratedDoc({
  documentContent,
  rawContent,
  userId,
  companyId,
}: {
  documentContent: CandidateData;
  rawContent: string;
  userId: string;
  companyId: string;
}) {
  try {
    const newDoc = await prisma.generatedDocs.create({
      data: {
        content: rawContent,
        candidateName: documentContent.name,
        location: documentContent.location.toString(),
        rightToWork: documentContent.rightToWork,
        salaryExpectation: documentContent.salaryExpectation,
        notes: documentContent.notes,
        documentTitle: documentContent.documentTitle,
        createdBy: userId,
        companyId,
      },
    });

    return { success: true, doc: newDoc };
  } catch (error) {
    console.error("Failed to create document:", error);
    return { success: false, error: "Failed to create document" };
  }
}
