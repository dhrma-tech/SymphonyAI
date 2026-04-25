import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SymphonyAI — The Prompt Operating System",
  description: "Convert your ideas into structured, tool-specific AI prompts. Build faster with curated workflows.",
};

import { Grain } from "@/components/shared/Grain";
import { CommandBar } from "@/components/shared/CommandBar";
import { AuthProvider } from "@/lib/context/AuthProvider";
import { WorkspaceProvider } from "@/lib/context/WorkspaceContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full selection:bg-black selection:text-white bg-white text-primary">
        <AuthProvider>
          <WorkspaceProvider>
            <Grain />
            <CommandBar />
            {children}
          </WorkspaceProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
