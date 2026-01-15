"use client";

import { NextUIProvider } from "@nextui-org/react";
import { theme } from "@/theme";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider theme={theme}>
      {children}
    </NextUIProvider>
  );
}
