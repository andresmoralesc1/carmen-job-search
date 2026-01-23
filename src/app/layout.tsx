import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "sonner";
import { SkipLink } from "@/components";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Carmen Job Search",
  description: "AI-powered automated job search",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SkipLink />
        <ErrorBoundary>
          <Providers>
            <div className="flex min-h-screen flex-col">
              <div className="flex-grow">
                {children}
              </div>
            </div>
          </Providers>
        </ErrorBoundary>
        <Toaster
          position="top-right"
          richColors
          closeButton
          theme="system"
          toastOptions={{
            className: "border-zinc-800 dark:border-zinc-800",
            style: {
              background: "var(--background)",
              border: "1px solid var(--border)",
            }
          }}
        />
      </body>
    </html>
  );
}
