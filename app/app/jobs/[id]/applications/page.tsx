import { notFound, redirect } from "next/navigation";
import { Metadata } from "next";

import prisma from "@/prisma/prisma";

import { requireAuth } from "@/lib/utils";
import ApplicationsManager from "@/app/app/jobs/[id]/applications/_components/ApplicationsManager";

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const job = await prisma.jobListing.findUnique({
      where: { id: params.id },
    });

    if (!job) {
      return {
        title: "Applications - Job Not Found",
      };
    }

    return {
      title: `Applications for ${job.title}`,
    };
  } catch (error) {
    console.log(error);

    return {
      title: "Job Applications",
    };
  }
}

export default async function JobApplicationsPage({ params }: Props) {
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

  // Check if user has permission to view applications
  const hasPermission = user.role === "SUPERADMIN" || 
                        job.createdBy === user.id! || 
                        (job.companyId && job.companyId === user.companyId);
  
  if (!hasPermission) {
    redirect("/app/jobs");
  }
  
  return (
    <section className="layout min-h-[93vh] pt-32">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-wider">Applications</h1>
        <p className="text-muted-foreground mt-2">
          {job.title} - {job.company?.name || "Direct Listing"}
        </p>
      </div>

      <ApplicationsManager jobId={job.id} />
    </section>
  );
} 