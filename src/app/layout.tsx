import { Outfit } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { ReactNode } from "react";
import {
  ClerkProvider,
} from "@clerk/nextjs";

const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600"] });

export const metadata = {
  title: "HealthMate - Sehat ka Smart Dost | AI-Powered Health Companion",
  description:
    "HealthMate - Your AI-powered personal health vault. Upload medical reports, get instant bilingual AI analysis in English & Roman Urdu. Powered by Gemini AI. Developed by Muhammad Tayyab for SMIT Coding Night.",
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "HealthMate - Sehat ka Smart Dost | AI-Powered Health Companion",
    description:
      "Your AI-powered health tracker and report analyzer. Built with Next.js and Supabase.",
    url: "https://healthmate-snowy.vercel.app/",
    siteName: "HealthMate",
    images: [
      {
        url: "/logo.svg",
        width: 800,
        height: 600,
        alt: "HealthMate Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HealthMate - AI Health Companion",
    description:
      "Track your health data and get instant AI-based insights with HealthMate.",
    images: ["/logo.svg"],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${outfit.className} antialiased`}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            <Toaster />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
