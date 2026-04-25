import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
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
  title: "SymphonyAI — From idea to execution.",
  description: "Structured AI workflows for planning, designing, and building digital products.",
};

import { Grain } from "@/components/shared/Grain";
import { SmoothScroll } from "@/components/shared/SmoothScroll";
import { CommandBar } from "@/components/shared/CommandBar";
import { ThemeProvider } from "@/lib/context/ThemeContext";
import { SpotlightCursor } from "@/components/shared/SpotlightCursor";
import { DesignPlayground } from "@/components/shared/DesignPlayground";

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
      <body className="min-h-full selection:bg-black selection:text-white transition-colors duration-500">
        <ThemeProvider>
          <SmoothScroll>
            <Grain />
            <SpotlightCursor />
            <DesignPlayground />
            <CommandBar />
            {children}
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
