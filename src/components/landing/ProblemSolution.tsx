'use client';

import { Card } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, FileSearch, Brain, Languages, Shield } from "lucide-react";

export const ProblemSolution = () => {
  const problems = [
    {
      icon: FileSearch,
      title: "Lost Reports",
      description: "WhatsApp aur folders mein khoye reports. Doctor poochtay hain 'Pichlay reports laao' toh panic mode!",
    },
    {
      icon: AlertCircle,
      title: "Complex Medical Terms",
      description: "Lab reports samajh nahi aatay. WBC, Hb, SGPT - yeh sab kya hai? Google se confuse ho jao.",
    },
    {
      icon: FileSearch,
      title: "No Tracking",
      description: "BP, Sugar levels ka koi record nahi. Trend dekhnay ka koi asaan tareeqa nahi.",
    },
  ];

  const solutions = [
    {
      icon: Shield,
      title: "Secure Health Vault",
      description: "Sari reports ek secure jagah. PDF, images, prescriptions - sab organized aur safe.",
    },
    {
      icon: Brain,
      title: "AI Explains Everything",
      description: "Gemini AI reports ko padhta hai aur simple words mein explain karta hai. Abnormal values highlight hoti hain.",
    },
    {
      icon: Languages,
      title: "Bilingual Summaries",
      description: "English aur Roman Urdu dono mein summary. Doctor questions bhi suggest hote hain.",
    },
  ];

  return (
    <section className="py-20 relative overflow-hidden" id="about">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-green-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900" />
      
      {/* Glassmorphism Orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-400/10 dark:bg-green-500/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Story Section */}
        <div className="max-w-4xl mx-auto mb-20 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
            The <span className="text-green-600 dark:text-green-400">Real-Life Story</span>
          </h2>
          <div className="p-8 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-green-200/50 dark:border-green-800/50 shadow-xl">
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              Har ghar mein koi na koi hai jisko regular tests aur prescriptions ki zaroorat hoti hai. 
              In sab files, reports, aur follow-ups ko manage karna bohot mushkil ho jata hai.
            </p>
            <p className="text-xl font-semibold text-green-700 dark:text-green-400 leading-relaxed">
              Jab doctor poochta hai <span className="italic">&quot;Pichlay reports laao&quot;</span>, 
              toh hum WhatsApp ya purane folders mein dhoondte reh jaate hain 😩
            </p>
          </div>
        </div>

        {/* Problem & Solution Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {/* Problems */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-red-500/20 dark:bg-red-500/10 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                The Problems
              </h3>
            </div>
            <div className="space-y-4">
              {problems.map((problem, index) => (
                <Card
                  key={index}
                  className="p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-red-200/50 dark:border-red-800/50 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-red-500/20 dark:bg-red-500/10 flex items-center justify-center flex-shrink-0">
                      <problem.icon className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                        {problem.title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        {problem.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Solutions */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 dark:bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                Our Solutions
              </h3>
            </div>
            <div className="space-y-4">
              {solutions.map((solution, index) => (
                <Card
                  key={index}
                  className="p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-green-200/50 dark:border-green-800/50 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-green-500/20 dark:bg-green-500/10 flex items-center justify-center flex-shrink-0">
                      <solution.icon className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                        {solution.title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        {solution.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-16 max-w-3xl mx-auto">
          <div className="p-6 rounded-xl bg-yellow-500/10 dark:bg-yellow-500/5 border border-yellow-500/30 dark:border-yellow-500/20">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-1" />
              <div>
                <p className="text-gray-800 dark:text-gray-200 font-medium mb-1">
                  Important Disclaimer
                </p>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  AI is for understanding only, not for medical advice. 
                  <span className="block mt-1 italic">
                    Yeh AI sirf samajhne ke liye hai, ilaaj ke liye nahi. Always consult your doctor before making any decision.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
