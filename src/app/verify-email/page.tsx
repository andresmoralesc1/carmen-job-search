"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle, Loader2, Mail, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Header, Footer } from "@/components";
import { useRouter } from "next/navigation";

const API_BRIDGE_URL = process.env.NEXT_PUBLIC_API_BRIDGE_URL || 'http://localhost:3001';

function VerifyEmailLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black">
      <Header />
      <main className="flex items-center justify-center p-4" style={{ minHeight: 'calc(100vh - 180px)' }}>
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-zinc-400">Verifying your email...</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus("error");
        setMessage("No verification token provided. Please check your email link.");
        return;
      }

      try {
        const response = await fetch(`${API_BRIDGE_URL}/api/users/verify-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        });

        const data = await response.json();

        if (response.ok) {
          setStatus("success");
          setMessage(data.message || "Email verified successfully!");
          toast.success("Email verified", {
            description: "Your account is now fully activated.",
          });
        } else {
          setStatus("error");
          setMessage(data.error || "Failed to verify email. The link may be expired.");
          toast.error("Verification failed", {
            description: data.error || "Please try again or request a new link.",
          });
        }
      } catch (error) {
        setStatus("error");
        setMessage("Could not connect to the server. Please try again later.");
        toast.error("Connection error", {
          description: "Please check your internet connection.",
        });
      }
    };

    verifyEmail();
  }, [token]);

  if (status === "loading") {
    return <VerifyEmailLoading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black">
      <Header />
      <main className="flex items-center justify-center p-4" style={{ minHeight: 'calc(100vh - 180px)' }}>
        <div className="max-w-md w-full text-center">
          {/* Icon */}
          <div className="mb-6 flex justify-center">
            {status === "success" ? (
              <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center">
                <XCircle className="w-10 h-10 text-red-500" />
              </div>
            )}
          </div>

          {/* Message */}
          <h1 className="text-2xl font-bold text-white mb-2">
            {status === "success" ? "Email Verified!" : "Verification Failed"}
          </h1>
          <p className="text-zinc-400 mb-8">
            {message}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {status === "success" ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-colors"
              >
                Go to Dashboard
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </Link>
            ) : (
              <>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-colors"
                >
                  Back to Register
                </Link>
                <button
                  onClick={async () => {
                    setIsResending(true);
                    try {
                      toast.info("Sending verification email...", {
                        description: "Please check your inbox"
                      });
                      await fetch(`${API_BRIDGE_URL}/api/users/resend-verification`, {
                        method: 'POST',
                        credentials: 'include',
                        headers: { 'Content-Type': 'application/json' }
                      });
                      toast.success("Verification email sent!", {
                        description: "Check your inbox for the verification link"
                      });
                    } catch (error) {
                      toast.error("Failed to send verification email", {
                        description: "Please try again later"
                      });
                    } finally {
                      setIsResending(false);
                    }
                  }}
                  disabled={isResending}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-zinc-800 text-white font-semibold hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isResending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      Request New Email
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerifyEmailLoading />}>
      <VerifyEmailContent />
    </Suspense>
  );
}
