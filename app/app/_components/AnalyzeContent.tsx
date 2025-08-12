"use client";

import type React from "react";
import { useState } from "react";

import { useRouter } from "next/navigation";

import {
  BarChart3,
  FileTextIcon,
  FileUpIcon,
  Target,
  TrendingUp,
  XIcon,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useDropzone } from "react-dropzone";
import { useErrorBoundary } from "react-error-boundary";
import { toast } from "react-hot-toast";

import { BackButton, NextButton } from "@/components/global/NavigationButtons";
import { Spinner } from "@/components/global/Spinner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { extractTextFromPdf } from "@/lib/utils";

interface AnalysisData {
  jobTitle: string;
  companyName: string;
  jobDescription: string;
}

function AnalyzeContent() {
  const { showBoundary } = useErrorBoundary();
  const { data: session } = useSession();
  const router = useRouter();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [showJobDescription, setShowJobDescription] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<unknown>(null);
  const [extractError, setExtractError] = useState<string | null>(null);

  const [analysisData, setAnalysisData] = useState<AnalysisData>({
    jobTitle: "",
    companyName: "",
    jobDescription: "",
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setSelectedFile(file);
        setExtractError(null);

        // Extract text from PDF client-side
        await extractTextFromPdf(
          file,
          setIsExtracting,
          setExtractedText,
          setExtractError,
        );
      }
    },
  });

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setExtractedText("");
    setExtractError(null);
    setShowJobDetails(false);
    setShowJobDescription(false);
  };

  const handleNext = () => {
    if (!showJobDetails) {
      if (!selectedFile) {
        toast.error("Please select a CV file");
        return;
      }
      if (!extractedText) {
        toast.error(
          "Failed to extract text from PDF. Please try another file.",
        );
        return;
      }
      setShowJobDetails(true);
    } else if (!showJobDescription) {
      if (!analysisData.jobTitle) {
        toast.error("Please enter a job title");
        return;
      }
      setShowJobDescription(true);
    } else {
      handleAnalyze();
    }
  };

  const handleBack = () => {
    if (analysisResult) {
      setAnalysisResult(null);
    } else if (showJobDescription) {
      setShowJobDescription(false);
    } else if (showJobDetails) {
      setShowJobDetails(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    setAnalysisData((prev) => ({ ...prev, [id]: value }));
  };

  const handleAnalyze = async () => {
    if (!selectedFile || !extractedText || !analysisData.jobTitle) {
      toast.error("Please provide all required information");
      return;
    }

    if (!session?.user) {
      toast.error("Please log in to analyze your CV");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(0);

    // Progress simulation
    const duration = 8000; // 8 seconds
    const interval = 50;
    const steps = duration / interval;
    let currentStep = 0;

    const progressInterval = setInterval(() => {
      currentStep++;
      const progress = Math.min(99, Math.round((currentStep / steps) * 99));
      setAnalysisProgress(progress);
    }, interval);

    try {
      const formData = new FormData();
      formData.append("fileName", selectedFile.name);
      formData.append("fileContent", extractedText);
      formData.append("jobTitle", analysisData.jobTitle);
      formData.append("companyName", analysisData.companyName);
      formData.append("jobDescription", analysisData.jobDescription);

      const response = await fetch("/api/cv/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to analyze CV");
      }

      const result = await response.json();

      clearInterval(progressInterval);
      setAnalysisProgress(100);

      toast.success("CV analyzed successfully!");

      // Redirect to analysis results page
      router.push(`/portal/analysis/${result.id}`);
    } catch (error) {
      clearInterval(progressInterval);
      console.error("Analysis failed:", error);
      toast.error(error instanceof Error ? error.message : "Analysis failed");
      showBoundary(error);
    } finally {
      clearInterval(progressInterval);
      setIsAnalyzing(false);
    }
  };

  if (isAnalyzing) {
    return (
      <section className="layout flex min-h-[93vh] flex-col items-center justify-center">
        <Spinner progress={analysisProgress} />
        <span className="mt-2 text-sm text-muted-foreground">
          Analyzing CV... {Math.round(analysisProgress)}% Complete
        </span>
      </section>
    );
  }

  return (
    <section className="pt-18 layout flex min-h-[92vh] flex-col items-center justify-center">
      <div className="w-full max-w-sm sm:max-w-lg md:max-w-xl lg:max-w-2xl">
        {!showJobDetails ? (
          // Step 1: File Upload
          <Card>
            <CardHeader>
              <CardTitle>Upload Your CV for Analysis</CardTitle>
              <CardDescription>
                Get AI-powered feedback and ATS compatibility scoring for your
                resume
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!selectedFile ? (
                <div
                  {...getRootProps()}
                  className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                    isDragActive
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <input {...getInputProps()} />
                  <FileUpIcon className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                  {isDragActive ? (
                    <p className="text-sm text-muted-foreground">
                      Drop your CV here...
                    </p>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-lg font-medium">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-sm text-muted-foreground">
                        PDF files only, up to 10MB
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 rounded-lg bg-muted p-4">
                    <FileTextIcon className="h-8 w-8 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-medium">{selectedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      {isExtracting && (
                        <p className="mt-1 text-xs text-primary">
                          Extracting text...
                        </p>
                      )}
                      {extractedText && !isExtracting && (
                        <p className="mt-1 text-xs text-green-600">
                          ✓ Text extracted successfully
                        </p>
                      )}
                      {extractError && (
                        <p className="mt-1 text-xs text-red-600">
                          ✗ Failed to extract text
                        </p>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveFile}
                    >
                      <XIcon className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-4">
                    <div className="text-center">
                      <BarChart3 className="mx-auto mb-2 h-8 w-8 text-primary" />
                      <p className="text-xs text-muted-foreground">ATS Score</p>
                    </div>
                    <div className="text-center">
                      <Target className="mx-auto mb-2 h-8 w-8 text-primary" />
                      <p className="text-xs text-muted-foreground">Job Match</p>
                    </div>
                    <div className="text-center">
                      <TrendingUp className="mx-auto mb-2 h-8 w-8 text-primary" />
                      <p className="text-xs text-muted-foreground">
                        Improvements
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {selectedFile && (
                <div className="flex justify-end">
                  <NextButton
                    onClick={handleNext}
                    className="px-6"
                    disabled={isExtracting || !extractedText}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        ) : !showJobDescription ? (
          // Step 2: Job Details
          <Card>
            <CardHeader>
              <CardTitle>Target Job Information</CardTitle>
              <CardDescription>
                Provide job details for tailored CV analysis and recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title *</Label>
                <Input
                  id="jobTitle"
                  type="text"
                  placeholder="e.g., Senior Software Engineer"
                  value={analysisData.jobTitle}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name (Optional)</Label>
                <Input
                  id="companyName"
                  type="text"
                  placeholder="e.g., Google, Microsoft"
                  value={analysisData.companyName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="mt-6 flex justify-between">
                <BackButton
                  onClick={handleBack}
                  className="bg-background/20 px-6"
                />
                <NextButton onClick={handleNext} className="px-6" />
              </div>
            </CardContent>
          </Card>
        ) : (
          // Step 3: Job Description
          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
              <CardDescription>
                Paste the job description for more accurate analysis and keyword
                matching
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="jobDescription">
                  Job Description (Optional)
                </Label>
                <Textarea
                  id="jobDescription"
                  placeholder="Paste the full job description here for better analysis..."
                  rows={10}
                  value={analysisData.jobDescription}
                  onChange={handleInputChange}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Adding the job description helps identify missing keywords and
                  skills
                </p>
              </div>

              <div className="mt-6 flex justify-between">
                <BackButton
                  onClick={handleBack}
                  className="bg-background/20 px-6"
                />
                <NextButton
                  onClick={handleNext}
                  className="px-6"
                  label="Analyze CV"
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}

export default AnalyzeContent;
