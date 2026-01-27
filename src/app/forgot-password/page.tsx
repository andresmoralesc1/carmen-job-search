"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, ArrowLeft, Mail, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { Header, Footer } from "@/components";

export default function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email
    if (!email) {
      toast.error("Email required", {
        description: "Please enter your email address"
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email", {
        description: "Enter a valid email address"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // API call to send password reset email
      const API_BRIDGE_URL = process.env.NEXT_PUBLIC_API_BRIDGE_URL || 'https://carmen.neuralflow.space';
      const response = await fetch(`${API_BRIDGE_URL}/api/users/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        throw new Error('Failed to send reset email');
      }

      setIsSuccess(true);

      toast.success("Email sent!", {
        description: "Check your inbox for password reset instructions",
        duration: 5000
      });
    } catch (error) {
      toast.error("Request failed", {
        description: "Unable to send reset email. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <Mail className="w-8 h-8 text-orange-500" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Forgot your password?
          </h2>
          <p className="text-zinc-400">
            {isSuccess
              ? "Check your email for reset instructions"
              : "Enter your email and we'll send you a reset link"
            }
          </p>
        </div>

        {!isSuccess ? (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  required
                  disabled={isSubmitting}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="tu@email.com"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send reset link
                    <Mail className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Sign up link */}
            <p className="mt-6 text-center text-sm text-zinc-500">
              Remember your password?{" "}
              <Link href="/login" className="text-orange-500 hover:text-orange-400 font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        ) : (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>

            <h3 className="text-xl font-semibold text-white mb-2">
              Check your inbox
            </h3>

            <p className="text-zinc-400 mb-6">
              We've sent a password reset link to <strong className="text-white">{email}</strong>.
              The link will expire in 1 hour.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setIsSuccess(false);
                  setEmail("");
                }}
                className="w-full px-6 py-3 rounded-xl bg-zinc-800 text-white font-medium hover:bg-zinc-700 transition-colors"
              >
                Try another email
              </button>

              <Link
                href="/login"
                className="block w-full px-6 py-3 rounded-xl border border-zinc-700 text-white font-medium hover:bg-zinc-800 transition-colors"
              >
                Back to sign in
              </Link>
            </div>

            <p className="mt-6 text-sm text-zinc-500">
              Didn't receive the email? Check your spam folder or{" "}
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="text-orange-500 hover:text-orange-400 font-medium disabled:cursor-not-allowed"
              >
                resend
              </button>
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
