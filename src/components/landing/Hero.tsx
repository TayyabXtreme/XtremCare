'use client';

import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, Shield, Calendar } from "lucide-react";
import { useTheme } from "next-themes";

export const Hero = () => {
  const { theme } = useTheme();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-gray-950 dark:via-gray-900 dark:to-green-950" />
      
      {/* Glassmorphism Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-green-400/30 dark:bg-green-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-500/20 dark:bg-green-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 dark:bg-gray-800/40 backdrop-blur-md border border-green-200/50 dark:border-green-800/50 mb-6 shadow-lg">
            <Heart className="w-4 h-4 text-green-600 dark:text-green-400 fill-green-600 dark:fill-green-400" />
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
              SMIT Coding Night - Sehat ka Smart Dost
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-green-600 via-green-700 to-green-800 dark:from-green-400 dark:via-green-500 dark:to-green-600 bg-clip-text text-transparent leading-tight">
            HealthMate <br />
            <span className="text-3xl md:text-4xl">Sehat ka Smart Dost</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Your AI-powered personal health companion. Upload medical reports, get instant AI analysis in English & Roman Urdu, and keep your entire health journey organized in one secure place.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              size="lg" 
              className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white px-8 py-6 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 group"
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-green-600 dark:border-green-500 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950 px-8 py-6 text-lg rounded-full backdrop-blur-sm bg-white/50 dark:bg-gray-900/50"
            >
              Learn More
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Heart, label: "Reports Analyzed", value: "10K+" },
              { icon: Shield, label: "Secure & Private", value: "100%" },
              { icon: Calendar, label: "AI Summaries", value: "Instant" },
            ].map((stat, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-white/40 dark:bg-gray-800/40 backdrop-blur-md border border-green-200/50 dark:border-green-800/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <stat.icon className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-3" />
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
