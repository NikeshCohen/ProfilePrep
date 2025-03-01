"use client";

import { useState } from "react";

import { createUser, editUser } from "@/actions/admin.actions";
import { useCompaniesQuery } from "@/actions/queries/admin.queries";
import { zodResolver } from "@hookform/resolvers/zod";
import type { User } from "next-auth";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import * as z from "zod";

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
  FormDescription,
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

// Define the form schema with Zod
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  companyId: z.string().optional(),
  role: z.enum(["user", "admin", "superadmin"]),
});

// Define a type that can be either a new user or an existing user
export type NewUserData = z.infer<typeof formSchema>;
export type UserData = NewUserData & { id: string };

interface CreateUserModalProps {
  sessionUser: User;
  userToEdit?: UserData;
  isOpenExternal?: boolean;
  onOpenChangeExternal?: (open: boolean) => void;
}

export default function CreateUserModal({
  sessionUser,
  userToEdit,
  isOpenExternal,
  onOpenChangeExternal,
}: CreateUserModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  const queryClient = getQueryClient();

  // Determine if the current user is a super admin or admin
  const isSuperAdmin = sessionUser?.role === "SUPERADMIN";
  const isAdmin = sessionUser?.role === "ADMIN";

  console.log(isSuperAdmin);

  const { data: companies = [], error, isLoading } = useCompaniesQuery();

  // Initialize the form with react-hook-form
  const form = useForm<NewUserData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: userToEdit?.name || "",
      email: userToEdit?.email || "",
      companyId: isAdmin
        ? sessionUser?.company?.id
        : userToEdit?.companyId || "",
      role: userToEdit?.role || "user",
    },
  });

  // Handle form submission
  const onSubmit = async (data: NewUserData) => {
    setIsSubmitting(true);
    try {
      if (userToEdit) {
        await editUser(userToEdit.id, data);
        toast.success("User updated successfully!");
      } else {
        await createUser(data);
        toast.success("User created successfully!");
      }

      queryClient.invalidateQueries({ queryKey: ["users"] });

      form.reset();
      if (onOpenChangeExternal) {
        onOpenChangeExternal(false);
      }
    } catch (error) {
      console.error("Error creating or editing user:", error);
      toast.error("Error processing user. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={isOpenExternal || isEditModalOpen}
      onOpenChange={(open) => {
        if (onOpenChangeExternal) {
          onOpenChangeExternal(open);
        } else {
          setEditModalOpen(open);
        }
      }}
    >
      {!userToEdit && (
        <DialogTrigger asChild>
          <Button effect="shineHover">
            {userToEdit ? "Edit User" : "New User"}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {userToEdit ? "Edit User" : "Create New User"}
          </DialogTitle>
          <DialogDescription>
            {userToEdit
              ? "Edit the user details"
              : "Add a new user to the system"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isSuperAdmin && (
              <>
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
                          {isLoading ? (
                            <SelectItem value="loading">
                              Loading companies...
                            </SelectItem>
                          ) : error ? (
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

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="superadmin">
                            Super Admin
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {isAdmin && !isSuperAdmin && (
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      User will be added to your company:{" "}
                      {
                        companies.find((c) => c.id === sessionUser.company?.id)
                          ?.name
                      }
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting
                ? "Processing..."
                : userToEdit
                  ? "Update User"
                  : "Create User"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
