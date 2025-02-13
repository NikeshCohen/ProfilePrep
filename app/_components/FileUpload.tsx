"use client";

import type React from "react";
import { useRef, useState } from "react";

import { ArrowUpIcon, FileIcon, XCircleIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import pdfToText from "react-pdftotext";

interface PDFUploaderProps {
  setExtractedText: (text: string) => void;
}

export function PDFUploader({ setExtractedText }: PDFUploaderProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
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
      setError("Please upload a PDF file.");
      return;
    }
    setFile(newFile);
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
      toast.error("Error extracting text from PDF");
      setError("Failed to extract text from PDF");
    } finally {
      setIsExtracting(false);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = () => {
    setFile(null);
    setError(null);
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={onButtonClick}
      className={`relative min-h-[200px] min-w-[500px] rounded-lg border-2 border-dashed p-8 transition-all duration-300 ease-in-out ${isDragActive ? "border-primary bg-primary/10" : "hover:border-primary hover:bg-primary/5"} ${isExtracting ? "cursor-not-allowed opacity-50" : "cursor-pointer"} `}
    >
      <input
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
          <FileIcon className="w-12 h-12 text-gray-400" />
        )}
        <p className="font-medium text-lg text-center">
          {isDragActive
            ? "Drop the PDF here"
            : "Drag & drop a PDF file here, or click to select"}
        </p>
        <p className="text-gray-500 text-sm">Only PDF files are accepted</p>
      </div>
      {error && (
        <div className="absolute inset-0 flex justify-center items-center bg-destructive/10 rounded-lg">
          <div className="flex items-center space-x-2 bg-background shadow-lg p-4 rounded-md">
            <XCircleIcon className="w-6 h-6 text-destructive" />
            <p className="font-medium text-destructive text-sm">{error}</p>
          </div>
        </div>
      )}
      {isExtracting && (
        <div className="absolute inset-0 flex justify-center items-center bg-background/50 rounded-lg">
          <div className="border-primary border-t-2 border-b-2 rounded-full w-12 h-12 animate-spin"></div>
        </div>
      )}
      {file && !isExtracting && (
        <div className="mt-4 p-4 border rounded-lg">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <FileIcon className="w-6 h-6 text-primary" />
              <div>
                <p className="font-medium text-sm">{file.name}</p>
                <p className="text-gray-500 text-xs">
                  {(file.size / 1024 / 1024).toFixed(2)} MB • PDF
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
  );
}
