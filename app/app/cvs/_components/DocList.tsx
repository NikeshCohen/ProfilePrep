"use client";

import { useState } from "react";

import {
  useDocContentQuery,
  useUserDocsQuery,
} from "@/actions/queries/user.queries";
import { formatDistanceToNow } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import { toast } from "react-hot-toast";

import {
  ErrorFallback,
  NoDataFallback,
} from "@/components/global/QueryFallbacks";
import TruncatedText from "@/components/global/TuncateText";
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
  userId: string;
}

const GeneratedDocsList = ({ userId }: GeneratedDocsListProps) => {
  const { data, error, isLoading } = useUserDocsQuery(userId);

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorFallback error={error} />;
  if (!data?.success || !data.docInfo?.length) return <NoDataFallback />;

  return (
    <div className="bg-background/30 border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Candidate</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Salary</TableHead>
            <TableHead>Right to Work</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.docInfo!.map((doc) => (
            <TableRow key={doc.id}>
              <TableCell className="font-medium">
                <TruncatedText text={doc.candidateName} limit={40} />
              </TableCell>
              <TableCell>
                <TruncatedText text={doc.location} />
              </TableCell>
              <TableCell>
                <TruncatedText text={doc.salaryExpectation} />
              </TableCell>
              <TableCell>
                <TruncatedText text={doc.rightToWork} />
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
          <Button variant="ghost" className="p-0 w-8 h-8">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="w-4 h-4" />
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

          <div className="pr-2 max-h-[60vh] overflow-y-auto text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">
            {notes}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GeneratedDocsList;
