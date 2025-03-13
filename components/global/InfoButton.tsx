"use client";

import { useState } from "react";

import { motion } from "framer-motion";

import { InfoPanel } from "@/components/global/InfoPanel";
import { CircleHelpIcon } from "@/components/icons/CircleHelpIcon";
import { Button } from "@/components/ui/button";

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
          className="relative bg-input/50 rounded-full w-9 h-9"
        >
          <CircleHelpIcon size={16} />
          <motion.span
            className="top-0 right-0.5 absolute bg-primary rounded-full w-2 h-2"
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
