"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { uploadMasterCV } from "@/actions/candidate.actions";
import { motion } from "framer-motion";
import { FileText, Upload, XCircle } from "lucide-react";
import { toast } from "react-hot-toast";

import { LoaderButton } from "@/components/global/LoaderButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { fadeUpAnimation } from "@/lib/animations";
import { extractTextFromPdf } from "@/lib/utils";

export default function MasterCVUpload({
  isUpdate = false,
}: {
  isUpdate?: boolean;
}) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setIsExtracting: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setIsExtracting(true);
      try {
        await extractTextFromPdf(
          selectedFile,
          setIsExtracting,
          setExtractedText,
          setError,
        );
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setIsExtracting(false);
      }
    }
  };

  const handleManualInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setExtractedText(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!extractedText.trim()) {
      toast.error("Please provide CV content");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("cvContent", extractedText);

    try {
      const result = await uploadMasterCV(formData);
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setExtractedText("");
  };

  return (
    <motion.div
      variants={fadeUpAnimation}
      initial="hidden"
      animate="show"
      className="space-y-4"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <div
            className="cursor-pointer rounded-lg border-2 border-dashed border-muted-foreground/20 p-8 text-center transition-colors hover:bg-muted/50"
            onClick={() => document.getElementById("cv-file")?.click()}
          >
            <Input
              id="cv-file"
              type="file"
              accept=".pdf"
              onChange={(e) => handleFileChange(e, setIsExtracting)}
              className="hidden"
            />

            {isExtracting ? (
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
                <p>Extracting content...</p>
              </div>
            ) : file ? (
              <div className="flex items-center justify-between p-2">
                <div className="flex items-center space-x-2">
                  <FileText className="text-primary" />
                  <span className="font-medium">{file.name}</span>
                </div>
                <Button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile();
                  }}
                  className="text-muted-foreground transition-colors hover:text-destructive"
                >
                  <XCircle className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-2">
                <Upload className="h-8 w-8 text-muted-foreground/70" />
                <p className="text-lg font-medium">Upload your CV</p>
                <p className="text-muted-foreground">
                  Click to upload or drag and drop your PDF file here
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="cv-content" className="text-sm font-medium">
            CV Content
          </label>
          <p className="mb-2 text-xs text-muted-foreground">
            Add ALL of your professional experience, skills, and qualifications.
            This will be your master CV to tailor for specific jobs.
          </p>
          <Textarea
            id="cv-content"
            rows={15}
            value={extractedText}
            onChange={handleManualInput}
            placeholder="Paste or type your comprehensive CV content here..."
            className="min-h-[300px]"
          />

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <div className="flex justify-end">
          <LoaderButton
            type="submit"
            isLoading={isUploading}
            disabled={!extractedText.trim() || isUploading}
          >
            {isUpdate ? "Update Master CV" : "Save Master CV"}
          </LoaderButton>
        </div>
      </form>
    </motion.div>
  );
}
