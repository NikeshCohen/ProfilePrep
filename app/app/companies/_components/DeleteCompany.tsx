"use client";

import { useState } from "react";

import { deleteCompany } from "@/actions/admin.actions";
import { Prisma } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { User } from "next-auth";
import toast from "react-hot-toast";

import { LoaderButton } from "@/components/global/LoaderButton";
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

type CompanyWithCounts = Prisma.CompanyGetPayload<{
  include: {
    _count: {
      select: {
        users: true;
        GeneratedDocs: true;
      };
    };
  };
}>;

interface DeleteCompanyProps {
  companyData: CompanyWithCounts;
  sessionUser: User;
  isOpenExternal?: boolean;
  onOpenChangeExternal?: (open: boolean) => void;
}

export default function DeleteCompany({
  companyData,
  sessionUser,
  isOpenExternal,
  onOpenChangeExternal,
}: DeleteCompanyProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [step, setStep] = useState(1);
  const [confirmText, setConfirmText] = useState("");
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    if (confirmText !== companyData.name) {
      toast.error("Please type the company name exactly to confirm deletion");
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteCompany(companyData.id, sessionUser);

      if (!result.success) {
        throw new Error(result.message);
      }

      toast.success(result.message);
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      if (onOpenChangeExternal) {
        onOpenChangeExternal(false);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(errorMessage);
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
    if (step === 3) {
      setConfirmText("");
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-2">
            <p>
              Are you sure you want to delete{" "}
              <span className="font-bold text-primary">{companyData.name}</span>
              ? This will:
            </p>
            <ul className="list-disc pl-4">
              <li>
                Delete {companyData._count.GeneratedDocs} generated documents
              </li>
              <li>Delete {companyData._count.users} users</li>
              <li>Delete the company itself</li>
            </ul>
            <p className="font-semibold text-destructive">
              This action cannot be undone.
            </p>
          </div>
        );
      case 2:
        return (
          <div className="space-y-2">
            <p>
              You are about to permanently delete{" "}
              <span className="font-bold text-primary">{companyData.name}</span>{" "}
              and all associated data. This action will:
            </p>
            <ul className="list-disc pl-4">
              <li>Delete all generated documents</li>
              <li>Delete all user accounts</li>
              <li>Delete the company</li>
            </ul>
            <p>Are you absolutely sure you want to proceed?</p>
          </div>
        );
      case 3:
        return (
          <div className="space-y-2">
            <p className="font-semibold text-destructive">Final Confirmation</p>
            <p>
              To confirm deletion, please type the company name exactly as
              shown:
            </p>
            <p className="rounded-md bg-muted p-2 font-mono">
              {companyData.name}
            </p>
            <Input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type company name to confirm"
              className="mt-2"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <AlertDialog
      open={isOpenExternal !== undefined ? isOpenExternal : true}
      onOpenChange={(open) => {
        if (onOpenChangeExternal) {
          onOpenChangeExternal(open);
        }
      }}
    >
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Company</AlertDialogTitle>
          <AlertDialogDescription asChild>
            {renderStepContent()}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              if (step === 1) {
                if (onOpenChangeExternal) {
                  onOpenChangeExternal(false);
                }
              } else {
                handleBack();
              }
            }}
            disabled={isDeleting}
          >
            {step === 1 ? "Cancel" : "Back"}
          </Button>

          {step < 3 ? (
            <Button
              type="button"
              variant="destructive"
              onClick={handleNextStep}
              disabled={isDeleting}
            >
              Continue
            </Button>
          ) : (
            <LoaderButton
              type="button"
              variant="destructive"
              onClick={handleDelete}
              isLoading={isDeleting}
              disabled={confirmText !== companyData.name || isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Company"}
            </LoaderButton>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
