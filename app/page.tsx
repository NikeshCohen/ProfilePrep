"use client";

import React, { useState } from "react";

import { PDFUploader } from "./_components/FileUpload";

function page() {
  const [extractedText, setExtractedText] = useState<string>("");

  const handleTextExtracted = (text: string) => {
    setExtractedText(text);
  };

  return (
    <section className="flex flex-col justify-center items-center min-h-[93vh] layout">
      <PDFUploader setExtractedText={setExtractedText} />
    </section>
  );
}

export default page;
