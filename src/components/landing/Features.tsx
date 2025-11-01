'use client';

import { FileText, Brain, Languages, Calendar, Shield, Heart, Upload, TrendingUp, MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

export const Features = () => {
  const features = [
    {
      icon: Upload,
      title: "Upload Medical Reports",
      description: "Upload any medical report - PDFs, images, lab results, X-rays, or prescriptions. All your health documents in one secure vault.",
      gradient: "from-green-400 to-green-600",
    },
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Gemini AI reads and analyzes your reports instantly. No manual OCR needed - just upload and get insights in seconds.",
      gradient: "from-emerald-400 to-emerald-600",
    },
    {
      icon: Languages,
      title: "Bilingual Summaries",
      description: "Get easy-to-understand summaries in both English and Roman Urdu. 'Samajhne ka asaan tareeqa' for everyone.",
      gradient: "from-teal-400 to-teal-600",
    },
    {
      icon: MessageCircle,
      title: "Doctor Questions & Tips",
      description: "AI suggests 3-5 important questions to ask your doctor, plus dietary recommendations and home remedies based on your reports.",
      gradient: "from-green-500 to-green-700",
    },
    {
      icon: Calendar,
      title: "Health Timeline",
      description: "View your complete medical history sorted by date. Track vitals like BP, sugar, weight manually even without reports.",
      gradient: "from-lime-400 to-lime-600",
    },
    {
      icon: Shield,
      title: "100% Secure & Private",
      description: "JWT authentication, encrypted data, and signed URLs. Your health information is protected with enterprise-grade security.",
      gradient: "from-green-600 to-green-800",
    },
    {
      icon: FileText,
      title: "Report Highlights",
      description: "AI automatically identifies and highlights abnormal values (high WBC, low Hb, etc.) so you know what needs attention.",
      gradient: "from-emerald-500 to-emerald-700",
    },
    {
      icon: TrendingUp,
      title: "Manual Vitals Tracking",
      description: "Add BP, Sugar, Weight readings manually. Track your daily health metrics even without lab reports.",
      gradient: "from-teal-500 to-teal-700",
    },
    {
      icon: Heart,
      title: "Health Reminders",
      description: "Get friendly reminders and health tips. Always includes: 'Always consult your doctor before making any decision.'",
      gradient: "from-green-400 to-green-600",
    },
  ];

  return (
    <section className="py-20 relative overflow-hidden" id="features">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-green-50/50 to-white dark:from-gray-900 dark:via-green-950/30 dark:to-gray-900" />
      
      {/* Glassmorphism Orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-green-400/10 dark:bg-green-500/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            What <span className="text-green-600 dark:text-green-400">HealthMate</span> Provides
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Powered by <span className="font-bold text-green-600 dark:text-green-400">Gemini AI & OpenRouter</span> - Your complete health management solution
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-8 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-green-200/50 dark:border-green-800/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group"
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
