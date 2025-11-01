import { Outfit } from "next/font/google";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { ReactNode } from "react";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600"] });

export const metadata = {
    title: "HealthMate - Sehat ka Smart Dost | AI-Powered Health Companion",
    description: "HealthMate - Your AI-powered personal health vault. Upload medical reports, get instant bilingual AI analysis in English & Roman Urdu. Powered by Gemini AI. Developed by Muhammad Tayyab for SMIT Coding Night.",
};

export default function RootLayout({ children }:{children:ReactNode}) {
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
