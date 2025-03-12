"use client";

import { useState } from "react";

import { editTemplate } from "@/actions/admin.actions";
import { useCompaniesQuery } from "@/actions/queries/admin.queries";
import { zodResolver } from "@hookform/resolvers/zod";
import type { User } from "next-auth";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import * as z from "zod";

import { LoaderButton } from "@/components/global/LoaderButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { getQueryClient } from "@/lib/getQueryClient";

interface Template {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  company: {
    id: string;
    name: string;
  };
}

const EditTemplateSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Template name must be at least 2 characters." }),
  companyId: z.string().optional(),
});

type EditTemplateData = z.infer<typeof EditTemplateSchema>;

interface EditTemplateProps {
  template: Template;
  sessionUser: User;
  isOpenExternal: boolean;
  onOpenChangeExternal: (open: boolean) => void;
}

export default function EditTemplate({
  template,
  sessionUser,
  isOpenExternal,
  onOpenChangeExternal,
}: EditTemplateProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = getQueryClient();

  // Determine if the current user is a super admin
  const isSuperAdmin = sessionUser?.role === "SUPERADMIN";

  // Only fetch companies data when the dialog is open AND the user is a superadmin
  const {
    data: companies = [],
    error: companiesError,
    isLoading: isLoadingCompanies,
  } = useCompaniesQuery(sessionUser, {
    enabled: isOpenExternal && isSuperAdmin,
  });

  const form = useForm<EditTemplateData>({
    resolver: zodResolver(EditTemplateSchema),
    defaultValues: {
      name: template.name,
      companyId: template.company.id,
    },
  });

  const onSubmit = async (data: EditTemplateData) => {
    setIsSubmitting(true);
    try {
      const result = await editTemplate(template.id, data, sessionUser);

      if (!result.success) {
        throw new Error(result.message);
      }

      queryClient.invalidateQueries({ queryKey: ["templates"] });
      toast.success(result.message);
      onOpenChangeExternal(false);
    } catch (error) {
      console.error("Error updating template:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update template. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpenExternal} onOpenChange={onOpenChangeExternal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Template</DialogTitle>
          <DialogDescription>
            Make changes to your template here. Click save when you&apos;re
            done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Template Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isSuperAdmin && (
              <FormField
                control={form.control}
                name="companyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a company" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isLoadingCompanies ? (
                          <SelectItem value="loading">
                            Loading companies...
                          </SelectItem>
                        ) : companiesError ? (
                          <SelectItem value="error">
                            Error loading companies
                          </SelectItem>
                        ) : (
                          companies.map((company) => (
                            <SelectItem key={company.id} value={company.id}>
                              {company.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <LoaderButton
              type="submit"
              className="w-full"
              isLoading={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save changes"}
            </LoaderButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
