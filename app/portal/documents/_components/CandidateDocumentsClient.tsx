"use client";

import { useRecruiterDocumentsQuery } from "@/actions/queries/user.queries";
import DocContextMenu from "@/app/dashboard/cvs/_components/ContextMenu";
import { Calendar, FileText } from "lucide-react";
import { User } from "next-auth";

import { Spinner } from "@/components/global/Spinner";
import EmptyState from "@/components/shared/EmptyState";
import ErrorCard from "@/components/shared/ErrorCard";
import StatsCard from "@/components/shared/StatsCard";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CandidateDocumentsClientProps {
  user: User;
}

export default function CandidateDocumentsClient({
  user,
}: CandidateDocumentsClientProps) {
  const {
    data: documentsData,
    isLoading,
    error,
  } = useRecruiterDocumentsQuery(user.id!);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="space-y-4 text-center">
          <Spinner />
          <p className="text-muted-foreground">Loading documents...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorCard message="Failed to load documents. Please try again." />;
  }

  const documents = documentsData?.documents || [];
  const allDocs = documents;

  // Calculate current month documents for usage tracking
  const now = new Date();
  const thisMonthDocs = allDocs.filter((doc) => {
    const docDate = new Date(doc.createdAt);
    return (
      docDate.getMonth() === now.getMonth() &&
      docDate.getFullYear() === now.getFullYear()
    );
  });

  // Monthly allocation logic: remaining = allowedDocs - thisMonth's usage
  const remainingThisMonth = user.allowedDocs - thisMonthDocs.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Documents</h1>
        <p className="text-muted-foreground">
          View and manage your CV documents and analyses
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard
          title="Total Documents"
          value={allDocs.length}
          icon={FileText}
          description="All time total"
        />
        <StatsCard
          title="This Month"
          value={thisMonthDocs.length}
          icon={Calendar}
          description={`Used ${thisMonthDocs.length} of ${user.allowedDocs}`}
        />
        <StatsCard
          title="Remaining"
          value={remainingThisMonth}
          icon={FileText}
          description="Available this month"
        />
      </div>

      {/* Documents List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Documents</CardTitle>
          <CardDescription>
            Your recently generated CV documents and analyses
          </CardDescription>
        </CardHeader>
        <CardContent>
          {allDocs.length > 0 ? (
            <div className="space-y-4">
              {allDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center space-x-4">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{doc.candidateName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {doc.documentTitle}
                      </p>
                      <div className="mt-1 flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {doc.company?.name || "Unknown Company"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(doc.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-end">
                    <DocContextMenu docId={doc.id} notes={doc.notes || ""} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={FileText}
              title="No documents yet"
              description="Start generating CV documents to see them here"
              action={{
                label: "Generate Your First Document",
                href: "/app",
              }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
