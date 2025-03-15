"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { updateApplicationStatus } from "@/actions/job.actions";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft, FileText } from "lucide-react";
import { toast } from "react-hot-toast";

import { LoaderButton } from "@/components/global/LoaderButton";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  // DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  candidateId: string;
  status: string;
  createdAt: string;
  notes: string | null;
  candidate: {
    name: string;
    email: string;
  };
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

export default function ApplicationsManager({ jobId }: { jobId: string }) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const [isCVDialogOpen, setIsCVDialogOpen] = useState(false);
  const [cvContent, setCvContent] = useState("");
  const [isCVLoading, setIsCVLoading] = useState(false);

  useEffect(() => {
    async function fetchApplications() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/jobs/${jobId}/applications`);

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setApplications(data.applications);
      } catch (error: unknown) {
        setError(
          error instanceof Error
            ? error.message
            : "Unsuccessful! Tailored CV could not be created.",
        );
        console.error("Error fetching applications:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchApplications();
  }, [jobId]);

  const handleUpdateStatus = async () => {
    if (!selectedApplication || !newStatus) return;

    try {
      setIsUpdatingStatus(true);

      const result = await updateApplicationStatus({
        applicationId: selectedApplication.id,
        status: newStatus,
      });

      if (result.success) {
        // Update local state to reflect the change
        setApplications(
          applications.map((app) =>
            app.id === selectedApplication.id
              ? { ...app, status: newStatus }
              : app,
          ),
        );

        toast.success(result.message);
        setIsStatusDialogOpen(false);
      } else {
        toast.error(result.message);
      }
    } catch (error: unknown) {
      if (error) {
        return (
          <ErrorFallback
            error={
              new Error(
                typeof error === "string"
                  ? error
                  : "Failed to load applications",
              )
            }
          />
        );
      }
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const fetchCVContent = async (cvId: string) => {
    try {
      setIsCVLoading(true);
      const response = await fetch(`/api/docs/${cvId}`);

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();

      // Convert markdown to HTML (you would need a markdown parser here)
      // For now, just displaying content with line breaks
      setCvContent(data.content.replace(/\n/g, "<br>"));
    } catch (error) {
      console.error("Error fetching CV content:", error);
      setCvContent("<p>Error loading CV content</p>");
    } finally {
      setIsCVLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="mb-6 h-10 w-1/4 animate-pulse rounded bg-muted"></div>
        <div className="space-y-2">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="h-16 animate-pulse rounded bg-muted"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorFallback error={new Error(error)} />;
  }

  if (applications.length === 0) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" asChild className="pl-0">
          <Link href={`/app/jobs/${jobId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Job
          </Link>
        </Button>
        <NoDataFallback />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" asChild className="pl-0">
        <Link href={`/app/jobs/${jobId}`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Job
        </Link>
      </Button>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Candidate</TableHead>
              <TableHead>Applied</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Resume</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((application) => (
              <TableRow key={application.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">
                      {application.candidate.name || "Anonymous"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {application.candidate.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(application.createdAt), {
                    addSuffix: true,
                  })}
                </TableCell>
                <TableCell>
                  <Badge
                    className={`${applicationStatusColors[application.status] || "bg-gray-500"} text-white`}
                  >
                    {application.status.replace(/_/g, " ")}
                  </Badge>
                </TableCell>
                <TableCell>
                  {application.tailoredCV ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        fetchCVContent(application.tailoredCV!.id);
                        setIsCVDialogOpen(true);
                      }}
                    >
                      <FileText className="mr-1 h-4 w-4" />
                      View CV
                    </Button>
                  ) : (
                    <span className="text-sm text-muted-foreground">No CV</span>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedApplication(application);
                      setNewStatus(application.status);
                      setIsStatusDialogOpen(true);
                    }}
                  >
                    Update Status
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Status Update Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Application Status</DialogTitle>
            <DialogDescription>
              Change the status of this application.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Candidate</label>
              <div className="rounded-md bg-muted px-3 py-2">
                {selectedApplication?.candidate.name} (
                {selectedApplication?.candidate.email})
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Current Status</label>
              <div className="rounded-md bg-muted px-3 py-2">
                {selectedApplication?.status.replace(/_/g, " ")}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">New Status</label>
              <Select
                defaultValue={selectedApplication?.status}
                onValueChange={setNewStatus}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SUBMITTED">Submitted</SelectItem>
                  <SelectItem value="REVIEWING">Reviewing</SelectItem>
                  <SelectItem value="INTERVIEW">Interview</SelectItem>
                  <SelectItem value="OFFER">Offer</SelectItem>
                  <SelectItem value="HIRED">Hired</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                  <SelectItem value="WITHDRAWN">Withdrawn</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsStatusDialogOpen(false)}
            >
              Cancel
            </Button>
            <LoaderButton
              isLoading={isUpdatingStatus}
              onClick={handleUpdateStatus}
            >
              Update Status
            </LoaderButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CV View Dialog */}
      <Dialog open={isCVDialogOpen} onOpenChange={setIsCVDialogOpen}>
        <DialogContent className="max-h-[80vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Candidate CV</DialogTitle>
          </DialogHeader>

          {isCVLoading ? (
            <div className="flex justify-center p-8">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="prose dark:prose-invert max-w-none p-4">
              <div dangerouslySetInnerHTML={{ __html: cvContent }} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
