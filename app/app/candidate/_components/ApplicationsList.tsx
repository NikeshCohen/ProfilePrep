"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { formatDistanceToNow } from "date-fns";
import { Eye, FileText } from "lucide-react";

import {
  ErrorFallback,
  NoDataFallback,
} from "@/components/global/QueryFallbacks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Application = {
  id: string;
  jobListing: {
    id: string;
    title: string;
    company: {
      name: string;
    } | null;
  };
  status: string;
  createdAt: string;
  tailoredCV: {
    id: string;
    documentTitle: string;
  } | null;
};

const applicationStatusColors: Record<string, string> = {
  SUBMITTED: "bg-blue-500",
  REVIEWING: "bg-yellow-500",
  INTERVIEW: "bg-purple-500",
  OFFER: "bg-green-500",
  HIRED: "bg-emerald-600",
  REJECTED: "bg-red-500",
  WITHDRAWN: "bg-gray-500",
};

export default function ApplicationsList({ userId }: { userId: string }) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedCV, setSelectedCV] = useState<string | null>(null);
  const [cvContent, setCvContent] = useState("");
  const [isCVLoading, setIsCVLoading] = useState(false);

  useEffect(() => {
    async function fetchApplications() {
      try {
        const response = await fetch("/api/candidate/applications");

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setApplications(data.applications);
      } catch (err: unknown) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchApplications();
  }, [userId]);

  const fetchCVContent = async (cvId: string) => {
    setIsCVLoading(true);
    try {
      const response = await fetch(`/api/docs/${cvId}`);

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setCvContent(data.content);
      setSelectedCV(cvId);
    } catch (err) {
      console.error("Error fetching CV content:", err);
    } finally {
      setIsCVLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-4">
        <div className="animate-pulse space-y-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-12 rounded bg-gray-200 dark:bg-gray-700"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorFallback error={error} />;
  }

  if (!applications.length) {
    return <NoDataFallback />;
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Job Position</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Applied</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((application) => (
            <TableRow key={application.id}>
              <TableCell className="font-medium">
                {application.jobListing.title}
              </TableCell>
              <TableCell>
                {application.jobListing.company?.name || "Direct Application"}
              </TableCell>
              <TableCell>
                <Badge className={applicationStatusColors[application.status]}>
                  {application.status.replace("_", " ")}
                </Badge>
              </TableCell>
              <TableCell>
                {formatDistanceToNow(new Date(application.createdAt), {
                  addSuffix: true,
                })}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Link
                    href={`/app/jobs/${application.jobListing.id}`}
                    passHref
                  >
                    <Button variant="ghost" size="sm" asChild>
                      <div>
                        <Eye className="mr-1 h-4 w-4" />
                        <span className="sr-only">View Job</span>
                      </div>
                    </Button>
                  </Link>

                  {application.tailoredCV && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant={
                            selectedCV === application.tailoredCV!.id
                              ? "default"
                              : "ghost"
                          }
                          size="sm"
                          onClick={() =>
                            fetchCVContent(application.tailoredCV!.id)
                          }
                        >
                          <FileText className="mr-1 h-4 w-4" />
                          <span className="sr-only">View CV</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-h-[80vh] max-w-3xl overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>
                            {application.tailoredCV.documentTitle}
                          </DialogTitle>
                          <DialogDescription>
                            Tailored CV used for this application
                          </DialogDescription>
                        </DialogHeader>

                        {isCVLoading ? (
                          <div className="flex justify-center p-8">
                            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
                          </div>
                        ) : (
                          <div className="prose dark:prose-invert max-w-none p-4">
                            <div
                              dangerouslySetInnerHTML={{ __html: cvContent }}
                            />
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
