"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect } from "react"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  
  useEffect(() => {
    console.log("Current theme:", theme)
  }, [theme])

  return (
    <button
      onClick={() => {
        const newTheme = theme === "dark" ? "light" : "dark"
        console.log("Setting theme to:", newTheme)
        setTheme(newTheme)
      }}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-neutral-200 bg-white p-2 text-neutral-700 transition-colors hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-200 dark:hover:bg-neutral-800"
      aria-label="Toggle theme"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </button>
  )
} 