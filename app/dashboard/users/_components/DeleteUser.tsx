"use client";

import { useState } from "react";

import { deleteUser } from "@/actions/admin.actions";
import type { User } from "next-auth";
import toast from "react-hot-toast";

import { LoaderIcon } from "@/components/global/LoaderButton";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { getQueryClient } from "@/lib/getQueryClient";

interface DeleteUserProps {
  userData: User;
  sessionUser: User;
  isOpenExternal: boolean;
  onOpenChangeExternal: (open: boolean) => void;
}

const DeleteUser = ({
  userData,
  isOpenExternal,
  sessionUser,
  onOpenChangeExternal,
}: DeleteUserProps) => {
  const queryClient = getQueryClient();

  const [confirmEmail, setConfirmEmail] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirmEmail !== userData.email) {
      toast.error(
        "Please enter the correct email address to confirm deletion.",
      );
      return;
    }

    setIsDeleting(true);

    try {
      await deleteUser(userData.id!, sessionUser);

      toast.success(
        `${userData.name || userData.email} has been successfully deleted.`,
      );

      queryClient.invalidateQueries({ queryKey: ["users"] });

      onOpenChangeExternal(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An unknown error occurred",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpenExternal} onOpenChange={onOpenChangeExternal}>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete User</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the user
            account and remove their data from our servers. To confirm deletion,
            please type the users email exactly as shown:
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex flex-col gap-4">
          <p className="rounded-md bg-muted p-2 font-mono text-muted-foreground">
            {userData.email}
          </p>
          <Input
            id="confirmEmail"
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
            placeholder={userData.email!}
            className="col-span-3"
            autoComplete="off"
          />
        </div>

        <AlertDialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChangeExternal(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={confirmEmail !== userData.email || isDeleting}
          >
            {isDeleting ? (
              <>
                Deleting...
                <LoaderIcon className="h-4 w-4 animate-spin" />
              </>
            ) : (
              "Delete User"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteUser;
