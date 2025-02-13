"use client";

import type React from "react";
import { useState } from "react";

import { generate } from "@/actions/generate";
import type { CandidateData } from "@/types";
import { toast } from "react-hot-toast";

import { Spinner } from "@/components/global/Spinner";

import { CandidateInfo } from "./_components/CandidateInfo";
import { PDFUploader } from "./_components/FileUpload";
import { BackButton, NextButton } from "./_components/NavigationButtons";

export default function Page() {
  const [extractedText, setExtractedText] = useState<string>("");
  const [showCandidateInfo, setShowCandidateInfo] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
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
      if (candidateData.notes === "") {
        toast.error("Please fill in the notes field");
        return;
      }
      handleGenerate();
    }
  };

  const handleBack = () => {
    if (showNotes) {
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
      await generate(extractedText, candidateData);
      toast.success("Generation completed successfully");
    } catch (error) {
      console.error("Generation failed:", error);
      toast.error("Generation failed. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (isGenerating) {
    return (
      <section className="flex flex-col justify-center items-center min-h-[93vh] layout">
        <Spinner />
      </section>
    );
  }

  return (
    <section className="flex flex-col justify-center items-center min-h-[93vh] layout">
      {!showCandidateInfo ? (
        <>
          <PDFUploader setExtractedText={setExtractedText} />
          {extractedText && (
            <div className="flex justify-end mt-4 w-full max-w-2xl">
              <NextButton onClick={handleNext} />
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
          <div className="flex justify-between mt-4 w-full max-w-2xl">
            <BackButton onClick={handleBack} />
            <NextButton onClick={handleNext} />
          </div>
        </>
      )}
    </section>
  );
}
