"use client";

import type React from "react";
import { useState } from "react";

import { generate } from "@/actions/generate";
import type { CandidateData } from "@/types";
import { useSession } from "next-auth/react";
import { useErrorBoundary } from "react-error-boundary";
import { toast } from "react-hot-toast";

import { BackButton, NextButton } from "@/components/global/NavigationButtons";
import { Spinner } from "@/components/global/Spinner";

import { CandidateInfo } from "./CandidateInfo";
import { CVDisplay } from "./CvDisplay";
import { PDFUploader } from "./FileUpload";

function GenerateContent() {
  const { showBoundary } = useErrorBoundary();
  const { data: session } = useSession();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>("");
  const [showCandidateInfo, setShowCandidateInfo] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCV, setGeneratedCV] = useState<string | null>(null);
  const [candidateData, setCandidateData] = useState<CandidateData>({
    documentTitle: "",
    name: "",
    location: "",
    rightToWork: "",
    salaryExpectation: "",
    notes: "",
  });

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
      } else if (candidateData.notes.length > 3000) {
        toast.error("Keep notes under 3000 characters");
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
    try {
      const result = await generate(
        extractedText,
        candidateData,
        session!.user,
      );

      if (!result) {
        toast.error("You have reached your generation limit!");
        return;
      }

      setGeneratedCV(result);
      toast.success("CV generated successfully");
    } catch (error) {
      console.error("Generation failed:", error);
      showBoundary(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setExtractedText("");
    setShowCandidateInfo(false);
    setCandidateData({
      documentTitle: "",
      name: "",
      location: "",
      rightToWork: "",
      salaryExpectation: "",
      notes: "",
    });
    setGeneratedCV(null);
  };

  if (isGenerating) {
    return (
      <section className="flex flex-col justify-center items-center min-h-[92vh] layout">
        <Spinner />
      </section>
    );
  }

  return (
    <section className="flex flex-col justify-center items-center min-h-[92vh] layout">
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
            <div className="flex justify-end mt-4 w-full max-w-sm sm:max-w-lg md:max-w-xl lg:max-w-2xl">
              <NextButton onClick={handleNext} className="px-6" />
            </div>
          )}
        </>
      ) : (
        <>
          <CandidateInfo
            candidateData={candidateData}
            onInputChange={handleCandidateDataChange}
            showNotes={showNotes}
          />
          <div className="flex justify-between mt-4 w-full max-w-sm sm:max-w-lg md:max-w-xl lg:max-w-2xl">
            <BackButton
              onClick={handleBack}
              className="bg-background/20 px-6"
            />
            <NextButton onClick={handleNext} className="px-6" />
          </div>
        </>
      )}
    </section>
  );
}

export default GenerateContent;
