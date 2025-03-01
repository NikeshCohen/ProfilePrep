"use client";

import { useState } from "react";

import { Loader2 } from "lucide-react";
import type { User } from "next-auth";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DeleteUserProps {
  userData: User;
  sessionUser: User;
  isOpenExternal: boolean;
  onOpenChangeExternal: (open: boolean) => void;
}

const DeleteUser = ({
  userData,
  isOpenExternal,
  onOpenChangeExternal,
}: DeleteUserProps) => {
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
      // This would be replaced with your actual delete user API call
      // For example: await deleteUser(userData.id, sessionUser);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulating API call

      toast.success(
        `${userData.name || userData.email} has been successfully deleted.`,
      );
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
    <Dialog open={isOpenExternal} onOpenChange={onOpenChangeExternal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete User</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the user
            account and remove their data from our servers.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="confirmEmail" className="text-left">
              To confirm, type{" "}
              <span className="font-semibold">{userData.email}</span> below
            </Label>
            <Input
              id="confirmEmail"
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)}
              placeholder={userData.email!}
              className="col-span-3"
              autoComplete="off"
            />
          </div>
        </div>

        <DialogFooter>
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
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete User"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteUser;
