"use client";

import { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { applyToJob } from "@/actions/candidate.actions";
import { updateJobStatus } from "@/actions/job.actions";
import { CandidateData } from "@/types";
import { formatDistanceToNow } from "date-fns";
import {
  ArrowLeft,
  Building,
  Calendar,
  CreditCard,
  FileText,
  MapPin,
  Users,
} from "lucide-react";
import { toast } from "react-hot-toast";

import { LoaderButton } from "@/components/global/LoaderButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

type JobDetailsProps = {
  job: {
    id: string;
    title: string;
    description: string;
    location: string | null;
    salaryRange: string;
    skills: string[];
    status: string;
    createdAt: string;
    company: {
      id: string;
      name: string;
    } | null;
  };
  userId: string;
  userRole: string;
  hasApplied: boolean;
  canManageJob: boolean;
};

export default function JobDetails({
  job,
  // userId,
  userRole,
  hasApplied,
  canManageJob,
}: JobDetailsProps) {
  const router = useRouter();
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [selectedCvId, setSelectedCvId] = useState("");
  const [coverNote, setCoverNote] = useState("");
  const [userCVs, setUserCVs] = useState<CandidateData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCVsLoading, setIsCVsLoading] = useState(false);
  // const [selectedStatus, setSelectedStatus] = useState(job.status);
  // const [isStatusUpdateLoading, setIsStatusUpdateLoading] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [customStatus, setCustomStatus] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const fetchUserCVs = async () => {
    setIsCVsLoading(true);
    try {
      const response = await fetch("/api/candidate/cvs");
      if (response.ok) {
        const data = await response.json();
        setUserCVs(data.cvs);
      }
    } catch (error) {
      console.error("Error fetching user CVs:", error);
      toast.error("Failed to load your CVs");
    } finally {
      setIsCVsLoading(false);
    }
  };

  const handleApply = async () => {
    if (!selectedCvId) {
      toast.error("Please select a CV");
      return;
    }

    setIsLoading(true);
    try {
      const result = await applyToJob({
        jobId: job.id,
        cvId: selectedCvId,
        coverNote: coverNote,
      });

      if (result.success) {
        toast.success("Application submitted successfully");
        setIsApplyDialogOpen(false);
        router.refresh();
      } else {
        toast.error(result.message || "Failed to submit application");
      }
    } catch (error: unknown) {
      console.error("Error applying for job:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to apply for job",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // const handleStatusUpdate = async () => {
  //   setIsStatusUpdateLoading(true);
  //   try {
  //     const result = await updateJobStatus({
  //       jobId: job.id,
  //       status: selectedStatus,
  //     });

  //     if (result.success) {
  //       toast.success("Job status updated successfully");
  //       setIsStatusDialogOpen(false);
  //       router.refresh();
  //     } else {
  //       toast.error(result.message || "Failed to update job status");
  //     }
  //   } catch (error: unknown) {
  //     toast.error(error.message || "An error occurred");
  //   } finally {
  //     setIsStatusUpdateLoading(false);
  //   }
  // };

  const handleUpdateStatus = async () => {
    setIsUpdatingStatus(true);
    try {
      const result = await updateJobStatus({
        jobId: job.id,
        status: newStatus,
      });

      if (result.success) {
        toast.success(result.message);
        setIsStatusDialogOpen(false);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (error: unknown) {
      console.error("Error handling job update:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update status",
      );
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <Button
          variant="ghost"
          size="sm"
          className="self-start"
          onClick={() => router.push("/app/jobs")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Jobs
        </Button>

        <div className="flex items-center space-x-3">
          {userRole === "CANDIDATE" || userRole === "USER" ? (
            <>
              {hasApplied ? (
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                >
                  Applied
                </Badge>
              ) : (
                <Dialog
                  open={isApplyDialogOpen}
                  onOpenChange={setIsApplyDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button onClick={fetchUserCVs}>Apply Now</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Apply for {job.title}</DialogTitle>
                      <DialogDescription>
                        Select the CV you want to use for this application
                      </DialogDescription>
                    </DialogHeader>

                    {isCVsLoading ? (
                      <div className="flex justify-center p-8">
                        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
                      </div>
                    ) : userCVs.length === 0 ? (
                      <div className="py-6 text-center">
                        <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                        <h3 className="mt-2 font-medium">No CVs Available</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          You need to create at least one CV before applying
                        </p>
                        <Button className="mt-4" asChild>
                          <Link href="/app/candidate?tab=tailor">
                            Create a CV
                          </Link>
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label
                              htmlFor="cv-select"
                              className="text-sm font-medium"
                            >
                              Select CV
                            </label>
                            <Select
                              onValueChange={setSelectedCvId}
                              defaultValue={selectedCvId}
                            >
                              <SelectTrigger id="cv-select">
                                <SelectValue placeholder="Select a CV" />
                              </SelectTrigger>
                              <SelectContent>
                                {userCVs.map((cv) =>
                                  cv ? (
                                    <SelectItem
                                      key={cv.name}
                                      value={String(cv.name)}
                                    >
                                      {cv.documentTitle}
                                    </SelectItem>
                                  ) : null,
                                )}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <label
                              htmlFor="cover-note"
                              className="text-sm font-medium"
                            >
                              Cover Note (Optional)
                            </label>
                            <Textarea
                              id="cover-note"
                              placeholder="Add a brief note to the recruiter..."
                              value={coverNote}
                              onChange={(e) => setCoverNote(e.target.value)}
                              rows={4}
                            />
                          </div>
                        </div>

                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setIsApplyDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <LoaderButton
                            onClick={handleApply}
                            isLoading={isLoading}
                            disabled={!selectedCvId || isLoading}
                          >
                            Submit Application
                          </LoaderButton>
                        </DialogFooter>
                      </>
                    )}
                  </DialogContent>
                </Dialog>
              )}
            </>
          ) : (
            canManageJob && (
              <>
                <Button asChild>
                  <Link href={`/app/jobs/${job.id}/applications`}>
                    <Users className="mr-2 h-4 w-4" />
                    View Applications
                  </Link>
                </Button>

                <Dialog
                  open={isStatusDialogOpen}
                  onOpenChange={setIsStatusDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      Update Job Status
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Update Job Status</DialogTitle>
                      <DialogDescription>
                        Change the status of this job listing.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Current Status
                        </label>
                        <div className="rounded-md bg-muted px-3 py-2">
                          {job.status}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          New Status
                        </label>
                        <Select
                          defaultValue={job.status}
                          onValueChange={(value) => setNewStatus(value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="OPEN">Open</SelectItem>
                            <SelectItem value="FILLED">Filled</SelectItem>
                            <SelectItem value="CLOSED">Closed</SelectItem>
                            <SelectItem value="EXTERNAL_FILL">
                              Filled Externally
                            </SelectItem>
                            <SelectItem value="CUSTOM">
                              Custom Status
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {newStatus === "CUSTOM" && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Custom Status
                          </label>
                          <input
                            type="text"
                            className="w-full rounded-md border p-2"
                            placeholder="Enter custom status"
                            value={customStatus}
                            onChange={(e) => setCustomStatus(e.target.value)}
                          />
                        </div>
                      )}
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
              </>
            )
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div>
            <h1 className="text-3xl font-bold">{job.title}</h1>

            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
              {job.company && (
                <div className="flex items-center text-muted-foreground">
                  <Building className="mr-2 h-4 w-4" />
                  <span>{job.company.name}</span>
                </div>
              )}

              <div className="flex items-center text-muted-foreground">
                <MapPin className="mr-2 h-4 w-4" />
                <span>{job.location || "Remote"}</span>
              </div>

              {job.salaryRange && (
                <div className="flex items-center text-muted-foreground">
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>{job.salaryRange}</span>
                </div>
              )}

              <div className="flex items-center text-muted-foreground">
                <Calendar className="mr-2 h-4 w-4" />
                <span>
                  Posted{" "}
                  {formatDistanceToNow(new Date(job.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {job.skills.map((skill, i) => (
                <Badge key={i} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Job Description</h2>
            <div className="prose dark:prose-invert max-w-none">
              <p className="whitespace-pre-line">{job.description}</p>
            </div>
          </div>
        </div>

        <div>
          <Card>
            <CardContent className="pt-6">
              <h3 className="mb-4 font-semibold">Quick Apply</h3>

              {userRole === "CANDIDATE" || userRole === "USER" ? (
                <>
                  {hasApplied ? (
                    <div className="py-4 text-center">
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                      >
                        You&apos;ve already applied
                      </Badge>
                      <p className="mt-2 text-sm text-muted-foreground">
                        You can check your application status in your dashboard
                      </p>
                      <Button className="mt-4" variant="outline" asChild>
                        <Link href="/app/candidate?tab=applications">
                          View Your Applications
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Get started with your application by selecting a
                        tailored CV that matches this role.
                      </p>
                      <Button
                        className="w-full"
                        onClick={() => {
                          fetchUserCVs();
                          setIsApplyDialogOpen(true);
                        }}
                      >
                        Apply Now
                      </Button>
                      <Separator />
                      <div className="text-center">
                        <p className="mb-2 text-sm text-muted-foreground">
                          Don&apos;t have a tailored CV yet?
                        </p>
                        <Button variant="outline" asChild>
                          <Link href={`/app/candidate/tailor?jobId=${job.id}`}>
                            Create Tailored CV
                          </Link>
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="py-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    You&apos;re viewing this job as a recruiter.
                  </p>

                  {canManageJob && (
                    <div className="mt-4 space-y-2">
                      <Button className="w-full" asChild>
                        <Link href={`/app/jobs/${job.id}/applications`}>
                          <Users className="mr-2 h-4 w-4" />
                          View Applications
                        </Link>
                      </Button>

                      <Dialog
                        open={isStatusDialogOpen}
                        onOpenChange={setIsStatusDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Button variant="outline" className="w-full">
                            Update Job Status
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Update Job Status</DialogTitle>
                            <DialogDescription>
                              Change the status of this job listing.
                            </DialogDescription>
                          </DialogHeader>

                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">
                                Current Status
                              </label>
                              <div className="rounded-md bg-muted px-3 py-2">
                                {job.status}
                              </div>
                            </div>

                            <div className="space-y-2">
                              <label className="text-sm font-medium">
                                New Status
                              </label>
                              <Select
                                defaultValue={job.status}
                                onValueChange={(value) => setNewStatus(value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="OPEN">Open</SelectItem>
                                  <SelectItem value="FILLED">Filled</SelectItem>
                                  <SelectItem value="CLOSED">Closed</SelectItem>
                                  <SelectItem value="EXTERNAL_FILL">
                                    Filled Externally
                                  </SelectItem>
                                  <SelectItem value="CUSTOM">
                                    Custom Status
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            {newStatus === "CUSTOM" && (
                              <div className="space-y-2">
                                <label className="text-sm font-medium">
                                  Custom Status
                                </label>
                                <input
                                  type="text"
                                  className="w-full rounded-md border p-2"
                                  placeholder="Enter custom status"
                                  value={customStatus}
                                  onChange={(e) =>
                                    setCustomStatus(e.target.value)
                                  }
                                />
                              </div>
                            )}
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
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
