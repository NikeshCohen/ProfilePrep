import { Metadata } from "next";


import { requireAuth } from "@/lib/utils";
import JobListings from "@/app/app/jobs/_components/JobListings";
export const metadata: Metadata = {
  title: "Job Openings",
};

export default async function JobsPage() {
  const { user } = await requireAuth("/app/jobs");

  return (
    <section className="layout min-h-[93vh] pt-32">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-wider">Job Openings</h1>
        <p className="text-muted-foreground mt-2">
          Explore available positions and submit your application
        </p>
      </div>

      <JobListings userId={user.id!} userRole={user.role} />
    </section>
  );
} 