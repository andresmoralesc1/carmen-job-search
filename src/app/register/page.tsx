"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2, Sparkles, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AutocompleteJobTitles } from "@/components/ui/AutocompleteJobTitles";
import { Header, Footer } from "@/components";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [jobTitles, setJobTitles] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1) {
      // Validate step 1
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        toast.error("Complete all fields", {
          description: "Name, email, and password are required"
        });
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast.error("Invalid email", {
          description: "Enter a valid email"
        });
        return;
      }

      // Validate password
      if (formData.password.length < 6) {
        toast.error("Password too short", {
          description: "Password must be at least 6 characters"
        });
        return;
      }

      // Validate password match
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords don't match", {
          description: "Please confirm your password"
        });
        return;
      }

      setStep(2);
    } else {
      // Validate step 2
      if (jobTitles.length === 0) {
        toast.error("Add at least one position", {
          description: "You must add at least one job position"
        });
        return;
      }

      setIsSubmitting(true);

      try {
        // Call API to register - use API Bridge URL directly
        const API_BRIDGE_URL = process.env.NEXT_PUBLIC_API_BRIDGE_URL || 'http://localhost:3001';
        const response = await fetch(`${API_BRIDGE_URL}/api/users/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include', // Include cookies for httpOnly auth
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            jobTitles: jobTitles
          })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Registration failed');
        }

        // Store tokens in localStorage (in production, use httpOnly cookies)
        if (data.tokens) {
          localStorage.setItem('accessToken', data.tokens.accessToken);
          localStorage.setItem('refreshToken', data.tokens.refreshToken);
        }

        toast.success("Account created successfully!", {
          description: "Welcome to Carmen Job Search",
          duration: 3000
        });

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      } catch (error: any) {
        toast.error("Error creating account", {
          description: error.message || "Could not complete registration. Try again."
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black">
      <Header />

      <main className="max-w-2xl mx-auto px-6 py-16">
        {/* Progress */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className={`flex items-center gap-2 ${step >= 1 ? "text-violet-500" : "text-zinc-600"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              step >= 1 ? "bg-violet-500 text-white" : "bg-zinc-800 text-zinc-500"
            }`}>
              1
            </div>
            <span className="font-medium">Account</span>
          </div>
          <div className={`w-16 h-1 rounded ${step >= 2 ? "bg-violet-500" : "bg-zinc-800"}`} />
          <div className={`flex items-center gap-2 ${step >= 2 ? "text-violet-500" : "text-zinc-600"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              step >= 2 ? "bg-violet-500 text-white" : "bg-zinc-800 text-zinc-500"
            }`}>
              2
            </div>
            <span className="font-medium">Preferences</span>
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            {step === 1 ? "Create your account" : "What are you looking for?"}
          </h2>
          <p className="text-zinc-400 mb-8">
            {step === 1
              ? "Start your automated job search in seconds"
              : "Tell us which positions interest you"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 ? (
              <>
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Full name
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isSubmitting}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Ex: Mary Smith"
                  />
                </div>

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
                    className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="your@email.com"
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
                      className="w-full px-4 py-3 pr-12 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Min. 6 characters"
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      disabled={isSubmitting}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full px-4 py-3 pr-12 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Confirm your password"
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="mt-1 text-sm text-red-500">Passwords do not match</p>
                  )}
                </div>

                {/* Info box */}
                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <p className="text-sm text-blue-400">
                    <strong>Simple & Secure:</strong> Your password is encrypted with bcrypt.
                    You can add your OpenAI API key later in Settings.
                  </p>
                </div>
              </>
            ) : (
              <>
                {/* Job Titles with Autocomplete */}
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Job positions you're looking for
                  </label>
                  <AutocompleteJobTitles
                    selectedTitles={jobTitles}
                    onAdd={(title) => setJobTitles([...jobTitles, title])}
                    onRemove={(title) => setJobTitles(jobTitles.filter((t) => t !== title))}
                    disabled={isSubmitting}
                  />
                </div>

                {/* Info box */}
                <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/20">
                  <p className="text-sm text-violet-400">
                    <Sparkles className="w-4 h-4 inline mr-1" />
                    <strong>Next step:</strong> After registering, you'll be able to add
                    specific companies you want to monitor, configure your OpenAI API key in Settings,
                    and set up notification schedules.
                  </p>
                </div>
              </>
            )}

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              {step === 2 && (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setStep(1)}
                  className="px-6 py-3 rounded-xl border border-zinc-700 text-white font-medium hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                disabled={isSubmitting || (step === 2 && jobTitles.length === 0)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 text-white font-semibold hover:from-violet-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {step === 1 ? "Validating..." : "Creating account..."}
                  </>
                ) : (
                  <>
                    {step === 1 ? "Continue" : "Create account"}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-500">
            Already have an account?{" "}
            <Link href="/login" className="text-violet-500 hover:text-violet-400 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
