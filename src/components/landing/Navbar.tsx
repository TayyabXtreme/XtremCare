'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, Menu, X, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl shadow-2xl border-b-2 border-green-200/60 dark:border-green-800/60"
          : "bg-white/10 dark:bg-gray-900/10 backdrop-blur-md"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Enhanced Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-green-600 via-green-700 to-green-800 dark:from-green-500 dark:via-green-600 dark:to-green-700 flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-300 border-2 border-green-500/20">
              <Heart className="w-7 h-7 text-white fill-white group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tight group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                HealthMate
              </span>
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 -mt-1">
                Smart Health Companion
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Side - Theme Toggle & Auth */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-10 h-10 rounded-lg hover:bg-green-100 dark:hover:bg-green-900 transition-colors"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              )}
            </Button>

            {/* Auth Buttons - Desktop */}
            <div className="hidden md:flex items-center gap-3">
              <SignedOut>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-950"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white rounded-full px-6">
                    Get Started
                  </Button>
                </Link>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard">
                  <Button className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white rounded-full px-6">
                    Dashboard
                  </Button>
                </Link>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10 rounded-full border-2 border-green-600 dark:border-green-400",
                    },
                  }}
                />
              </SignedIn>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden w-10 h-10 rounded-lg hover:bg-green-100 dark:hover:bg-green-900"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-green-200/50 dark:border-green-800/50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-medium py-2 px-4 rounded-lg hover:bg-green-50 dark:hover:bg-green-950 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t border-green-200/50 dark:border-green-800/50">
                <SignedOut>
                  <Link href="/login">
                    <Button
                      variant="outline"
                      className="w-full border-green-600 dark:border-green-500 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white">
                      Get Started
                    </Button>
                  </Link>
                </SignedOut>
                <SignedIn>
                  <Link href="/dashboard">
                    <Button className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white">
                      Dashboard
                    </Button>
                  </Link>
                  <div className="flex items-center justify-center py-2">
                    <UserButton
                      appearance={{
                        elements: {
                          avatarBox: "w-12 h-12 rounded-full border-2 border-green-600 dark:border-green-400",
                        },
                      }}
                    />
                  </div>
                </SignedIn>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
