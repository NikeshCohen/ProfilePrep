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
      className="flex flex-col justify-center items-center w-full min-h-[93vh]"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        className="flex justify-center mb-2 font-bold text-3xl"
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
        <p className="max-h-36 text-center whitespace-pre-wrap">
          It seems there is no data to display at the moment.
        </p>
      </motion.div>
    </motion.div>
  );
}

export function ErrorFallback({ error }: ErrorFallbackProps) {
  return (
    <motion.div
      className="flex flex-col justify-center items-center w-full min-h-[93vh]"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        className="flex justify-center mb-2 font-bold text-3xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Error Occurred
      </motion.h1>
      <motion.div
        className="flex flex-col items-center bg-muted mb-6 p-2 rounded-md max-w-2xl overflow-auto font-mono text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <p className="max-h-36 text-center whitespace-pre-wrap">
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
