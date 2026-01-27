"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { Loader2, ArrowLeft, Lock, CheckCircle, Eye, EyeOff, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { Header, Footer } from "@/components";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoadingToken, setIsLoadingToken] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(true);

  // Validate token on mount
  useEffect(() => {
    if (!token) {
      setIsTokenValid(false);
      setIsLoadingToken(false);
      return;
    }

    // Token format validation (64 hex chars for 32 bytes)
    const tokenRegex = /^[a-f0-9]{64}$/i;
    if (!tokenRegex.test(token)) {
      setIsTokenValid(false);
      setIsLoadingToken(false);
      return;
    }

    setIsLoadingToken(false);
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate passwords
    if (!password || !confirmPassword) {
      toast.error("Password required", {
        description: "Please enter and confirm your new password"
      });
      return;
    }

    if (password.length < 6) {
      toast.error("Password too short", {
        description: "Password must be at least 6 characters"
      });
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords don't match", {
        description: "Please make sure both passwords are the same"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const API_BRIDGE_URL = process.env.NEXT_PUBLIC_API_BRIDGE_URL || 'https://carmen.neuralflow.space';
      const response = await fetch(`${API_BRIDGE_URL}/api/users/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to reset password');
      }

      toast.success("Password reset successful!", {
        description: "Redirecting to login...",
        duration: 2000
      });

      // Redirect to success page after a short delay
      setTimeout(() => {
        router.push("/reset-password/success");
      }, 500);
    } catch (error) {
      toast.error("Reset failed", {
        description: error instanceof Error ? error.message : "Invalid or expired reset link"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state for token validation
  if (isLoadingToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black">
        <Header />
        <main className="max-w-2xl mx-auto px-6 py-16">
          <div className="flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Invalid token state
  if (!isTokenValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black">
        <Header />
        <main className="max-w-2xl mx-auto px-6 py-16">
          <Link
            href="/forgot-password"
            className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to forgot password
          </Link>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mb-4">
              <ShieldAlert className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Invalid Reset Link
            </h2>
            <p className="text-zinc-400 mb-6">
              This password reset link is invalid or has expired. Please request a new one.
            </p>
            <Link
              href="/forgot-password"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-all hover:scale-[1.02]"
            >
              Request New Link
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black">
        <Header />
        <main className="max-w-2xl mx-auto px-6 py-16">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to sign in
          </Link>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Password Reset Successful
            </h2>
            <p className="text-zinc-400 mb-6">
              Your password has been reset successfully. You can now login with your new password.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-all hover:scale-[1.02]"
            >
              Continue to Login
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Reset form
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black">
      <Header />

      <main className="max-w-2xl mx-auto px-6 py-16">
        {/* Back link */}
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to sign in
        </Link>

        {/* Hero Text */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-500/10 mb-4">
            <Lock className="w-8 h-8 text-orange-500" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Reset Your Password
          </h2>
          <p className="text-zinc-400">
            Enter your new password below
          </p>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isSubmitting}
                  minLength={6}
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isSubmitting}
                  minLength={6}
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Password strength indicator */}
            {password && (
              <div className="space-y-2">
                <div className="flex gap-1">
                  <div className={`h-1 flex-1 rounded-full ${password.length >= 6 ? 'bg-green-500' : 'bg-zinc-700'}`} />
                  <div className={`h-1 flex-1 rounded-full ${password.length >= 10 ? 'bg-green-500' : 'bg-zinc-700'}`} />
                  <div className={`h-1 flex-1 rounded-full ${password.length >= 12 ? 'bg-green-500' : 'bg-zinc-700'}`} />
                </div>
                <p className="text-xs text-zinc-500">
                  {password.length < 6 ? "Too short" : password.length < 10 ? "Weak" : password.length < 12 ? "Medium" : "Strong"}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !password || !confirmPassword || password !== confirmPassword}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Resetting...
                </>
              ) : (
                <>
                  Reset Password
                  <Lock className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Sign in link */}
          <p className="mt-6 text-center text-sm text-zinc-500">
            Remember your password?{" "}
            <Link href="/login" className="text-orange-500 hover:text-orange-400 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// Loading fallback for Suspense
function ResetPasswordLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black">
      <Header />
      <main className="max-w-2xl mx-auto px-6 py-16">
        <div className="flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        </div>
      </main>
      <Footer />
    </div>
  );
}

// Main page component with Suspense boundary
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordLoading />}>
      <ResetPasswordContent />
    </Suspense>
  );
}
