"use server";

import { revalidatePath } from "next/cache";

import { generateTailoredCV } from "@/actions/ai.actions";
import prisma from "@/prisma/prisma";
import type { CandidateData } from "@/types";

import { requireAuth } from "@/lib/utils";

// Upload master CV
export async function uploadMasterCV(formData: FormData) {
  const { user } = await requireAuth("/app/candidate");

  if (user.role !== "CANDIDATE" && user.role !== "USER") {
    throw new Error("Unauthorised. Only candidates can upload a master CV.");
  }

  const cvContent = formData.get("cvContent") as string;

  if (!cvContent || cvContent.trim() === "") {
    throw new Error("CV content is required");
  }

  try {
    // Check if candidate profile exists
    let candidateProfile = await prisma.candidateProfile.findUnique({
      where: { userId: user.id! },
    });

    if (candidateProfile) {
      // Update existing profile
      candidateProfile = await prisma.candidateProfile.update({
        where: { userId: user.id! },
        data: {
          masterCVContent: cvContent,
          masterCVUploaded: true,
          updatedAt: new Date(),
        },
      });
    } else {
      // Create new profile
      candidateProfile = await prisma.candidateProfile.create({
        data: {
          userId: user.id!,
          masterCVContent: cvContent,
          masterCVUploaded: true,
          skills: [],
        },
      });
    }

    revalidatePath("/app/candidate");
    return { success: true, message: "Master CV uploaded successfully" };
  } catch (error: unknown) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unsuccessful! Master CV could not be uploaded.",
    };
  }
}

// Create a tailored CV for a job
export async function createTailoredCV(data: {
  jobDescription: string;
  jobId?: string;
}) {
  const { user } = await requireAuth("/app/candidate");

  if (user.role !== "CANDIDATE" && user.role !== "USER") {
    throw new Error("Unauthorised. Only candidates can create tailored CVs.");
  }

  try {
    // Get the candidate's master CV
    const candidateProfile = await prisma.candidateProfile.findUnique({
      where: { userId: user.id! },
    });

    if (!candidateProfile || !candidateProfile.masterCVUploaded) {
      throw new Error("Please upload your master CV first");
    }

    // Prepare data for AI generation
    const candidateData: CandidateData = {
      documentTitle: `Tailored CV for ${user.name || "Candidate"}`,
      name: user.name || "Candidate",
      location: "",
      rightToWork: "",
      salaryExpectation: "",
      notes: candidateProfile.masterCVContent,
      templateId: "",
      jobDescription: data.jobDescription,
    };

    // Generate tailored CV using AI
    const tailoredContent = await generateTailoredCV(candidateData);

    // Save the tailored CV
    const tailoredCV = await prisma.generatedDocs.create({
      data: {
        content: tailoredContent,
        createdBy: user.id!,
        companyId: user.company?.id,
        documentTitle: `Tailored CV for Job ${data.jobId || "Application"}`,
        location: "",
        rightToWork: "",
        salaryExpectation: "",
        notes: candidateProfile.masterCVContent,
        isTailoredForJob: true,
        jobDescription: data.jobDescription,
      },
    });

    // If job ID is provided, create an application
    if (data.jobId) {
      await prisma.jobApplication.create({
        data: {
          jobListingId: data.jobId,
          candidateId: user.id!,
          tailoredCVId: tailoredCV.id,
          status: "SUBMITTED",
        },
      });
    }

    revalidatePath("/app/candidate");
    return {
      success: true,
      message: "Tailored CV created successfully",
      cvId: tailoredCV.id,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unsuccessful! Tailored CV could not be created.",
    };
  }
}

// Apply to a job
export async function applyToJob(data: {
  jobId: string;
  cvId: string;
  coverNote?: string;
}) {
  const { user } = await requireAuth("/app/candidate");

  if (user.role !== "CANDIDATE" && user.role !== "USER") {
    throw new Error("Unauthorized. Only candidates can apply to jobs.");
  }

  try {
    // Check if already applied
    const existingApplication = await prisma.jobApplication.findFirst({
      where: {
        jobListingId: data.jobId,
        candidateId: user.id!,
      },
    });

    if (existingApplication) {
      throw new Error("You have already applied to this job");
    }

    // Create application
    await prisma.jobApplication.create({
      data: {
        jobListingId: data.jobId,
        candidateId: user.id!,
        tailoredCVId: data.cvId,
        notes: data.coverNote || "",
      },
    });

    revalidatePath("/app/candidate/applications");
    return { success: true, message: "Application submitted successfully" };
  } catch (error: unknown) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unsuccessful! Application could not be submitted.",
    };
  }
}
