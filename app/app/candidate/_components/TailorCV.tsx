"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { createTailoredCV } from "@/actions/candidate.actions";
import { FileText, Upload, XCircle } from "lucide-react";
import { toast } from "react-hot-toast";

import { LoaderButton } from "@/components/global/LoaderButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

import { extractTextFromPdf } from "@/lib/utils";

export default function TailorCV() {
  const router = useRouter();
  const [jobDescription, setJobDescription] = useState("");
  const [cvTitle, setCvTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [extractedText, setExtractedText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        toast.error("Error extracting text from PDF");
        console.error("PDF extraction error:", error);
      } finally {
        setIsExtracting(false);
      }
    }
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setJobDescription(e.target.value);
  };

  // const removeFile = () => {
  //   setFile(null);
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobDescription.trim()) {
      toast.error("Please provide a job description");
      return;
    }

    setIsGenerating(true);
    try {
      const result = await createTailoredCV({ jobDescription });
      if (result.success) {
        toast.success(result.message);
        router.push(`/app/cvs/${result.cvId}`);
      } else {
        toast.error(result.message);
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Tabs defaultValue="paste">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="paste">Paste Job Description</TabsTrigger>
            <TabsTrigger value="upload">Upload PDF</TabsTrigger>
          </TabsList>

          <TabsContent value="paste" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="job-description">Job Description</Label>
              <Textarea
                id="job-description"
                value={jobDescription}
                onChange={handleDescriptionChange}
                placeholder="Paste the job description here..."
                className="min-h-[300px]"
                rows={12}
              />
            </div>
          </TabsContent>

          <TabsContent value="upload" className="space-y-4 pt-4">
            <div
              className="cursor-pointer rounded-lg border-2 border-dashed border-muted-foreground/20 p-8 text-center transition-colors hover:bg-muted/50"
              onClick={() => document.getElementById("job-file")?.click()}
            >
              <Input
                id="job-file"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
              />

              {isExtracting ? (
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
                  <p>Extracting text...</p>
                </div>
              ) : file ? (
                <div className="flex items-center justify-center space-x-2">
                  <FileText className="h-6 w-6 text-primary" />
                  <span>{file.name}</span>
                  <Button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                      setJobDescription("");
                    }}
                    className="text-destructive hover:text-destructive/80"
                  >
                    <XCircle className="h-5 w-5" />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-2">
                  <Upload className="h-8 w-8 text-muted-foreground/70" />
                  <p className="text-lg font-medium">Upload Job Description</p>
                  <p className="text-muted-foreground">
                    Click to upload or drag and drop the job description PDF
                  </p>
                </div>
              )}
            </div>

            {file && (
              <div className="space-y-2">
                <Label htmlFor="extracted-description">Extracted Text</Label>
                <Textarea
                  id="extracted-description"
                  // use extracted text instead of job description
                  value={extractedText}
                  onChange={handleDescriptionChange}
                  placeholder="Extracted job description will appear here..."
                  className="min-h-[200px]"
                  rows={8}
                />
              </div>
            )}

            {error && <p className="text-sm text-destructive">{error}</p>}
          </TabsContent>
        </Tabs>

        <div className="space-y-2">
          <Label htmlFor="cv-title">CV Title</Label>
          <Input
            id="cv-title"
            type="text"
            value={cvTitle}
            onChange={(e) => setCvTitle(e.target.value)}
            placeholder="E.g., Senior Developer - Company Name"
            className="w-full rounded-md border p-2"
            required
          />
        </div>

        <div className="flex justify-end">
          <LoaderButton
            type="submit"
            isLoading={isGenerating}
            disabled={!jobDescription.trim() || !cvTitle.trim() || isGenerating}
          >
            Generate Tailored CV
          </LoaderButton>
        </div>
      </form>
    </div>
  );
}
