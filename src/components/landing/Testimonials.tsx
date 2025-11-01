'use client';

import { Card } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

export const Testimonials = () => {
  const testimonials = [
    {
      name: "Ahmed Khan",
      role: "Software Engineer",
      image: "�‍💻",
      rating: 5,
      text: "HealthMate ne meri zindagi asaan kar di! Sari reports ek jagah, aur AI summary bilkul clear hai. Roman Urdu mein samajhna bhi bohot easy hai.",
    },
    {
      name: "Dr. Fatima Ali",
      role: "General Physician",
      image: "�‍⚕️",
      rating: 5,
      text: "I recommend HealthMate to all my patients. The AI analysis helps them understand their reports before the consultation, making visits more productive.",
    },
    {
      name: "Sara Ahmed",
      role: "Mother & Teacher",
      image: "👩‍🏫",
      rating: 5,
      text: "Meri ammi ke liye perfect hai! Unki diabetes aur BP ki reports track karna ab bohot asaan ho gaya. Manual vitals bhi add kar sakti hoon.",
    },
    {
      name: "Bilal Hassan",
      role: "Student",
      image: "�‍🎓",
      rating: 5,
      text: "SMIT Coding Night ka best project! Upload karo report, AI instantly explain kar deta hai. Doctor se kya questions poochne hain wo bhi batata hai.",
    },
    {
      name: "Ayesha Malik",
      role: "Business Owner",
      image: "👩‍💼",
      rating: 5,
      text: "Security aur privacy top-notch hai. Meri family ki sari medical history safely store hai. Gemini AI ka analysis bilkul accurate aur helpful hai.",
    },
    {
      name: "Usman Tariq",
      role: "Diabetic Patient",
      image: "👨",
      rating: 5,
      text: "Daily sugar levels track karna, home remedies aur diet suggestions - sab kuch milta hai. Ye sirf app nahi, sehat ka smart dost hai!",
    },
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-green-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900" />
      
      {/* Glassmorphism Orbs */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-green-400/20 dark:bg-green-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-green-500/20 dark:bg-green-400/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            What Our <span className="text-green-600 dark:text-green-400">Users Say</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Real stories from real people using HealthMate - Sehat ka Smart Dost
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="p-8 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-green-200/50 dark:border-green-800/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group relative"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote className="w-12 h-12 text-green-600 dark:text-green-400" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed relative z-10">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 dark:from-green-500 dark:to-green-700 flex items-center justify-center text-2xl shadow-lg">
                  {testimonial.image}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
