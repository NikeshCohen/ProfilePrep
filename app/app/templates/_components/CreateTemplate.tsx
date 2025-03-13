"use client";

import { useRef, useState } from "react";

import { createTemplate } from "@/actions/admin.actions";
import { generateTemplate } from "@/actions/ai.actions";
import { useCompaniesQuery } from "@/actions/queries/admin.queries";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowUpIcon,
  FileIcon,
  FileText,
  FileWarningIcon,
  XCircleIcon,
} from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { getQueryClient } from "@/lib/getQueryClient";
import { extractTextFromPdf } from "@/lib/utils";

const NewTemplateSchema = z.object({
  templateName: z
    .string()
    .min(2, { message: "Template name must be at least 2 characters." }),
  companyId: z.string().optional(),
});

type NewTemplateData = z.infer<typeof NewTemplateSchema>;

type SubmissionState = "idle" | "analyzing" | "saving";

interface CreateTemplateProps {
  sessionUser: User;
}

export default function CreateTemplate({ sessionUser }: CreateTemplateProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionState, setSubmissionState] =
    useState<SubmissionState>("idle");
  const [isOpenInternal, setIsOpenInternal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState("");
  const [isDragActive, setIsDragActive] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const queryClient = getQueryClient();

  // Determine if the current user is a super admin or admin
  const isSuperAdmin = sessionUser?.role === "SUPERADMIN";
  const isAdmin = sessionUser?.role === "ADMIN";

  // Only fetch companies data when the dialog is open AND the user is a superadmin
  const {
    data: companies = [],
    error: companiesError,
    isLoading: isLoadingCompanies,
  } = useCompaniesQuery(sessionUser, {
    enabled: isOpenInternal && isSuperAdmin,
  });

  const form = useForm<NewTemplateData>({
    resolver: zodResolver(NewTemplateSchema),
    defaultValues: {
      templateName: "",
      companyId: isAdmin ? sessionUser?.company?.id : "",
    },
  });

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      validateAndSetFile(files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      validateAndSetFile(files[0]);
    }
  };

  const validateAndSetFile = async (newFile: File) => {
    setError(null);

    if (newFile.type !== "application/pdf") {
      const errorMessage = "Please upload a PDF file.";
      setError(errorMessage);
      toast.error(errorMessage);
      return;
    }
    setSelectedFile(newFile);
    await extractTextFromPdf(
      newFile,
      setIsExtracting,
      setExtractedText,
      setError,
    );
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = () => {
    setSelectedFile(null);
    setError(null);
    setExtractedText("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getSubmitButtonText = (state: SubmissionState) => {
    switch (state) {
      case "analyzing":
        return "Analysis in Progress...";
      case "saving":
        return "Saving Template...";
      default:
        return "Create Template";
    }
  };

  const onSubmit = async (data: NewTemplateData) => {
    setIsSubmitting(true);
    setSubmissionState("analyzing");

    try {
      const formattedTemplate = await generateTemplate(extractedText);

      setSubmissionState("saving");

      // Create the template using the admin action
      const result = await createTemplate(
        {
          name: data.templateName,
          templateContent: formattedTemplate,
          companyId: data.companyId || sessionUser.company?.id || "",
        },
        sessionUser,
      );

      if (!result.success) {
        throw new Error(result.message);
      }

      queryClient.invalidateQueries({ queryKey: ["templates"] });

      toast.success("Template created successfully!");
      form.reset();
      removeFile();
      setIsOpenInternal(false);
    } catch (error) {
      console.error("Error creating template:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create template. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
      setSubmissionState("idle");
    }
  };

  return (
    <Dialog open={isOpenInternal} onOpenChange={setIsOpenInternal}>
      <DialogTrigger asChild>
        <Button effect="shineHover">New Template</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>Create New Template</DialogTitle>
          <DialogDescription>
            Add a new template to the system
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="templateName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Template Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="My Template"
                      autoFocus={false}
                      {...field}
                    />
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

            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={onButtonClick}
              className={`relative min-h-[200px] rounded-md border-2 border-dashed p-8 transition-all duration-300 ease-in-out ${
                isDragActive
                  ? error
                    ? "border-destructive bg-destructive/10"
                    : "border-primary bg-primary/10"
                  : error
                    ? "hover:border-destructive hover:bg-destructive/5"
                    : "hover:border-primary hover:bg-primary/5"
              } ${isExtracting ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
            >
              <input
                title="Upload PDF File"
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleChange}
                accept=".pdf"
                disabled={isExtracting}
              />
              <div className="flex flex-col justify-center items-center space-y-4 h-full">
                {isDragActive ? (
                  <ArrowUpIcon className="w-12 h-12 text-primary animate-bounce" />
                ) : (
                  <FileText className="w-12 h-12 text-gray-400" />
                )}

                {isDragActive ? (
                  <p className="font-medium text-lg text-center">
                    Drop the PDF here
                  </p>
                ) : (
                  <p className="text-lg text-center">
                    <span className="font-semibold">Click to upload</span>
                    <span className="hidden lg:inline"> or drag and drop</span>
                  </p>
                )}

                <p className="text-gray-500 text-sm">
                  Only PDF files are accepted
                </p>

                {error && (
                  <div className="flex items-center text-destructive">
                    <FileWarningIcon className="mr-1 w-4 h-4" />
                    <p className="text-sm">PDF Files Only</p>
                  </div>
                )}
              </div>

              {isExtracting && (
                <div className="absolute inset-0 flex justify-center items-center bg-background/50 rounded-lg">
                  <div className="border-primary border-t-2 border-b-2 rounded-full w-12 h-12 animate-spin"></div>
                </div>
              )}

              {selectedFile && !isExtracting && (
                <div className="mt-4 p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <FileIcon className="w-6 h-6 text-primary" />
                      <div>
                        <p className="font-medium text-sm">
                          {selectedFile.name}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB •
                          PDF
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile();
                      }}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                      aria-label="Remove file"
                    >
                      <XCircleIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="text-muted-foreground text-xs">
              <p>
                Drop in your document template and our AI will analyze it to
                create a reusable template. This will help standardize your
                document creation process and make it easier to generate
                consistent documents in the future.
              </p>
            </div>

            <LoaderButton
              type="submit"
              className="w-full"
              isLoading={isSubmitting}
              disabled={!selectedFile || !extractedText || isSubmitting}
            >
              {isSubmitting
                ? getSubmitButtonText(submissionState)
                : "Create Template"}
            </LoaderButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
