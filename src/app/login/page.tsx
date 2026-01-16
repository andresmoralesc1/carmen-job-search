"use client";

import { useState } from "react";
import Link from "next/link";
import { Briefcase, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email
    if (!formData.email || !formData.password) {
      toast.error("Complete all fields", {
        description: "Email and password are required"
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Invalid email", {
        description: "Enter a valid email"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // TODO: Login API call to API Bridge
      console.log("Logging in:", formData);

      toast.success("Welcome back!", {
        description: "You have successfully logged in",
        duration: 2000
      });

      // Redirect to dashboard
      setTimeout(() => {
        router.push("/dashboard");
      }, 500);
    } catch (error) {
      toast.error("Login error", {
        description: "Incorrect email or password. Try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black">
      {/* Header */}
      <header className="border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-2">
          <Briefcase className="w-8 h-8 text-orange-500" />
          <h1 className="text-xl font-bold text-white">Carmen Job Search</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-16">
        {/* Hero Text */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Sign in
          </h2>
          <p className="text-zinc-400">
            Continue your automated job search
          </p>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Email
              </label>
              <input
                type="email"
                required
                disabled={isSubmitting}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="tu@email.com"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  disabled={isSubmitting}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 disabled:cursor-not-allowed transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  disabled={isSubmitting}
                  className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-orange-500 focus:ring-orange-500 focus:ring-offset-0 disabled:cursor-not-allowed"
                />
                <span className="text-sm text-zinc-400">Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-orange-500 hover:text-orange-400 transition-colors"
              >
                Forgot your password?
              </Link>
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
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Sign up link */}
          <p className="mt-6 text-center text-sm text-zinc-500">
            Don't have an account?{" "}
            <Link href="/register" className="text-orange-500 hover:text-orange-400 font-medium transition-colors">
              Sign up for free
            </Link>
          </p>
        </div>

        {/* Back to home */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <span>←</span>
            Back to home
          </Link>
        </div>
      </main>
    </div>
  );
}
