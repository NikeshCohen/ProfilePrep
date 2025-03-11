"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { useDocContentQuery } from "@/actions/queries/user.queries";
import { deleteDoc } from "@/actions/user.actions";
import { MoreHorizontal } from "lucide-react";
import { toast } from "react-hot-toast";

import { LoaderButton } from "@/components/global/LoaderButton";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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

import { getQueryClient } from "@/lib/getQueryClient";
import { MdToPdf } from "@/lib/utils";

interface DocContextMenuProps {
  docId: string;
  notes: string;
}

const DocContextMenu = ({ docId, notes }: DocContextMenuProps) => {
  const queryClient = getQueryClient();
  const { refetch: fetchContent } = useDocContentQuery(docId, false);

  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteDoc(docId);
      if (result.success) {
        toast.success("Document deleted successfully");
        router.refresh();
        setIsDeleteOpen(false);

        queryClient.invalidateQueries({ queryKey: ["userDocs"] });
        queryClient.invalidateQueries({ queryKey: ["allUserDocs"] });
      } else {
        toast.error("Failed to delete document");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Error deleting document");
    } finally {
      setIsDeleting(false);
    }
  };

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
          <DropdownMenuItem
            onSelect={() => setIsDeleteOpen(true)}
            className="text-red-600 focus:text-red-600"
          >
            Delete
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

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              document.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting} autoFocus={false}>
              Cancel
            </AlertDialogCancel>
            <LoaderButton
              onClick={handleDelete}
              isLoading={isDeleting}
              variant="destructive"
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </LoaderButton>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DocContextMenu;
