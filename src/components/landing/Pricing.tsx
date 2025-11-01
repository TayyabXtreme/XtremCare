'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Check } from "lucide-react";

export const Pricing = () => {
  const plans = [
    {
      name: "Basic",
      price: "$0",
      period: "forever",
      description: "Perfect for individuals starting their health journey",
      features: [
        "Access to general practitioners",
        "Basic health tracking",
        "Email support",
        "Health tips & articles",
        "Appointment reminders",
      ],
      popular: false,
    },
    {
      name: "Premium",
      price: "$29",
      period: "per month",
      description: "Ideal for those seeking comprehensive care",
      features: [
        "All Basic features",
        "Access to specialists",
        "Priority appointment booking",
        "24/7 chat support",
        "Advanced health analytics",
        "Family health management",
        "Prescription management",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "per month",
      description: "Complete healthcare solution for organizations",
      features: [
        "All Premium features",
        "Dedicated account manager",
        "Custom integrations",
        "Team health dashboard",
        "Wellness programs",
        "Annual health checkups",
        "Insurance coordination",
      ],
      popular: false,
    },
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-white dark:bg-gray-900" />
      
      {/* Glassmorphism Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-400/20 dark:bg-green-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-500/20 dark:bg-green-400/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            Choose Your <span className="text-green-600 dark:text-green-400">Plan</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Flexible pricing options to suit your healthcare needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`p-8 relative overflow-hidden backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 ${
                plan.popular
                  ? "bg-gradient-to-br from-green-600 to-green-700 dark:from-green-500 dark:to-green-600 border-green-400 shadow-2xl scale-105"
                  : "bg-white/60 dark:bg-gray-800/60 border-green-200/50 dark:border-green-800/50 hover:shadow-xl"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-white dark:bg-gray-900 text-green-600 dark:text-green-400 px-4 py-1 rounded-bl-lg text-sm font-semibold">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3
                  className={`text-2xl font-bold mb-2 ${
                    plan.popular ? "text-white" : "text-gray-900 dark:text-white"
                  }`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`text-sm ${
                    plan.popular ? "text-green-100" : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {plan.description}
                </p>
              </div>

              <div className="mb-6">
                <div className="flex items-end gap-1">
                  <span
                    className={`text-5xl font-bold ${
                      plan.popular ? "text-white" : "text-gray-900 dark:text-white"
                    }`}
                  >
                    {plan.price}
                  </span>
                  <span
                    className={`text-lg mb-2 ${
                      plan.popular ? "text-green-100" : "text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    /{plan.period}
                  </span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check
                      className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                        plan.popular ? "text-green-200" : "text-green-600 dark:text-green-400"
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        plan.popular ? "text-white" : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full ${
                  plan.popular
                    ? "bg-white text-green-600 hover:bg-green-50"
                    : "bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white"
                } rounded-full py-6 text-lg font-semibold group`}
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
