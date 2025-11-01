"use client";
import { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { toast } from "react-hot-toast";

export const useClerkSignup = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [pendingVerification, setPendingVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  const signupWithEmail = async (email: string, password: string, fullName: string) => {
    if (!isLoaded) return;

    try {
      await signUp.create({
        emailAddress: email,
        password,
        firstName: fullName,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      toast.success("Verification code sent to your email!");
      setPendingVerification(true);
    } catch (err: any) {
      toast.error(err.errors?.[0]?.message || "Signup failed!");
    }
  };

  const verifyEmailCode = async () => {
    if (!isLoaded) return;

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        toast.success("Account verified successfully!");
        setPendingVerification(false);
        window.location.href = "/sync";
      }
    } catch (err: any) {
      toast.error(err.errors?.[0]?.message || "Invalid code!");
    }
  };

  const signupWithOAuth = async (provider: "oauth_google" | "oauth_apple") => {
    if (!isLoaded) return;

    try {
      await signUp.authenticateWithRedirect({
        strategy: provider,
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/sync",
      });
    } catch (err: any) {
      toast.error(err.errors?.[0]?.message || "OAuth signup failed!");
    }
  };

  return {
    signupWithEmail,
    signupWithOAuth,
    verifyEmailCode,
    verificationCode,
    setVerificationCode,
    pendingVerification,
  };
};
