"use client";

import type React from "react";
import { useRef, useState } from "react";

import { motion } from "framer-motion";
import {
  ArrowUpIcon,
  FileIcon,
  FileText,
  FileWarningIcon,
  XCircleIcon,
} from "lucide-react";
import { toast } from "react-hot-toast";
import pdfToText from "react-pdftotext";

import { fadeUpAnimation } from "@/lib/animations";

interface PDFUploaderProps {
  setExtractedText: (text: string) => void;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
}

export function PDFUploader({
  setExtractedText,
  selectedFile,
  setSelectedFile,
}: PDFUploaderProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      validateAndSetFile(files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      validateAndSetFile(files[0]);
    }
  };

  const validateAndSetFile = (newFile: File) => {
    setError(null);

    if (newFile.type !== "application/pdf") {
      const errorMessage = "Please upload a PDF file.";
      setError(errorMessage);
      toast.error(errorMessage);
      return;
    }
    setSelectedFile(newFile);
    extractPDFText(newFile);
  };

  const extractPDFText = async (pdfFile: File) => {
    setIsExtracting(true);
    try {
      const text = await pdfToText(pdfFile);
      setExtractedText(text);
      toast.success("Text extracted successfully");
    } catch (err) {
      console.error("Error extracting text from PDF:", err);
      const errorMessage = "Failed to extract text from PDF";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsExtracting(false);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = () => {
    setSelectedFile(null);
    setError(null);
    setExtractedText("");
  };

  return (
    <motion.div
      {...fadeUpAnimation}
      className="border-2 border-dashed rounded-md w-full max-w-sm sm:max-w-lg md:max-w-xl lg:max-w-2xl `min-h-[200px]"
    >
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
        className={`relative ${error ? "px-8 pb-8 pt-12" : "p-8"} transition-all duration-300 ease-in-out ${
          isDragActive
            ? error
              ? "border-destructive bg-destructive/10"
              : "border-primary bg-primary/10"
            : error
              ? "hover:border-destructive hover:bg-destructive/5"
              : "hover:border-primary hover:bg-primary/5"
        } ${isExtracting ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
      >
        <input
          title="Upload PDF File"
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleChange}
          accept=".pdf"
          disabled={isExtracting}
        />
        <div className="flex flex-col justify-center items-center space-y-4 h-full">
          {isDragActive ? (
            <ArrowUpIcon className="w-12 h-12 text-primary animate-bounce" />
          ) : (
            <FileText className="w-12 h-12 text-gray-400" />
          )}

          {isDragActive ? (
            <p className="font-medium text-lg text-center">Drop the PDF here</p>
          ) : (
            <p className="text-lg text-center">
              <span className="font-semibold">Click to upload</span>
              <span className="hidden lg:inline"> or drag and drop</span>
            </p>
          )}

          <p className="text-gray-500 text-sm">Only PDF files are accepted</p>

          {error && (
            <div className="flex items-center text-destructive">
              <FileWarningIcon className="mr-1 w-4 h-4" />
              <p className="text-sm">PDF Files Only</p>
            </div>
          )}
        </div>
        {error && (
          <div className="top-0 right-0 left-0 absolute flex justify-between items-center bg-destructive px-4 py-2 rounded-t-lg text-destructive-foreground text-sm">
            <div className="flex items-center space-x-2">
              <XCircleIcon className="w-4 h-4" />
              <p>{error}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setError(null);
              }}
              className="text-destructive-foreground/80 hover:text-destructive-foreground transition-colors"
              aria-label="Dismiss error"
            >
              <XCircleIcon className="w-4 h-4" />
            </button>
          </div>
        )}
        {isExtracting && (
          <div className="absolute inset-0 flex justify-center items-center bg-background/50 rounded-lg">
            <div className="border-primary border-t-2 border-b-2 rounded-full w-12 h-12 animate-spin"></div>
          </div>
        )}
        {selectedFile && !isExtracting && (
          <div className="mt-4 p-4 border rounded-lg">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <FileIcon className="w-6 h-6 text-primary" />
                <div>
                  <p className="font-medium text-sm">{selectedFile.name}</p>
                  <p className="text-gray-500 text-xs">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • PDF
                  </p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setExtractedText("");
                  removeFile();
                }}
                className="text-muted-foreground hover:text-red-500 transition-colors"
                aria-label="Remove file"
              >
                <XCircleIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
