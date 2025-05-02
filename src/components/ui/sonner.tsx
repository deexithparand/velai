"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          // "--normal-bg": "var(--popover)",
          // "--normal-text": "var(--popover-foreground)",
          // "--normal-border": "var(--border)",
          "--normal-bg": "#1e293b", // dark slate
          "--normal-text": "#f8fafc", // light
          "--normal-border": "#334155", // muted
          "--success-bg": "#22c55e",   // green
          "--error-bg": "#ef4444",     // red
          "--info-bg": "#3b82f6",      // blue
          "--warning-bg": "#facc15",   // yellow
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
