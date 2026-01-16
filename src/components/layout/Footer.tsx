import Link from "next/link";
import { Briefcase, Github, Twitter, Heart } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-800 mt-32">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="w-8 h-8 text-orange-500" />
              <h3 className="text-lg font-bold text-white">Carmen Job Search</h3>
            </div>
            <p className="text-zinc-500 text-sm mb-4">
              AI-powered automated job search. Find your dream job effortlessly.
            </p>
            <p className="text-zinc-600 text-xs">Built by Neuralflow</p>
            <div className="flex items-center gap-3 mt-4">
              <a
                href="https://github.com/andresmoralesc1/carmen-job-search"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
                aria-label="GitHub repository"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
                aria-label="Twitter profile"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/register" className="text-zinc-500 hover:text-orange-500 text-sm transition-colors">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link href="/features" className="text-zinc-500 hover:text-orange-500 text-sm transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-zinc-500 hover:text-orange-500 text-sm transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard" className="text-zinc-500 hover:text-orange-500 text-sm transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <a href="https://github.com/andresmoralesc1/carmen-job-search" className="text-zinc-500 hover:text-orange-500 text-sm transition-colors" target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              </li>
              <li>
                <a href="mailto:hello@neuralflow.ai" className="text-zinc-500 hover:text-orange-500 text-sm transition-colors">
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-zinc-500 hover:text-orange-500 text-sm transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-zinc-500 hover:text-orange-500 text-sm transition-colors">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-zinc-500 text-sm">
            &copy; {currentYear} Carmen Job Search by Neuralflow. All rights reserved.
          </p>
          <p className="text-zinc-600 text-sm flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" aria-label="love" /> for job seekers
          </p>
        </div>
      </div>
    </footer>
  );
}
