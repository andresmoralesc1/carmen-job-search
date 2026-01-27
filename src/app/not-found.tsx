import Link from "next/link";
import { Home, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Icon */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-orange-500/10 flex items-center justify-center">
              <span className="text-6xl font-bold text-orange-500">404</span>
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
              <Search className="w-4 h-4 text-zinc-400" />
            </div>
          </div>
        </div>

        {/* Message */}
        <h1 className="text-2xl font-bold text-white mb-2">
          Page Not Found
        </h1>
        <p className="text-zinc-400 mb-8">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
          It might have been removed or doesn&apos;t exist.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-colors"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-zinc-800 text-white font-semibold hover:bg-zinc-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 rotate-180" />
            Dashboard
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-zinc-800">
          <p className="text-sm text-zinc-500 mb-4">Looking for something specific?</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/dashboard" className="text-sm text-orange-500 hover:text-orange-400 transition-colors">
              Dashboard
            </Link>
            <span className="text-zinc-700">•</span>
            <Link href="/register" className="text-sm text-orange-500 hover:text-orange-400 transition-colors">
              Sign Up
            </Link>
            <span className="text-zinc-700">•</span>
            <Link href="/login" className="text-sm text-orange-500 hover:text-orange-400 transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
