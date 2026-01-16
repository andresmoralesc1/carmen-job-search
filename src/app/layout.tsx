import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "sonner";
import { SkipLink } from "@/components";

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
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SkipLink />
        <Providers>{children}</Providers>
        <Toaster
          position="top-right"
          richColors
          closeButton
          theme="dark"
          toastOptions={{
            className: "border-zinc-800",
            style: {
              background: "#18181b",
              border: "1px solid #27272a",
            }
          }}
        />
      </body>
    </html>
  );
}
