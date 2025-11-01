'use client';

import { Github, Linkedin, Heart } from "lucide-react";
import Link from "next/link";

export const Footer = () => {
  const footerLinks = {
    product: [
      { name: "Features", href: "#features" },
      { name: "Pricing", href: "#pricing" },
      { name: "FAQ", href: "#faq" },
      { name: "Support", href: "#support" },
    ],
    company: [
      { name: "About Us", href: "#about" },
      { name: "Careers", href: "#careers" },
      { name: "Blog", href: "#blog" },
      { name: "Press Kit", href: "#press" },
    ],
    legal: [
      { name: "Privacy Policy", href: "#privacy" },
      { name: "Terms of Service", href: "#terms" },
      { name: "Cookie Policy", href: "#cookies" },
      { name: "HIPAA Compliance", href: "#hipaa" },
    ],
    resources: [
      { name: "Documentation", href: "#docs" },
      { name: "API Reference", href: "#api" },
      { name: "Community", href: "#community" },
      { name: "Health Tips", href: "#tips" },
    ],
  };

  return (
    <footer className="relative overflow-hidden border-t border-green-200 dark:border-green-800">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-950" />
      
      {/* Glassmorphism Orb */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-green-400/10 dark:bg-green-500/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-600 to-green-700 dark:from-green-500 dark:to-green-600 flex items-center justify-center shadow-lg">
                  <Heart className="w-6 h-6 text-white fill-white" />
                </div>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  HealthMate
                </span>
              </div>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm">
              Sehat ka Smart Dost - Your AI-powered personal health companion. 
              Making healthcare management accessible through bilingual AI summaries 
              and secure health tracking.
            </p>
            <div className="flex gap-4">
              <Link
                href="https://github.com/TayyabXtreme/XtremCare"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-green-200/50 dark:border-green-800/50 flex items-center justify-center hover:bg-green-600 dark:hover:bg-green-500 hover:text-white transition-all duration-300 group"
              >
                <Github className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-white" />
              </Link>
              <Link
                href="https://www.linkedin.com/in/muhammad-tayyab-xtreme"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-green-200/50 dark:border-green-800/50 flex items-center justify-center hover:bg-green-600 dark:hover:bg-green-500 hover:text-white transition-all duration-300 group"
              >
                <Linkedin className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-white" />
              </Link>
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="py-8 border-t border-green-200/50 dark:border-green-800/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center md:text-left">
              © 2025 HealthMate. Built with ❤️ for{" "}
              <span className="font-semibold text-green-600 dark:text-green-400">
                SMIT Coding Night
              </span>
              {" "}- Yeh sirf ek project nahi, ek real-life problem ka digital solution hai.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Developed by{" "}
              <Link
                href="https://www.linkedin.com/in/muhammad-tayyab-xtreme"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-green-600 dark:text-green-400 hover:underline"
              >
                Muhammad Tayyab
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
