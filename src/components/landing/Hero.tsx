'use client';

import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, Shield, Calendar, Sparkles, Brain, FileText } from "lucide-react";
import { useTheme } from "next-themes";
import { SignUpButton } from '@clerk/nextjs';

export const Hero = () => {
  const { theme } = useTheme();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-gray-950 dark:via-gray-900 dark:to-green-950" />
      
      {/* Enhanced Glassmorphism Orbs with Animation */}
      <div className="absolute top-32 left-10 w-80 h-80 bg-gradient-to-r from-green-400/30 to-green-600/20 dark:from-green-500/20 dark:to-green-400/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-l from-green-500/25 to-green-300/15 dark:from-green-400/15 dark:to-green-600/10 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-200/20 dark:bg-green-800/10 rounded-full blur-2xl animate-pulse delay-500" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto text-center">
          {/* Enhanced Badge with Animation */}
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border-2 border-green-200/60 dark:border-green-800/60 mb-8 shadow-2xl hover:shadow-green-200/50 dark:hover:shadow-green-800/50 transition-all duration-500 group">
            <div className="relative">
              <Heart className="w-5 h-5 text-green-600 dark:text-green-400 fill-green-600 dark:fill-green-400" />
              <div className="absolute inset-0 w-5 h-5 bg-green-400/30 rounded-full blur-sm animate-ping" />
            </div>
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 tracking-wide">
              SMIT Coding Night • Sehat ka Smart Dost
            </span>
            <Sparkles className="w-4 h-4 text-green-500 dark:text-green-400 animate-pulse" />
          </div>

          {/* Enhanced Main Heading */}
          <div className="relative mb-8">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-extrabold mb-4 bg-gradient-to-r from-green-600 via-green-700 to-green-800 dark:from-green-400 dark:via-green-500 dark:to-green-600 bg-clip-text text-transparent leading-[0.9] tracking-tight">
              HealthMate
            </h1>
            <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-gray-200 mb-2">
              <span className="bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 dark:from-gray-300 dark:via-gray-200 dark:to-gray-100 bg-clip-text text-transparent">
                Sehat ka Smart Dost
              </span>
            </div>
            <div className="absolute -inset-4 bg-gradient-to-r from-green-600/20 to-green-400/20 dark:from-green-400/10 dark:to-green-600/10 blur-3xl -z-10 animate-pulse" />
          </div>

          {/* Enhanced Subheading */}
          <p className="text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-4xl mx-auto leading-relaxed font-medium">
            Your <span className="text-green-600 dark:text-green-400 font-semibold">AI-powered personal health vault</span>. 
            Upload medical reports, get <span className="text-green-600 dark:text-green-400 font-semibold">instant bilingual AI analysis</span> in English & Roman Urdu, 
            and keep your entire health journey organized in one secure place.
          </p>

          {/* Enhanced CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <SignUpButton mode="modal">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-green-600 via-green-700 to-green-800 hover:from-green-700 hover:via-green-800 hover:to-green-900 dark:from-green-500 dark:via-green-600 dark:to-green-700 dark:hover:from-green-600 dark:hover:via-green-700 dark:hover:to-green-800 text-white px-10 py-8 text-xl font-bold rounded-full shadow-2xl hover:shadow-green-500/50 dark:hover:shadow-green-400/30 transition-all duration-500 group hover:scale-105 border-2 border-green-500/20"
              >
                <Brain className="mr-3 w-6 h-6 group-hover:scale-110 transition-transform" />
                Get Started Free
                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </Button>
            </SignUpButton>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-3 border-green-600 dark:border-green-500 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/80 px-10 py-8 text-xl font-bold rounded-full backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 group"
            >
              <FileText className="mr-3 w-6 h-6 group-hover:scale-110 transition-transform" />
              View Demo
            </Button>
          </div>

          {/* Enhanced Professional Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { 
                icon: Heart, 
                label: "Medical Reports Analyzed", 
                value: "50K+", 
                description: "Trusted by thousands",
                gradient: "from-red-500 to-pink-500"
              },
              { 
                icon: Shield, 
                label: "Data Security & Privacy", 
                value: "100%", 
                description: "Bank-level encryption",
                gradient: "from-green-500 to-emerald-500"
              },
              { 
                icon: Brain, 
                label: "AI Analysis Speed", 
                value: "< 3s", 
                description: "Instant health insights",
                gradient: "from-blue-500 to-purple-500"
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="group relative p-8 rounded-3xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border-2 border-green-200/60 dark:border-green-800/60 shadow-2xl hover:shadow-green-200/50 dark:hover:shadow-green-800/30 transition-all duration-500 hover:-translate-y-2 hover:scale-105"
              >
                {/* Animated Background Glow */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-green-500/10 to-green-600/10 dark:from-green-400/5 dark:to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Icon with Gradient Background */}
                <div className={`relative w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${stat.gradient} p-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-8 h-8 text-white mx-auto" />
                  <div className="absolute inset-0 rounded-2xl bg-white/20 animate-ping opacity-0 group-hover:opacity-100" />
                </div>
                
                {/* Stats Value */}
                <p className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.value}
                </p>
                
                {/* Stats Label */}
                <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  {stat.label}
                </p>
                
                {/* Stats Description */}
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  {stat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};