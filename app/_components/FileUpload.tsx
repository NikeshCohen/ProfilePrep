"use client";

import type React from "react";
import { useRef, useState } from "react";

import { ArrowUpIcon, FileIcon, XCircleIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import pdfToText from "react-pdftotext";

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
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={onButtonClick}
      className={`relative min-h-[200px] w-full max-w-md rounded-md border-2 border-dashed sm:max-w-lg md:max-w-xl lg:max-w-2xl ${error ? "px-8 pb-8 pt-12" : "p-8"} transition-all duration-300 ease-in-out ${
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
      <div className="flex h-full flex-col items-center justify-center space-y-4">
        {isDragActive ? (
          <ArrowUpIcon className="h-12 w-12 animate-bounce text-primary" />
        ) : (
          // NOTE: i typically use the CloudUpload icon for drag and drop
          <FileIcon className="h-12 w-12 text-gray-400" />
        )}

        {isDragActive ? (
          <p className="text-center text-lg font-medium">Drop the PDF here</p>
        ) : (
          <p className="text-center text-lg">
            <span className="font-semibold">Click to upload</span>
            <span className="hidden lg:inline"> or drag and drop</span>
          </p>
        )}

        <p className="text-sm text-gray-500">Only PDF files are accepted</p>

        {/* TODO: add if using cloud instead of file icon:
        <div className="flex items-center text-gray-500">
          <FileWarningIcon className="mr-1 h-3 w-3" />
          <p className="text-sm">PDF Files Only</p>
        </div>
        */}
      </div>
      {error && (
        <div className="absolute left-0 right-0 top-0 flex items-center justify-between rounded-t-lg bg-destructive px-4 py-2 text-sm text-destructive-foreground">
          <div className="flex items-center space-x-2">
            <XCircleIcon className="h-4 w-4" />
            <p>{error}</p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setError(null);
            }}
            className="text-destructive-foreground/80 transition-colors hover:text-destructive-foreground"
            aria-label="Dismiss error"
          >
            <XCircleIcon className="h-4 w-4" />
          </button>
        </div>
      )}
      {isExtracting && (
        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-background/50">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
        </div>
      )}
      {selectedFile && !isExtracting && (
        <div className="mt-4 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileIcon className="h-6 w-6 text-primary" />
              <div>
                <p className="text-sm font-medium">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">
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
              className="text-muted-foreground transition-colors hover:text-red-500"
              aria-label="Remove file"
            >
              <XCircleIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
