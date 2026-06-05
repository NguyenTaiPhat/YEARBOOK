"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "@/components/ui/Icons";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function DarkModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <motion.button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative w-14 h-7 rounded-full border border-[var(--border-warm)] bg-[var(--bg-card)] flex items-center px-1 cursor-pointer"
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle dark mode"
      id="dark-mode-toggle"
    >
      <motion.div
        className="w-5 h-5 rounded-full bg-[var(--soft-gold)] flex items-center justify-center shadow-sm"
        animate={{ x: isDark ? 26 : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        {isDark ? (
          <Moon size={11} className="text-white" />
        ) : (
          <Sun size={11} className="text-white" />
        )}
      </motion.div>
    </motion.button>
  );
}
