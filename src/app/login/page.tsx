'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useClerkLogin } from '@/hooks/useClerkLogin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Heart, Mail, Lock, Loader2, ArrowLeft } from 'lucide-react';
import Image from 'next/image';

export default function LoginPage() {
  const { loginWithEmail, loginWithGoogle, loginWithApple, isLoading } = useClerkLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await loginWithEmail(email, password);
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-gray-950 dark:via-gray-900 dark:to-green-950" />
      
      {/* Glassmorphism Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-green-400/30 dark:bg-green-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-500/20 dark:bg-green-400/10 rounded-full blur-3xl animate-pulse" />

      <div className="w-full max-w-md relative z-10">
        <Card className="p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-green-200/50 dark:border-green-800/50 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-5">
            <div className="inline-flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-600 to-green-700 dark:from-green-500 dark:to-green-600 flex items-center justify-center shadow-lg">
                <Heart className="w-6 h-6 text-white fill-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                HealthMate
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              Welcome Back
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Apni sehat ka khayal rakho, login karo
            </p>
          </div>

          {/* OAuth Buttons */}
          <div className="flex gap-3 mb-4">
            <Button
              onClick={loginWithGoogle}
              variant="outline"
              className="flex-1 h-11 border-2 border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-950 transition-all duration-300 flex items-center justify-center"
              type="button"
            >
              <Image
                src="/google.svg"
                alt="Google"
                width={20}
                height={20}
              />
            </Button>

            <Button
              onClick={loginWithApple}
              variant="outline"
              className="flex-1 h-11 border-2 border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-950 transition-all duration-300 flex items-center justify-center"
              type="button"
            >
              <Image
                src="/apple.svg"
                alt="Apple"
                width={20}
                height={20}
              />
            </Button>
          </div>

          {/* Divider */}
          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white/60 dark:bg-gray-800/60 text-gray-600 dark:text-gray-400">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Email Login Form */}
          <form onSubmit={handleEmailLogin} className="space-y-1">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="pl-10 h-11 bg-white/50 dark:bg-gray-900/50 border-gray-300 dark:border-gray-600 focus:border-green-500 dark:focus:border-green-400 focus:ring-green-500 dark:focus:ring-green-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="pl-10 h-11 bg-white/50 dark:bg-gray-900/50 border-gray-300 dark:border-gray-600 focus:border-green-500 dark:focus:border-green-400 focus:ring-green-500 dark:focus:ring-green-400"
                  required
                />
              </div>
            </div>

            

            {/* Clerk CAPTCHA Container - Turnstile will be injected here by Clerk */}
            <div 
              id="clerk-captcha" 
              className="clerk-captcha flex justify-center items-center  min-h-[65px]"
            />

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Login to HealthMate'
              )}
            </Button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="text-green-600 dark:text-green-400 font-semibold hover:underline"
            >
              Sign up here
            </Link>
          </p>
        </Card>

        {/* Footer Note */}
        <p className="text-center mt-4 text-xs text-gray-600 dark:text-gray-400">
          By continuing, you agree to our{' '}
          <Link href="/terms" className="text-green-600 dark:text-green-400 hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-green-600 dark:text-green-400 hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
