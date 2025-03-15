import { NextResponse } from "next/server";

import prisma from "@/prisma/prisma";

import { requireAuth } from "@/lib/utils";

export async function GET() {
  try {
    const { user } = await requireAuth();

    // Fetch candidate's job applications
    const applications = await prisma.jobApplication.findMany({
      where: { candidateId: user.id! },
      include: {
        jobListing: {
          select: {
            id: true,
            title: true,
            company: {
              select: {
                name: true,
              },
            },
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
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch applications",
      },
      { status: 500 },
    );
  }
}
