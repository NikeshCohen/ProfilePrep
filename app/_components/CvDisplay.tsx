"use client";

import { useCallback, useEffect, useState } from "react";

import htmlToPdfmake from "html-to-pdfmake";
import { Download } from "lucide-react";
import MarkdownIt from "markdown-it";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import Confetti from "react-confetti";

import { Button } from "@/components/ui/button";

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

  // memoise with useCallback to avoid dependency warning
  const detectSize = useCallback(() => {
    setWindowDimension({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  useEffect(() => {
    window.addEventListener("resize", detectSize);
    detectSize();

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
    <div className="w-full max-w-sm sm:max-w-lg md:max-w-xl lg:max-w-3xl">
      {/* hehehehe :) */}
      <Confetti
        width={windowDimension.width}
        height={windowDimension.height}
        recycle={false}
        numberOfPieces={700}
        gravity={0.3}
      />

      <h1 className="text-center text-3xl font-bold">
        We&apos;ve Generated Your Candidate&apos;s CV Content!
      </h1>
      <p className="mb-8 mt-2 text-center text-sm font-thin tracking-wide text-muted-foreground">
        *Please verify the accuracy of the candidate&apos;s information.
      </p>

      {/* you're changing it back, aren't you O_O */}
      <div className="flex justify-center gap-4">
        <Button
          onClick={handleDownload}
          disabled={isGenerating}
          effect="shineHover"
        >
          {isGenerating ? (
            "Generating PDF..."
          ) : (
            <>
              <Download className="h-4 w-4" />
              <span>Download CV</span>
            </>
          )}
        </Button>
        <Button onClick={handleReset} disabled={isGenerating} variant="outline">
          Reset
        </Button>
      </div>
    </div>
  );
}
