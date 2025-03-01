"use client";

import React from "react";

import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";

interface ErrorFallbackProps {
  error: Error | null;
}

export function NoDataFallback() {
  return (
    <motion.div
      className="flex min-h-[93vh] w-full flex-col items-center justify-center"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        className="mb-2 flex justify-center text-3xl font-bold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        No Data Available
      </motion.h1>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <p className="max-h-36 whitespace-pre-wrap text-center">
          It seems there is no data to display at the moment.
        </p>
      </motion.div>
    </motion.div>
  );
}

export function ErrorFallback({ error }: ErrorFallbackProps) {
  return (
    <motion.div
      className="flex min-h-[93vh] w-full flex-col items-center justify-center"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        className="mb-2 flex justify-center text-3xl font-bold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Error Occurred
      </motion.h1>
      <motion.div
        className="mb-6 flex max-w-2xl flex-col items-center overflow-auto rounded-md bg-muted p-2 font-mono text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <p className="max-h-36 whitespace-pre-wrap text-center">
          {error ? error.message : "An unknown error occurred."}
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Button onClick={() => window.location.reload()} effect="shineHover">
          Retry
        </Button>
      </motion.div>
    </motion.div>
  );
}
