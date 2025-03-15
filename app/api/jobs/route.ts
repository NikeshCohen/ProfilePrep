import { NextRequest, NextResponse } from "next/server";

import prisma from "@/prisma/prisma";

import { requireAuth } from "@/lib/utils";

export async function GET() {
  try {
    // No auth check here as we want both candidates and recruiters to view jobs

    // Get job listings
    const jobs = await prisma.jobListing.findMany({
      include: {
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

    return NextResponse.json({ jobs });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch job listings",
      },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { user } = await requireAuth();

    if (
      user.role !== "ADMIN" &&
      user.role !== "SUPERADMIN" &&
      user.role !== "USER"
    ) {
      return NextResponse.json(
        { error: "Unauthorized. Only recruiters can create job listings." },
        { status: 403 },
      );
    }

    const data = await req.json();

    const { title, description, location, salaryRange, skills } = data;

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 },
      );
    }

    const job = await prisma.jobListing.create({
      data: {
        title,
        description,
        location: location || "",
        salaryRange: salaryRange || "",
        skills: Array.isArray(skills) ? skills : [],
        createdBy: user.id!,
        companyId: user.companyId || null,
        status: "OPEN",
      },
    });

    return NextResponse.json({ job });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to create job listing",
      },
      { status: 500 },
    );
  }
}
