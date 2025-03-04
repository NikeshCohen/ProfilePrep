"use client";

import React from "react";

import { useRouter } from "next/navigation";

import { motion } from "framer-motion";
import { PowerCircle } from "lucide-react";
import { signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await signOut();
    router.push("/login");
  }

  return (
    <>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          variant="outline"
          size="icon"
          onClick={handleLogout}
          aria-label="AI Information"
          className="relative h-9 w-9 rounded-full bg-input/50"
        >
          <PowerCircle size={16} />
        </Button>
      </motion.div>
    </>
  );
}
