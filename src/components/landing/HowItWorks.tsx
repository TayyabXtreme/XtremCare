'use client';

import { Card } from "@/components/ui/card";
import { Upload, Sparkles, FileCheck, Timer } from "lucide-react";

export const HowItWorks = () => {
  const steps = [
    {
      icon: Upload,
      step: "01",
      title: "Upload Your Reports",
      description: "Upload karo apni medical reports - PDFs, images, lab results, X-rays, ya prescriptions. Sab kuch ek jagah securely store.",
      details: ["Support for PDF & Images", "Drag & drop interface", "Automatic file organization"],
    },
    {
      icon: Sparkles,
      step: "02",
      title: "AI Analyzes Instantly",
      description: "Gemini AI aapki report ko read karta hai aur analysis karta hai automatically. No manual work, no OCR hassle.",
      details: ["Powered by Gemini 1.5 Pro", "Instant processing", "Multimodal understanding"],
    },
    {
      icon: FileCheck,
      step: "03",
      title: "Get Bilingual Summary",
      description: "Receive detailed summary in English & Roman Urdu with highlighted abnormal values, doctor questions, food suggestions, and home remedies.",
      details: ["English + Roman Urdu", "Highlighted abnormalities", "Actionable insights"],
    },
    {
      icon: Timer,
      step: "04",
      title: "Track Your Health",
      description: "View complete medical timeline. Manually add vitals (BP, Sugar, Weight) bhi kar sakte ho. Apni sehat ka complete record rakho.",
      details: ["Complete health timeline", "Manual vitals entry", "Progress tracking"],
    },
  ];

  return (
    <section className="py-20 relative overflow-hidden" id="how-it-works">
      {/* Background */}
      <div className="absolute inset-0 bg-white dark:bg-gray-900" />
      
      {/* Glassmorphism Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-400/20 dark:bg-green-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-500/20 dark:bg-green-400/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            How <span className="text-green-600 dark:text-green-400">HealthMate</span> Works
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Sirf 4 simple steps mein apni health ko manage karo
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {steps.map((step, index) => (
            <Card
              key={index}
              className="p-8 relative overflow-hidden backdrop-blur-xl bg-white/60 dark:bg-gray-800/60 border border-green-200/50 dark:border-green-800/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group"
            >
              {/* Step Number */}
              <div className="absolute top-4 right-4 text-6xl font-bold text-green-600/10 dark:text-green-400/10 group-hover:text-green-600/20 dark:group-hover:text-green-400/20 transition-colors">
                {step.step}
              </div>

              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-700 dark:from-green-400 dark:to-green-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <step.icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                  {step.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  {step.description}
                </p>

                <ul className="space-y-2">
                  {step.details.map((detail, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-600 dark:bg-green-400" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>

        {/* Tech Stack Section */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">
            Powered by <span className="text-green-600 dark:text-green-400">Modern Tech</span>
          </h3>
          <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
            {[
              "React / Next.js",
              "Gemini 1.5 Pro",
              "OpenRouter",
              "MongoDB Atlas",
              "Node.js",
              "Cloudinary",
              "JWT Auth",
              "Tailwind CSS",
            ].map((tech, index) => (
              <div
                key={index}
                className="px-6 py-3 rounded-full bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-green-200/50 dark:border-green-800/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  {tech}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
