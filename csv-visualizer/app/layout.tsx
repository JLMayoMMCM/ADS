import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EU Energy Dashboard",
  description: "EU-27 gross electricity and heat production 1999–2024, with WEKA ML clustering and classification results.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn(geistSans.variable, geistMono.variable, "font-sans", inter.variable)} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-background text-foreground">{children}</body>
    </html>
  );
}
