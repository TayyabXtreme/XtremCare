"use client";

import { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export const useClerkLogin = () => {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  // 📧 Email/Password Login
  const loginWithEmail = async (email: string, password: string) => {
    if (!isLoaded) return;
    try {
      setIsLoading(true);
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        toast.success("Login successful!");
        router.push("/sync");

      } else {
        toast.error("Additional verification required.");
      }
    } catch (err: unknown) {
      const error = err as { errors?: Array<{ message: string }> };
      toast.error(error.errors?.[0]?.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  // 🌐 Google OAuth
  const loginWithGoogle = async () => {
    if (!isLoaded) return;
    await signIn.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/sync",
    });
  };

  // 🍎 Apple OAuth
  const loginWithApple = async () => {
    if (!isLoaded) return;
    await signIn.authenticateWithRedirect({
      strategy: "oauth_apple",
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/sync",
    });
  };

  return {
    loginWithEmail,
    loginWithGoogle,
    loginWithApple,
    isLoading,
  };
};
