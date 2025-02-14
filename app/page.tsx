"use client";

import type React from "react";
import { useState } from "react";

import { generate } from "@/actions/generate";
import type { CandidateData } from "@/types";
import { toast } from "react-hot-toast";

import { Spinner } from "@/components/global/Spinner";

import { BackButton, NextButton } from "../components/global/NavigationButtons";
import { CandidateInfo } from "./_components/CandidateInfo";
import { CVDisplay } from "./_components/CvDisplay";
import { PDFUploader } from "./_components/FileUpload";

export default function Page() {
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
      if (candidateData.notes === "") {
        toast.error("Please fill in the notes field");
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
      const result = await generate(extractedText, candidateData);
      setGeneratedCV(result);
      toast.success("CV generated successfully");
    } catch (error) {
      console.error("Generation failed:", error);
      toast.error("Generation failed. Please try again.");
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
      <section className="layout flex min-h-[93vh] flex-col items-center justify-center">
        <Spinner />
      </section>
    );
  }

  return (
    <section className="layout flex min-h-[93vh] flex-col items-center justify-center">
      {generatedCV ? (
        <>
          <CVDisplay
            markdown={generatedCV}
            docName={candidateData.documentTitle}
            handleReset={handleReset}
          />
        </>
      ) : !showCandidateInfo ? (
        <>
          <PDFUploader
            setExtractedText={setExtractedText}
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
          />
          {extractedText && (
            <div className="mt-4 flex w-full max-w-2xl justify-end">
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
          <div className="mt-4 flex w-full max-w-2xl justify-between">
            <BackButton onClick={handleBack} />
            <NextButton onClick={handleNext} />
          </div>
        </>
      )}
    </section>
  );
}
