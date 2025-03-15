import { NextRequest, NextResponse } from "next/server";

import prisma from "@/prisma/prisma";

import { requireAuth } from "@/lib/utils";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const jobId = params.id;

    // Get job with company details
    const job = await prisma.jobListing.findUnique({
      where: { id: jobId },
      include: {
        company: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({ job });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch job details",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { user } = await requireAuth();
    const jobId = params.id;

    // Check if job exists
    const job = await prisma.jobListing.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Check permission to update
    if (
      user.role !== "SUPERADMIN" &&
      job.createdBy !== user.id! &&
      (job.companyId !== user.companyId || !user.companyId)
    ) {
      return NextResponse.json(
        { error: "You don't have permission to update this job" },
        { status: 403 },
      );
    }

    const data = await req.json();

    // Update job
    const updatedJob = await prisma.jobListing.update({
      where: { id: jobId },
      data: {
        title: data.title,
        description: data.description,
        location: data.location,
        salaryRange: data.salaryRange,
        skills: data.skills,
        status: data.status,
      },
    });

    return NextResponse.json({ job: updatedJob });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to update job",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { user } = await requireAuth();
    const jobId = params.id;

    // Check if job exists
    const job = await prisma.jobListing.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Check permission to delete
    if (
      user.role !== "SUPERADMIN" &&
      job.createdBy !== user.id! &&
      (job.companyId !== user.companyId || !user.companyId)
    ) {
      return NextResponse.json(
        { error: "You don't have permission to delete this job" },
        { status: 403 },
      );
    }

    // Delete job
    await prisma.jobListing.delete({
      where: { id: jobId },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to delete job",
      },
      { status: 500 },
    );
  }
}
