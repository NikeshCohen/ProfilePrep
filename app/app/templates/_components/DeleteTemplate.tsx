"use client";

import { useState } from "react";

import { deleteTemplate } from "@/actions/admin.actions";
import type { User } from "next-auth";
import { toast } from "react-hot-toast";

import { LoaderButton } from "@/components/global/LoaderButton";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

import { getQueryClient } from "@/lib/getQueryClient";

interface Template {
  id: string;
  name: string;
  company: {
    id: string;
    name: string;
  };
}

interface DeleteTemplateProps {
  template: Template;
  sessionUser: User;
}

export default function DeleteTemplate({
  template,
  sessionUser,
}: DeleteTemplateProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = getQueryClient();

  // Only show delete button for superadmins
  if (sessionUser.role !== "SUPERADMIN") {
    return null;
  }

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteTemplate(template.id, sessionUser);

      if (!result.success) {
        throw new Error(result.message);
      }

      queryClient.invalidateQueries({ queryKey: ["templates"] });
      toast.success(result.message);
      setIsOpen(false);
    } catch (error) {
      console.error("Error deleting template:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete template. Please try again.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()}
          className="text-destructive"
        >
          Delete
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Template</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-1">
              <p>
                Are you sure you want to delete the template{" "}
                <span className="font-bold text-primary">{template.name}</span>?
              </p>
              <p>
                This template belongs to{" "}
                <span className="font-medium">
                  &quot;{template.company.name}&quot;
                </span>
                .
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <LoaderButton
            type="button"
            variant="destructive"
            onClick={handleDelete}
            isLoading={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </LoaderButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
