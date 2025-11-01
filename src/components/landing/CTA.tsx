'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowRight, Mail, Phone, MapPin, Send } from "lucide-react";

export const CTA = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-green-700 to-green-800 dark:from-green-700 dark:via-green-800 dark:to-green-900" />
      
      {/* Glassmorphism Orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <Card className="p-12 bg-white/10 dark:bg-gray-900/30 backdrop-blur-xl border-2 border-white/20 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left Side - CTA Content */}
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                  Ready to Manage Your Health Smartly?
                </h2>
                <p className="text-xl text-green-100 mb-8 leading-relaxed">
                  Apni sehat ko control mein lao HealthMate ke sath. Upload reports, get AI analysis in English & Roman Urdu, 
                  aur apni complete health journey ko ek jagah manage karo.
                </p>

                {/* Benefits List */}
                <ul className="space-y-4 mb-8">
                  {[
                    "Upload medical reports instantly - PDF ya images",
                    "Gemini AI powered bilingual summaries",
                    "Doctor questions & dietary suggestions",
                    "100% secure & encrypted health vault",
                  ].map((benefit, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                        <ArrowRight className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-white font-medium">{benefit}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  size="lg"
                  className="bg-white text-green-700 hover:bg-green-50 px-8 py-6 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 group"
                >
                  Start Managing Your Health
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>

              {/* Right Side - Contact Form */}
              <div className="bg-white/10 dark:bg-gray-800/30 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-6">
                  Contact Us
                </h3>
                <form className="space-y-4">
                  <div>
                    <Input
                      type="text"
                      placeholder="Your Name"
                      className="bg-white/20 border-white/30 text-white placeholder:text-green-100 focus:border-white focus:ring-white"
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      placeholder="Your Email"
                      className="bg-white/20 border-white/30 text-white placeholder:text-green-100 focus:border-white focus:ring-white"
                    />
                  </div>
                  <div>
                    <Input
                      type="tel"
                      placeholder="Phone Number"
                      className="bg-white/20 border-white/30 text-white placeholder:text-green-100 focus:border-white focus:ring-white"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-white text-green-700 hover:bg-green-50 rounded-full py-6 text-lg font-semibold group"
                  >
                    Send Message
                    <Send className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </form>

                {/* Contact Info */}
                <div className="mt-8 pt-8 border-t border-white/20 space-y-4">
                  <div className="flex items-center gap-3 text-white">
                    <Mail className="w-5 h-5 text-green-200" />
                    <span className="text-sm">support@xtremcare.com</span>
                  </div>
                  <div className="flex items-center gap-3 text-white">
                    <Phone className="w-5 h-5 text-green-200" />
                    <span className="text-sm">+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center gap-3 text-white">
                    <MapPin className="w-5 h-5 text-green-200" />
                    <span className="text-sm">SMIT, Karachi, Pakistan</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
