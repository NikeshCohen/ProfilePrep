// LogoutButton.tsx
import React from "react";

import { useRouter } from "next/navigation";

import { handleLogout } from "@/actions/auth.actions";
import { motion } from "framer-motion";

import { LogoutIcon } from "@/components/icons/LogOutIcon";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  const router = useRouter();

  async function handleClick() {
    await handleLogout();
    router.refresh();
  }

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button
        variant="outline"
        size="icon"
        onClick={handleClick}
        aria-label="Log out"
        className="relative h-9 w-9 rounded-full bg-input/50"
      >
        <LogoutIcon size={16} />
      </Button>
    </motion.div>
  );
}
