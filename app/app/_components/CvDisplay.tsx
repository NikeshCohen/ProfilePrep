"use client";

import { useCallback, useEffect, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { Download } from "lucide-react";
import Confetti from "react-confetti";
import { useErrorBoundary } from "react-error-boundary";

import { Button } from "@/components/ui/button";

import { containerVariants, itemVariants } from "@/lib/animations";
import { MdToPdf } from "@/lib/utils";

export interface CVDisplayProps {
  markdown: string;
  docName: string;
  handleReset: () => void;
}

export function CVDisplay({ markdown, docName, handleReset }: CVDisplayProps) {
  const { showBoundary } = useErrorBoundary();
  const [isGenerating, setIsGenerating] = useState(false);
  const [windowDimension, setWindowDimension] = useState<{
    width: number;
    height: number;
  }>({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  const detectSize = useCallback(() => {
    if (typeof window !== "undefined") {
      setWindowDimension({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("resize", detectSize);
      detectSize();

      return () => {
        window.removeEventListener("resize", detectSize);
      };
    }
  }, [detectSize]);

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      MdToPdf(markdown, docName);
    } catch (error) {
      console.error("Error generating PDF:", error);
      showBoundary(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div
      className="w-full max-w-sm sm:max-w-lg md:max-w-xl lg:max-w-3xl"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Confetti
        width={windowDimension.width}
        height={windowDimension.height}
        recycle={false}
        numberOfPieces={700}
        gravity={0.3}
      />

      <motion.h1
        className="font-bold text-3xl text-center"
        variants={itemVariants}
      >
        We&apos;ve Generated Your Candidate&apos;s CV Content!
      </motion.h1>
      <motion.p
        className="mt-2 mb-8 font-thin text-muted-foreground text-sm text-center tracking-wide"
        variants={itemVariants}
      >
        *Please verify the accuracy of the candidate&apos;s information.
      </motion.p>

      <motion.div className="flex justify-center gap-4" variants={itemVariants}>
        <AnimatePresence mode="wait">
          <motion.div
            key={isGenerating ? "generating" : "download"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              onClick={handleDownload}
              disabled={isGenerating}
              className="relative overflow-hidden"
            >
              {isGenerating ? (
                "Generating PDF..."
              ) : (
                <>
                  <Download className="mr-2 w-4 h-4" />
                  <span>Download CV</span>
                </>
              )}
              <motion.div
                className="absolute inset-0 bg-white"
                initial={{ x: "-100%" }}
                animate={{ x: isGenerating ? "0%" : "-100%" }}
                transition={{ duration: 0.3 }}
              />
            </Button>
          </motion.div>
        </AnimatePresence>
        <motion.div variants={itemVariants}>
          <Button
            onClick={handleReset}
            disabled={isGenerating}
            variant="outline"
          >
            Reset
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
