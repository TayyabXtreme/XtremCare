'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useClerkSignup } from '@/hooks/useClerkSignup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Heart, Mail, Lock, User, Loader2, ArrowLeft, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

export default function RegisterPage() {
  const {
    signupWithEmail,
    signupWithOAuth,
    verifyEmailCode,
    verificationCode,
    setVerificationCode,
    pendingVerification,
  } = useClerkSignup();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await signupWithEmail(email, password, fullName);
    setIsLoading(false);
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await verifyEmailCode();
    setIsLoading(false);
  };

  if (pendingVerification) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-gray-950 dark:via-gray-900 dark:to-green-950" />
        
        {/* Glassmorphism Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-400/30 dark:bg-green-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-500/20 dark:bg-green-400/10 rounded-full blur-3xl animate-pulse" />

        <div className="w-full max-w-md relative z-10">
          <Card className="p-8 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-green-200/50 dark:border-green-800/50 shadow-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                <ShieldCheck className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Verify Your Email
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                We sent a 6-digit code to
              </p>
              <p className="text-green-600 dark:text-green-400 font-semibold">
                {email}
              </p>
            </div>

            {/* Verification Form */}
            <form onSubmit={handleVerification} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 text-center">
                  Enter 6-Digit Verification Code
                </label>
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={verificationCode}
                    onChange={setVerificationCode}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} className="w-12 h-12 text-lg border-2 border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-900/50" />
                      <InputOTPSlot index={1} className="w-12 h-12 text-lg border-2 border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-900/50" />
                      <InputOTPSlot index={2} className="w-12 h-12 text-lg border-2 border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-900/50" />
                      <InputOTPSlot index={3} className="w-12 h-12 text-lg border-2 border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-900/50" />
                      <InputOTPSlot index={4} className="w-12 h-12 text-lg border-2 border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-900/50" />
                      <InputOTPSlot index={5} className="w-12 h-12 text-lg border-2 border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-900/50" />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>

              {/* Verify Button */}
              <Button
                type="submit"
                disabled={isLoading || verificationCode.length !== 6}
                className="w-full py-6 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-lg font-semibold"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify & Continue'
                )}
              </Button>

              {/* Resend Code */}
              <div className="text-center">
                <button
                  type="button"
                  className="text-sm text-green-600 dark:text-green-400 hover:underline"
                  onClick={() => signupWithEmail(email, password, fullName)}
                >
                  Didn&apos;t receive the code? Resend
                </button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-gray-950 dark:via-gray-900 dark:to-green-950" />
      
      {/* Glassmorphism Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-green-400/30 dark:bg-green-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-500/20 dark:bg-green-400/10 rounded-full blur-3xl animate-pulse" />

      <div className="w-full max-w-md relative z-10">
        <Card className="p-8 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-green-200/50 dark:border-green-800/50 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-600 to-green-700 dark:from-green-500 dark:to-green-600 flex items-center justify-center shadow-lg">
                <Heart className="w-7 h-7 text-white fill-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                HealthMate
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Create Account
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Apni sehat ka safar shuru karo
            </p>
          </div>

          {/* OAuth Buttons */}
          <div className="flex gap-3 mb-6">
            <Button
              onClick={() => signupWithOAuth('oauth_google')}
              variant="outline"
              className="flex-1 h-14 border-2 border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-950 transition-all duration-300"
              type="button"
            >
              <Image
                src="/google.svg"
                alt="Google"
                width={24}
                height={24}
                className="flex-shrink-0"
              />
            </Button>

            <Button
              onClick={() => signupWithOAuth('oauth_apple')}
              variant="outline"
              className="flex-1 h-14 border-2 border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-950 transition-all duration-300"
              type="button"
            >
              <Image
                src="/apple.svg"
                alt="Apple"
                width={24}
                height={24}
                className="flex-shrink-0"
              />
            </Button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white/60 dark:bg-gray-800/60 text-gray-600 dark:text-gray-400">
                Or sign up with email
              </span>
            </div>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="pl-10 py-6 bg-white/50 dark:bg-gray-900/50 border-gray-300 dark:border-gray-600 focus:border-green-500 dark:focus:border-green-400 focus:ring-green-500 dark:focus:ring-green-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="pl-10 py-6 bg-white/50 dark:bg-gray-900/50 border-gray-300 dark:border-gray-600 focus:border-green-500 dark:focus:border-green-400 focus:ring-green-500 dark:focus:ring-green-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className="pl-10 py-6 bg-white/50 dark:bg-gray-900/50 border-gray-300 dark:border-gray-600 focus:border-green-500 dark:focus:border-green-400 focus:ring-green-500 dark:focus:ring-green-400"
                  required
                  minLength={8}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Minimum 8 characters required
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-6 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-lg font-semibold"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create HealthMate Account'
              )}
            </Button>
          </form>

          {/* Login Link */}
          <p className="text-center mt-6 text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-green-600 dark:text-green-400 font-semibold hover:underline"
            >
              Login here
            </Link>
          </p>
        </Card>

        {/* Footer Note */}
        <p className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
          By signing up, you agree to our{' '}
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
