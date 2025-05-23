"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { ModeToggle } from "./ui/mode-toggle";

export function ThemeToggleWrapper() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Wait until component is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <ModeToggle />;
} 