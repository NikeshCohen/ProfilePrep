import { Metadata } from "next";
import { notFound } from "next/navigation";

import JobDetails from "@/app/app/jobs/[id]/_components/JobDetails";
import prisma from "@/prisma/prisma";

import { requireAuth } from "@/lib/utils";

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const job = await prisma.jobListing.findUnique({
      where: { id: params.id },
      include: {
        company: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!job) {
      return {
        title: "Job Not Found",
      };
    }

    return {
      title: `${job.title} | ProfilePrep Jobs`,
      description: job.description.substring(0, 155),
    };
  } catch (error) {
    console.log("Error: ", error);
    return {
      title: "Job Details",
    };
  }
}

export default async function JobPage({ params }: Props) {
  const { user } = await requireAuth("/app/jobs");

  // Fetch job details from database
  const job = await prisma.jobListing.findUnique({
    where: { id: params.id },
    include: {
      company: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!job) {
    notFound();
  }

  // Ensure salaryRange is a string and createdAt is a string
  const jobWithFormattedFields = {
    ...job,
    salaryRange: job.salaryRange || "", // Default to an empty string if null
    createdAt: job.createdAt.toISOString(), // Convert Date to string
  };

  // Check if user has already applied
  const existingApplication = await prisma.jobApplication.findFirst({
    where: {
      jobListingId: job.id,
      candidateId: user.id!,
    },
  });

  // For recruiters, check if they own the job or belong to the company
  const canManageJob =
    user.role === "SUPERADMIN" ||
    job.createdBy === user.id! ||
    (job.companyId && job.companyId === user.companyId);

  return (
    <section className="layout min-h-[93vh] pt-32">
      <JobDetails
        job={jobWithFormattedFields}
        userId={user.id!}
        userRole={user.role}
        hasApplied={!!existingApplication}
        canManageJob={!!canManageJob}
      />
    </section>
  );
}
