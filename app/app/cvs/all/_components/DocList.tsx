"use client";

import { useState } from "react";

import { useAdminDocsQuery } from "@/actions/queries/admin.queries";
import { useDocContentQuery } from "@/actions/queries/user.queries";
import { formatDistanceToNow } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import { User } from "next-auth";
import { toast } from "react-hot-toast";

import {
  ErrorFallback,
  NoDataFallback,
} from "@/components/global/QueryFallbacks";
import TruncatedText from "@/components/global/TuncateText";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { MdToPdf } from "@/lib/utils";

import Skeleton from "./Skeleton";

interface GeneratedDocsListProps {
  sessionUser: User;
}

const GeneratedDocsList = ({ sessionUser }: GeneratedDocsListProps) => {
  const { data, error, isLoading } = useAdminDocsQuery(sessionUser);

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorFallback error={error} />;
  if (!data?.success || !data.docInfo?.length) return <NoDataFallback />;

  return (
    <div className="rounded-md border bg-background/30">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>User Email</TableHead>
            <TableHead>Candidate</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.docInfo!.map((doc) => (
            <TableRow key={doc.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={doc.user?.image || "/user.jpg"}
                      alt={doc.user?.name || doc.user?.email.split("@")[0]}
                    />
                    <AvatarFallback>
                      {doc.user?.name?.charAt(0) ||
                        doc.user?.email.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span>
                      {doc.user?.name || doc.user?.email.split("@")[0]}
                    </span>
                    <span className="text-muted-foreground">
                      {doc.company?.name || "No company"}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <TruncatedText text={doc.user?.email ?? ""} />
              </TableCell>
              <TableCell className="font-medium">
                <TruncatedText text={doc.candidateName} limit={40} />
              </TableCell>
              <TableCell>
                <TruncatedText text={doc.location} />
              </TableCell>
              <TableCell>
                {formatDistanceToNow(new Date(doc.createdAt), {
                  addSuffix: true,
                })}
              </TableCell>
              <TableCell>
                <DocContextMenu docId={doc.id} notes={doc.notes} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

interface DocContextMenuProps {
  docId: string;
  notes: string;
}

const DocContextMenu = ({ docId, notes }: DocContextMenuProps) => {
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const { refetch: fetchContent } = useDocContentQuery(docId, false);

  const handleDownload = async () => {
    setIsDownloading(true);
    const loadingToast = toast.loading("Fetching document...");

    try {
      const result = await fetchContent();
      if (result.data?.success) {
        console.log("Document content:", result.data.docContent);
        toast.success("Document fetched successfully");
      } else {
        toast.error("Failed to fetch document");
      }

      if (
        result.data?.docContent?.content &&
        result.data?.docContent?.documentTitle
      ) {
        MdToPdf(
          result.data.docContent.content,
          result.data.docContent.documentTitle,
        );
      } else {
        toast.error("Invalid document data");
      }
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Error downloading document");
    } finally {
      toast.dismiss(loadingToast);
      setIsDownloading(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => setIsNotesOpen(true)}>
            Notes
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDownload} disabled={isDownloading}>
            Download
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isNotesOpen} onOpenChange={setIsNotesOpen}>
        <DialogContent className="p-6 sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Notes</DialogTitle>
          </DialogHeader>

          <div className="max-h-[60vh] overflow-y-auto whitespace-pre-wrap pr-2 text-sm leading-relaxed text-muted-foreground">
            {notes}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GeneratedDocsList;
