"use client";

import type React from "react";
import { useState } from "react";

import { generateDocument } from "@/actions/ai.actions";
import { CandidateInfo } from "@/app/app/_components/CandidateInfo";
import { CVDisplay } from "@/app/app/_components/CvDisplay";
import { PDFUploader } from "@/app/app/_components/FileUpload";
import type { CandidateData } from "@/types";
import { useSession } from "next-auth/react";
import { useErrorBoundary } from "react-error-boundary";
import { toast } from "react-hot-toast";

import { BackButton, NextButton } from "@/components/global/NavigationButtons";
import { Spinner } from "@/components/global/Spinner";

function GenerateContent() {
  const { showBoundary } = useErrorBoundary();
  const { data: session } = useSession();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>("");
  const [showCandidateInfo, setShowCandidateInfo] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generatedCV, setGeneratedCV] = useState<string | null>(null);
  const [candidateData, setCandidateData] = useState<CandidateData>(() => {
    // Try to get the last used template from localStorage
    const savedTemplate =
      typeof window !== "undefined"
        ? localStorage.getItem("lastUsedTemplate")
        : "pp";
    return {
      documentTitle: "",
      name: "",
      location: "",
      rightToWork: "",
      salaryExpectation: "",
      notes: "",
      templateId: savedTemplate || "pp",
      templateContent: undefined,
    };
  });

  const handleTemplateChange = (
    templateId: string,
    templateContent?: string,
  ) => {
    // Save the template choice to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("lastUsedTemplate", templateId);
    }
    setCandidateData((prev) => ({
      ...prev,
      templateId,
      templateContent,
    }));
  };

  const handleNext = () => {
    if (!showCandidateInfo) {
      setShowCandidateInfo(true);
    } else if (!showNotes) {
      if (
        Object.entries(candidateData).some(
          ([key, value]) => key !== "notes" && value === "",
        )
      ) {
        toast.error("Please fill in all required fields");
        return;
      }
      setShowNotes(true);
    } else {
      if (candidateData.notes.length < 200) {
        toast.error("Please enter at least 200 characters");
        return;
      } else if (candidateData.notes.length > 2000) {
        toast.error("Keep notes under 2000 characters");
        return;
      }
      handleGenerate();
    }
  };

  const handleBack = () => {
    if (generatedCV) {
      setGeneratedCV(null);
    } else if (showNotes) {
      setShowNotes(false);
    } else if (showCandidateInfo) {
      setShowCandidateInfo(false);
    }
  };

  const handleCandidateDataChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    setCandidateData((prev) => ({ ...prev, [id]: value }));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);

    // Start the progress simulation
    const duration = 10000; // 10 seconds
    const interval = 50; // Update every 50ms
    const steps = duration / interval;
    let currentStep = 0;

    const progressInterval = setInterval(() => {
      currentStep++;
      const progress = Math.min(99, Math.round((currentStep / steps) * 99));
      setGenerationProgress(progress);
    }, interval);

    try {
      const result = await generateDocument(
        extractedText,
        candidateData,
        session!.user,
      );

      if (!result) {
        toast.error("You have reached your generation limit!");
        return;
      }

      clearInterval(progressInterval);
      setGenerationProgress(100);

      if (typeof result === "object" && "text" in result) {
        setGeneratedCV(result);
      } else {
        setGeneratedCV(result);
      }

      toast.success("CV generated successfully");
    } catch (error) {
      clearInterval(progressInterval);
      console.error("Generation failed:", error);
      showBoundary(error);
    } finally {
      clearInterval(progressInterval);
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setExtractedText("");
    setShowCandidateInfo(false);
    setShowNotes(false);
    // Keep the last used template when resetting
    const lastTemplate = candidateData.templateId;
    setCandidateData({
      documentTitle: "",
      name: "",
      location: "",
      rightToWork: "",
      salaryExpectation: "",
      notes: "",
      templateId: lastTemplate,
      templateContent: undefined,
    });
    setGeneratedCV(null);
  };

  if (isGenerating) {
    return (
      <section className="flex flex-col justify-center items-center min-h-[93vh] layout">
        <Spinner progress={generationProgress} />
        <span className="mt-2 text-muted-foreground text-sm">
          {Math.round(generationProgress)}% Complete
        </span>
      </section>
    );
  }

  return (
    <section className="flex flex-col justify-center items-center pt-18 min-h-[92vh] layout">
      <div className="w-full max-w-sm sm:max-w-lg md:max-w-xl lg:max-w-2xl">
        {generatedCV ? (
          <CVDisplay
            markdown={generatedCV}
            docName={candidateData.documentTitle}
            handleReset={handleReset}
          />
        ) : !showCandidateInfo ? (
          <>
            <PDFUploader
              setExtractedText={setExtractedText}
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
            />
            {extractedText && (
              <div className="flex justify-end mt-4 w-full">
                <NextButton onClick={handleNext} className="px-6" />
              </div>
            )}
          </>
        ) : (
          <>
            <CandidateInfo
              sessionUser={session!.user}
              candidateData={candidateData}
              onInputChange={handleCandidateDataChange}
              showNotes={showNotes}
              selectedTemplate={candidateData.templateId}
              onTemplateChange={handleTemplateChange}
            />
            <div className="flex justify-between mt-4 w-full">
              <BackButton
                onClick={handleBack}
                className="bg-background/20 px-6"
              />
              <NextButton onClick={handleNext} className="px-6" />
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default GenerateContent;
