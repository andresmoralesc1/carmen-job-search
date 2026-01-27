import Link from "next/link";
import { CheckCircle2, ArrowLeft, Home } from "lucide-react";
import { Header, Footer } from "@/components";

export default function ResetPasswordSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black">
      <Header />
      <main className="flex items-center justify-center p-4" style={{ minHeight: 'calc(100vh - 180px)' }}>
        <div className="max-w-md w-full text-center">
          {/* Success Icon */}
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-2xl font-bold text-white mb-2">
            Password Reset Successfully!
          </h1>
          <p className="text-zinc-400 mb-8">
            Your password has been updated. You can now login with your new password.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-colors"
            >
              Go to Login
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-zinc-800 text-white font-semibold hover:bg-zinc-700 transition-colors"
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
