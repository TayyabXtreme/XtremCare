import { Outfit } from "next/font/google";
import { Toaster } from "react-hot-toast";
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
    title: "XtremCart - Shop Smarter, Live Better",
    description: "XtremCart - Your ultimate destination for the latest gadgets and electronics. Developed by Muhammad Tayyab.",
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
