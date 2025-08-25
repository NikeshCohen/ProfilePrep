"use client";

import { useRouter } from "next/navigation";

import { motion } from "framer-motion";
import { Compass } from "lucide-react";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";

export default function GuidanceButton() {
  const router = useRouter();
  const { data: session } = useSession();

  const handleClick = () => {
    // Redirect to appropriate dashboard based on user type
    if (session?.user?.userType === "CANDIDATE") {
      router.push("/portal");
    } else if (session?.user?.userType === "RECRUITER") {
      router.push("/recruiter");
    } else {
      // Fallback for TESTER or other types
      router.push("/portal");
    }
  };

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button
        variant="outline"
        size="icon"
        onClick={handleClick}
        aria-label="Career Guidance"
        className="relative h-9 w-9 rounded-full bg-input/50"
      >
        <Compass size={16} />
        <motion.span
          className="absolute right-0.5 top-0 h-2 w-2 rounded-full bg-emerald-500"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ delay: 1.2, duration: 0.5 }}
        />
      </Button>
    </motion.div>
  );
}
