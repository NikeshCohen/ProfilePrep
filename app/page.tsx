"use client";

import type React from "react";
import { useState } from "react";

import type { CandidateData } from "@/types";

import { CandidateInfo } from "./_components/CandidateInfo";
import { PDFUploader } from "./_components/FileUpload";
import { NextButton } from "./_components/NextButton";

export default function Page() {
  const [extractedText, setExtractedText] = useState<string>("");
  const [showCandidateInfo, setShowCandidateInfo] = useState(false);
  const [candidateData, setCandidateData] = useState<CandidateData>({
    documentTitle: "",
    name: "",
    location: "",
    rightToWork: "",
    salaryExpectation: "",
    notes: "",
  });

  const handleNext = () => {
    setShowCandidateInfo(true);
  };

  const handleCandidateDataChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    setCandidateData((prev) => ({ ...prev, [id]: value }));
  };

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
        <CandidateInfo
          candidateData={candidateData}
          onInputChange={handleCandidateDataChange}
        />
      )}
    </section>
  );
}
