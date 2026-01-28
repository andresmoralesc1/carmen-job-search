"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { ArrowRight, Loader2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AutocompleteJobTitles } from "@/components/ui/AutocompleteJobTitles";
import { Header, Footer } from "@/components";
import { Input } from "@/components/ui/Input";

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  jobTitles?: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jobTitles, setJobTitles] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validateStep1 = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: FormErrors = {};

    if (jobTitles.length === 0) {
      newErrors.jobTitles = "Add at least one job position";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (step === 1) {
      if (validateStep1()) {
        setStep(2);
      }
      return;
    }

    if (!validateStep2()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const API_BRIDGE_URL = process.env.NEXT_PUBLIC_API_BRIDGE_URL || 'http://localhost:3001';
      const response = await fetch(`${API_BRIDGE_URL}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          jobTitles: jobTitles
        })
      });

      const data = await response.json();

      if (!response.ok) {
        // Clear any existing tokens on error
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');

        // Handle specific error messages
        if (data.error?.includes('already exists')) {
          setErrors({ email: 'An account with this email already exists' });
        } else {
          setErrors({ email: data.error || 'Registration failed' });
        }
        return;
      }

      // Store tokens in localStorage
      if (data.tokens) {
        localStorage.setItem('accessToken', data.tokens.accessToken);
        localStorage.setItem('refreshToken', data.tokens.refreshToken);
      }

      toast.success("Account created successfully!", {
        description: "Welcome to Carmen Job Search",
        duration: 3000
      });

      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (error: any) {
      setErrors({ email: "Could not connect to server. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [field]: value });
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const getPasswordStrength = () => {
    const pwd = formData.password;
    if (!pwd) return { strength: 0, label: '', color: '' };

    let strength = 0;
    if (pwd.length >= 6) strength++;
    if (pwd.length >= 10) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;

    const levels = [
      { max: 2, label: 'Weak', color: 'bg-red-500' },
      { max: 3, label: 'Fair', color: 'bg-orange-500' },
      { max: 4, label: 'Good', color: 'bg-yellow-500' },
      { max: 5, label: 'Strong', color: 'bg-green-500' },
    ];

    const level = levels.find(l => strength <= l.max) || levels[levels.length - 1];
    return { strength, ...level };
  };

  const passwordStrength = getPasswordStrength();

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

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {step === 1 ? (
              <>
                {/* Name */}
                <Input
                  id="name"
                  type="text"
                  label="Full name"
                  placeholder="Ex: Mary Smith"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  error={errors.name}
                  disabled={isSubmitting}
                  required
                  autoComplete="name"
                />

                {/* Email */}
                <Input
                  id="email"
                  type="email"
                  label="Email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  error={errors.email}
                  disabled={isSubmitting}
                  required
                  autoComplete="email"
                />

                {/* Password */}
                <div className="space-y-2">
                  <Input
                    id="password"
                    type="password"
                    label="Password"
                    placeholder="Min. 6 characters"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    error={errors.password}
                    disabled={isSubmitting}
                    showPasswordToggle
                    required
                    autoComplete="new-password"
                    minLength={6}
                  />

                  {/* Password Strength Indicator */}
                  {formData.password && !errors.password && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${passwordStrength.color} transition-all duration-300`}
                            style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-zinc-500">{passwordStrength.label}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <Input
                  id="confirmPassword"
                  type="password"
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  error={errors.confirmPassword}
                  disabled={isSubmitting}
                  showPasswordToggle
                  required
                  autoComplete="new-password"
                  minLength={6}
                />

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
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-zinc-300">
                    Job positions you&apos;re looking for
                  </label>
                  <AutocompleteJobTitles
                    selectedTitles={jobTitles}
                    onAdd={(title) => {
                      setJobTitles([...jobTitles, title]);
                      if (errors.jobTitles) {
                        setErrors({ ...errors, jobTitles: undefined });
                      }
                    }}
                    onRemove={(title) => setJobTitles(jobTitles.filter((t) => t !== title))}
                    disabled={isSubmitting}
                  />
                  {errors.jobTitles && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      {errors.jobTitles}
                    </p>
                  )}
                </div>

                {/* Info box */}
                <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/20">
                  <p className="text-sm text-violet-400">
                    <Sparkles className="w-4 h-4 inline mr-1" />
                    <strong>Next step:</strong> After registering, you&apos;ll be able to add
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
                  onClick={() => {
                    setStep(1);
                    setErrors({});
                  }}
                  className="px-6 py-3 rounded-xl border border-zinc-700 text-white font-medium hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500"
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                disabled={isSubmitting || (step === 2 && jobTitles.length === 0)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 text-white font-semibold hover:from-violet-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
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
            <Link href="/login" className="text-violet-500 hover:text-violet-400 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
