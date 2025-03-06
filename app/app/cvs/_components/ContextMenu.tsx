"use client";

import { useState } from "react";

import { useDocContentQuery } from "@/actions/queries/user.queries";
import { MoreHorizontal } from "lucide-react";
import { toast } from "react-hot-toast";

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

import { MdToPdf } from "@/lib/utils";

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

export default DocContextMenu;
