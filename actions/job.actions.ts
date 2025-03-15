"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import prisma from "@/prisma/prisma";
import { ApplicationStatus, JobStatus } from "@prisma/client";
import { z } from "zod";

// Schema validation for updating application status
const updateApplicationStatusSchema = z.object({
  applicationId: z.string(),
  status: z
    .string()
    .refine(
      (val) =>
        [
          "SUBMITTED",
          "REVIEWING",
          "INTERVIEW",
          "OFFER",
          "HIRED",
          "REJECTED",
          "WITHDRAWN",
        ].includes(val),
      {
        message: "Invalid application status",
      },
    ),
});

// Schema validation for updating job status
const updateJobStatusSchema = z.object({
  jobId: z.string(),
  status: z
    .string()
    .refine(
      (val) =>
        ["OPEN", "FILLED", "CLOSED", "EXTERNAL_FILL", "CUSTOM"].includes(val),
      {
        message: "Invalid job status",
      },
    ),
});

/**
 * Updates the status of a job application
 */
export async function updateApplicationStatus(data: {
  applicationId: string;
  status: string;
}) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return { success: false, message: "Unauthorized" };
    }

    const validatedData = updateApplicationStatusSchema.safeParse(data);

    if (!validatedData.success) {
      return {
        success: false,
        message:
          validatedData.error.errors[0]?.message || "Invalid data provided",
      };
    }

    const { applicationId, status } = validatedData.data;

    // Find the application to make sure it exists and the user has permission
    const application = await prisma.jobApplication.findUnique({
      where: { id: applicationId },
      include: {
        jobListing: {
          include: {
            company: true,
          },
        },
      },
    });

    // Ensure that the company object includes userId
    if (!application || !application.jobListing.company) {
      return { success: false, message: "Application or company not found" };
    }

    // Check if the user has permission to update this application
    if (application.jobListing.company.id !== session.user.id) {
      return {
        success: false,
        message: "You don't have permission to update this application",
      };
    }

    // Update the application status
    await prisma.jobApplication.update({
      where: { id: applicationId },
      data: { status: status as ApplicationStatus },
    });

    // Revalidate the job applications page
    revalidatePath(`/app/jobs/${application.jobListing.id}/applications`);

    return {
      success: true,
      message: "Application status updated successfully",
    };
  } catch (error) {
    console.error("Failed to update application status:", error);
    return { success: false, message: "Failed to update application status" };
  }
}

/**
 * Updates the status of a job listing
 */
export async function updateJobStatus(data: { jobId: string; status: string }) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return { success: false, message: "Unauthorized" };
    }

    const validatedData = updateJobStatusSchema.safeParse(data);

    if (!validatedData.success) {
      return {
        success: false,
        message:
          validatedData.error.errors[0]?.message || "Invalid data provided",
      };
    }

    const { jobId, status } = validatedData.data;

    // Find the job to make sure it exists and the user has permission
    const job = await prisma.jobListing.findUnique({
      where: { id: jobId },
      include: {
        company: true,
      },
    });

    if (!job) {
      return { success: false, message: "Job not found" };
    }

    // Check if the user has permission to update this job
    // Assuming the user must be associated with the company that posted the job
    if (job.company && job.company.id !== session.user.id) {
      return {
        success: false,
        message: "You don't have permission to update this job",
      };
    }

    // Update the job status
    await prisma.jobListing.update({
      where: { id: jobId },
      data: { status: status as JobStatus },
    });

    // Revalidate the job details page
    revalidatePath(`/app/jobs/${jobId}`);

    return { success: true, message: "Job status updated successfully" };
  } catch (error) {
    console.error("Failed to update job status:", error);
    return { success: false, message: "Failed to update job status" };
  }
}
