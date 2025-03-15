import { NextRequest, NextResponse } from "next/server";

import prisma from "@/prisma/prisma";

import { requireAuth } from "@/lib/utils";

export async function GET(
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

    // Check permission to view applications
    if (
      user.role !== "SUPERADMIN" &&
      job.createdBy !== user.id! &&
      (job.companyId !== user.company?.id || !user.company?.id)
    ) {
      return NextResponse.json(
        {
          error: "You don't have permission to view applications for this job",
        },
        { status: 403 },
      );
    }

    // Get applications
    const applications = await prisma.jobApplication.findMany({
      where: { jobListingId: jobId },
      include: {
        candidate: {
          select: {
            name: true,
            email: true,
          },
        },
        tailoredCV: {
          select: {
            id: true,
            documentTitle: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ applications });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch applications",
      },
      { status: 500 },
    );
  }
}
