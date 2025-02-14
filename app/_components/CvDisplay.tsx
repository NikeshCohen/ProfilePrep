/* eslint-disable react/no-unescaped-entities */

"use client";

import { useEffect, useState } from "react";

import htmlToPdfmake from "html-to-pdfmake";
import MarkdownIt from "markdown-it";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import Confetti from "react-confetti";

import { Button } from "@/components/ui/button";

/* eslint-disable react/no-unescaped-entities */

/* eslint-disable react/no-unescaped-entities */

/* eslint-disable react/no-unescaped-entities */

/* eslint-disable react/no-unescaped-entities */

/* eslint-disable react/no-unescaped-entities */

/* eslint-disable react/no-unescaped-entities */

pdfMake.vfs = pdfFonts.vfs;

interface CVDisplayProps {
  markdown: string;
  docName: string;
  handleReset: () => void;
}

export function CVDisplay({ markdown, docName, handleReset }: CVDisplayProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [windowDimension, setWindowDimension] = useState<{
    width: number;
    height: number;
  }>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const detectSize = () => {
    setWindowDimension({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  useEffect(() => {
    window.addEventListener("resize", detectSize);
    return () => {
      window.removeEventListener("resize", detectSize);
    };
  }, [detectSize]);

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const markdownParser = new MarkdownIt();
      const htmlContent = markdownParser.render(markdown);
      console.log(htmlContent);
      const pdfContent = htmlToPdfmake(htmlContent);
      const docDefinition = { content: pdfContent };
      pdfMake.createPdf(docDefinition).download(`${docName}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <Confetti
        width={windowDimension.width}
        height={windowDimension.height}
        recycle={false}
        numberOfPieces={700}
        gravity={0.3}
      />

      <h1 className="text-center text-3xl font-bold">
        We Generated Your Candidate's CV Content!
      </h1>
      <p className="mb-8 mt-1 text-center text-muted-foreground">
        *Please ensure the accuracy of candidate information
      </p>
      <div className="flex justify-center gap-4">
        <Button onClick={handleDownload} disabled={isGenerating}>
          {isGenerating ? "Generating PDF..." : "Download CV"}
        </Button>
        <Button onClick={handleReset} disabled={isGenerating} variant="outline">
          Reset
        </Button>
      </div>
    </div>
  );
}
