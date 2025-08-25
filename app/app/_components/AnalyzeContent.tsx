"use client";

import type React from "react";
import { useState } from "react";

import { useRouter } from "next/navigation";

import { motion } from "framer-motion";
import {
  ArrowUpIcon,
  BarChart3,
  FileIcon,
  FileText,
  FileWarningIcon,
  Target,
  TrendingUp,
  XCircleIcon,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useDropzone } from "react-dropzone";
import { useErrorBoundary } from "react-error-boundary";
import { toast } from "react-hot-toast";

import { BackButton, NextButton } from "@/components/global/NavigationButtons";
import { Spinner } from "@/components/global/Spinner";
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

import { fadeUpAnimation } from "@/lib/animations";
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
      <motion.div
        {...fadeUpAnimation}
        className="w-full max-w-sm sm:max-w-lg md:max-w-xl lg:max-w-2xl"
      >
        {!showJobDetails ? (
          // Step 1: File Upload
          <div className="space-y-6">
            <div className="mb-8 space-y-2 text-center">
              <h1 className="text-3xl font-bold tracking-tight">
                Upload Your CV for Analysis
              </h1>
              <p className="text-muted-foreground">
                Get AI-powered feedback and ATS compatibility scoring for your
                resume
              </p>
            </div>

            <motion.div
              {...fadeUpAnimation}
              className="w-full rounded-md border-2 border-dashed"
            >
              <div
                {...getRootProps()}
                className={`relative ${extractError ? "px-8 pb-8 pt-12" : "p-8"} transition-all duration-300 ease-in-out ${
                  isDragActive
                    ? extractError
                      ? "border-destructive bg-destructive/10"
                      : "border-primary bg-primary/10"
                    : extractError
                      ? "hover:border-destructive hover:bg-destructive/5"
                      : "hover:border-primary hover:bg-primary/5"
                } ${isExtracting ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
              >
                <input {...getInputProps()} disabled={isExtracting} />
                <div className="flex h-full flex-col items-center justify-center space-y-4">
                  {isDragActive ? (
                    <ArrowUpIcon className="h-12 w-12 animate-bounce text-primary" />
                  ) : (
                    <FileText className="h-12 w-12 text-muted-foreground" />
                  )}

                  {isDragActive ? (
                    <p className="text-center text-lg font-medium">
                      Drop your CV here
                    </p>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-center text-lg">
                        <span className="font-semibold">Click to upload</span>
                        <span className="hidden lg:inline">
                          {" "}
                          or drag and drop
                        </span>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        PDF files only, up to 10MB
                      </p>
                    </div>
                  )}

                  {extractError && (
                    <div className="flex items-center text-destructive">
                      <FileWarningIcon className="mr-1 h-4 w-4" />
                      <p className="text-sm">PDF Files Only</p>
                    </div>
                  )}
                </div>

                {extractError && (
                  <div className="absolute left-0 right-0 top-0 flex items-center justify-between rounded-t-lg bg-destructive px-4 py-2 text-sm text-destructive-foreground">
                    <div className="flex items-center space-x-2">
                      <XCircleIcon className="h-4 w-4" />
                      <p>{extractError}</p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExtractError(null);
                      }}
                      className="text-destructive-foreground/80 transition-colors hover:text-destructive-foreground"
                      aria-label="Dismiss error"
                    >
                      <XCircleIcon className="h-4 w-4" />
                    </button>
                  </div>
                )}

                {isExtracting && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-background/50">
                    <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
                  </div>
                )}

                {selectedFile && !isExtracting && (
                  <div className="mt-4 rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FileIcon className="h-6 w-6 text-primary" />
                        <div>
                          <p className="text-sm font-medium">
                            {selectedFile.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB •
                            PDF
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFile();
                        }}
                        className="text-muted-foreground transition-colors hover:text-destructive"
                        aria-label="Remove file"
                      >
                        <XCircleIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {selectedFile && (
              <motion.div
                className="grid grid-cols-3 gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <motion.div
                  className="group cursor-default text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <BarChart3 className="mx-auto mb-2 h-8 w-8 text-primary transition-colors group-hover:text-primary/80" />
                  <p className="text-xs text-muted-foreground transition-colors group-hover:text-foreground/80">
                    ATS Score
                  </p>
                </motion.div>
                <motion.div
                  className="group cursor-default text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Target className="mx-auto mb-2 h-8 w-8 text-primary transition-colors group-hover:text-primary/80" />
                  <p className="text-xs text-muted-foreground transition-colors group-hover:text-foreground/80">
                    Job Match
                  </p>
                </motion.div>
                <motion.div
                  className="group cursor-default text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <TrendingUp className="mx-auto mb-2 h-8 w-8 text-primary transition-colors group-hover:text-primary/80" />
                  <p className="text-xs text-muted-foreground transition-colors group-hover:text-foreground/80">
                    Improvements
                  </p>
                </motion.div>
              </motion.div>
            )}

            {selectedFile && (
              <motion.div
                className="flex justify-end"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                <NextButton
                  onClick={handleNext}
                  className="px-6"
                  disabled={isExtracting || !extractedText}
                />
              </motion.div>
            )}
          </div>
        ) : !showJobDescription ? (
          // Step 2: Job Details
          <motion.div
            key="job-details"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-0 bg-transparent shadow-none">
              <CardHeader className="px-0 pb-6">
                <CardTitle className="text-2xl font-bold tracking-tight">
                  Target Job Information
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Provide job details for tailored CV analysis and
                  recommendations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 px-0">
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
          </motion.div>
        ) : (
          // Step 3: Job Description
          <motion.div
            key="job-description"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-0 bg-transparent shadow-none">
              <CardHeader className="px-0 pb-6">
                <CardTitle className="text-2xl font-bold tracking-tight">
                  Job Description
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Paste the job description for more accurate analysis and
                  keyword matching
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 px-0">
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
                    Adding the job description helps identify missing keywords
                    and skills
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
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}

export default AnalyzeContent;
