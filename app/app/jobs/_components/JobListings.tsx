"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { Building, CreditCard, MapPin, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

type JobListing = {
  id: string;
  title: string;
  description: string;
  location: string;
  salaryRange: string;
  skills: string[];
  status: string;
  createdAt: string;
  company: {
    name: string;
  } | null;
};

export default function JobListings({
  userId,
  userRole,
}: {
  userId: string;
  userRole: string;
}) {
  console.log(`User: ${userId} - ${userRole}`);

  const router = useRouter();
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchJobs() {
      try {
        const response = await fetch("/api/jobs");

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        // Filter only open jobs for display
        const openJobs = data.jobs.filter(
          (job: JobListing) => job.status === "OPEN",
        );
        setJobs(openJobs);
        setFilteredJobs(openJobs);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchJobs();
  }, []);

  useEffect(() => {
    // Filter jobs based on search term
    if (searchTerm.trim() === "") {
      setFilteredJobs(jobs);
      return;
    }

    const searchTermLower = searchTerm.toLowerCase();
    const filtered = jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(searchTermLower) ||
        job.description.toLowerCase().includes(searchTermLower) ||
        job.location.toLowerCase().includes(searchTermLower) ||
        job.skills.some((skill) =>
          skill.toLowerCase().includes(searchTermLower),
        ) ||
        (job.company?.name &&
          job.company.name.toLowerCase().includes(searchTermLower)),
    );

    setFilteredJobs(filtered);
  }, [searchTerm, jobs]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader>
              <Skeleton className="h-6 w-full" />
              <Skeleton className="mt-2 h-4 w-3/4" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            </CardContent>
            <CardFooter>
              <Skeleton className="h-9 w-full rounded" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative mx-auto mb-8 max-w-md">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-muted-foreground" />
        <Input
          placeholder="Search jobs by title, skills, location..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredJobs.length === 0 && (
        <div className="py-12 text-center">
          <h3 className="text-xl font-medium">No job listings found</h3>
          <p className="mt-2 text-muted-foreground">
            Try adjusting your search criteria
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredJobs.map((job) => (
          <Card key={job.id} className="overflow-hidden">
            <CardHeader>
              <CardTitle className="line-clamp-2">{job.title}</CardTitle>
              <div className="mt-1 flex items-center text-sm text-muted-foreground">
                <Building className="mr-1 h-4 w-4" />
                <span>{job.company?.name || "Direct Listing"}</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex flex-col space-y-2 text-sm">
                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{job.location || "Remote"}</span>
                </div>
                {job.salaryRange && (
                  <div className="flex items-center">
                    <CreditCard className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{job.salaryRange}</span>
                  </div>
                )}
              </div>

              <p className="mb-3 line-clamp-3 text-sm text-muted-foreground">
                {job.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {job.skills.slice(0, 3).map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
                {job.skills.length > 3 && (
                  <Badge variant="outline">+{job.skills.length - 3}</Badge>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => router.push(`/app/jobs/${job.id}`)}
              >
                View Details
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
