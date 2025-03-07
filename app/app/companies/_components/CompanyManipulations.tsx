"use client";

import { useState } from "react";

import { createCompany, updateCompany } from "@/actions/admin.actions";
import { zodResolver } from "@hookform/resolvers/zod";
import type { User } from "next-auth";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import * as z from "zod";

import { LoaderButton } from "@/components/global/LoaderButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { getQueryClient } from "@/lib/getQueryClient";

// Define the form schema with Zod
export const NewCompanyDataSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  allowedDocsPerUsers: z
    .number()
    .min(1, "Must allow at least 1 document per user")
    .max(100, "Cannot allow more than 100 documents per user")
    .default(5),
});

// Define a type that can be either a new company or an existing company
export type NewCompanyData = z.infer<typeof NewCompanyDataSchema>;
export type CompanyData = NewCompanyData & { id: string };

interface CompanyManipulationsProps {
  sessionUser: User;
  companyToEdit?: CompanyData;
  isOpenExternal?: boolean;
  onOpenChangeExternal?: (open: boolean) => void;
}

export default function CompanyManipulations({
  sessionUser,
  companyToEdit,
  isOpenExternal,
  onOpenChangeExternal,
}: CompanyManipulationsProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpenInternal, setIsOpenInternal] = useState(false);

  // Only create the query client once the dialog is actually open
  const queryClient = getQueryClient();

  // Initialize the form with react-hook-form
  const form = useForm<NewCompanyData>({
    resolver: zodResolver(NewCompanyDataSchema),
    defaultValues: {
      name: companyToEdit?.name || "",
      allowedDocsPerUsers: companyToEdit?.allowedDocsPerUsers || 5,
    },
  });

  // Handle form submission
  const onSubmit = async (data: NewCompanyData) => {
    setIsSubmitting(true);
    try {
      if (companyToEdit) {
        await updateCompany(companyToEdit.id, data, sessionUser);
        toast.success("Company updated successfully!");
      } else {
        await createCompany(data);
        toast.success("Company created successfully!");
      }

      queryClient.invalidateQueries({ queryKey: ["companies"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });

      form.reset();
      if (onOpenChangeExternal) {
        onOpenChangeExternal(false);
      }
    } catch (error) {
      console.error("Error creating or editing company:", error);
      toast.error("Error processing company. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={isOpenExternal !== undefined ? isOpenExternal : isOpenInternal}
      onOpenChange={(open) => {
        if (onOpenChangeExternal) {
          onOpenChangeExternal(open);
        } else {
          setIsOpenInternal(open);
        }
      }}
    >
      {!companyToEdit && (
        <DialogTrigger asChild>
          <Button effect="shineHover">
            {companyToEdit ? "Edit Company" : "New Company"}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {companyToEdit ? "Edit Company" : "Create New Company"}
          </DialogTitle>
          <DialogDescription>
            {companyToEdit
              ? "Edit an existing company details"
              : "Add a new company to the system"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Company Name"
                      autoFocus={false}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="allowedDocsPerUsers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Documents Allowed Per User</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter number of allowed documents per user"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === "" ? "" : parseInt(value));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <LoaderButton
              type="submit"
              className="w-full"
              isLoading={isSubmitting}
            >
              {isSubmitting
                ? "Processing..."
                : companyToEdit
                  ? "Update Company"
                  : "Create Company"}
            </LoaderButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
