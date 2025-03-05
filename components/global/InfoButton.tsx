"use client";

import { useState } from "react";

import { InfoPanel } from "@/app/app/_components/InfoPanel";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";

import { CircleHelpIcon } from "../icons/CircleHelpIcon";

export default function InfoButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(true)}
          aria-label="AI Information"
          className="relative h-9 w-9 rounded-full bg-input/50"
        >
          <CircleHelpIcon size={16} />
          <motion.span
            className="absolute right-0.5 top-0 h-2 w-2 rounded-full bg-primary"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ delay: 1, duration: 0.5 }}
          />
        </Button>
      </motion.div>
      <InfoPanel isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
}
