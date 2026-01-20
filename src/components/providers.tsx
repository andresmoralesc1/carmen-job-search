"use client";

import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider } from "@/components/ThemeProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <NextUIProvider>{children}</NextUIProvider>
    </ThemeProvider>
  );
}
