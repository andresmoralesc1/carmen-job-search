import Link from "next/link";
import { Sparkles, Github, ArrowRight, Check, Twitter, Linkedin } from "lucide-react";

const linkUnderlineClass = `
  relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0
  after:h-0.5 after:bg-orange-500 after:transition-all after:duration-300
  hover:after:w-full
`;

const socialLinkClass = `
  p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800
  transition-all duration-300 hover:scale-110 hover:-translate-y-1
  active:scale-95
`;

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-800 mt-32">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4 group cursor-pointer">
              <div className="relative">
                <Sparkles className="w-8 h-8 text-orange-500 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" />
                <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <h3 className="text-lg font-bold text-white transition-colors duration-300 group-hover:text-orange-400">
                Carmen Job Search
              </h3>
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
                className={socialLinkClass}
                aria-label="GitHub repository"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                className={socialLinkClass}
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className={socialLinkClass}
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/register" className={`${linkUnderlineClass} text-zinc-500 hover:text-orange-500 text-sm transition-colors flex items-center gap-1 group`}>
                  <ArrowRight className="w-3 h-3 text-orange-500 transition-transform duration-300 group-hover:translate-x-1" />
                  Sign Up
                </Link>
              </li>
              <li>
                <Link href="/features" className={`${linkUnderlineClass} text-zinc-500 hover:text-orange-500 text-sm transition-colors flex items-center gap-1 group`}>
                  <ArrowRight className="w-3 h-3 text-orange-500 transition-transform duration-300 group-hover:translate-x-1" />
                  Features
                </Link>
              </li>
              <li>
                <Link href="/about" className={`${linkUnderlineClass} text-zinc-500 hover:text-orange-500 text-sm transition-colors flex items-center gap-1 group`}>
                  <ArrowRight className="w-3 h-3 text-orange-500 transition-transform duration-300 group-hover:translate-x-1" />
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
                <Link href="/dashboard" className={`${linkUnderlineClass} text-zinc-500 hover:text-orange-500 text-sm transition-colors flex items-center gap-1 group`}>
                  <ArrowRight className="w-3 h-3 text-orange-500 transition-transform duration-300 group-hover:translate-x-1" />
                  Dashboard
                </Link>
              </li>
              <li>
                <a href="https://github.com/andresmoralesc1/carmen-job-search" className={`${linkUnderlineClass} text-zinc-500 hover:text-orange-500 text-sm transition-colors flex items-center gap-1 group`} target="_blank" rel="noopener noreferrer">
                  <Github className="w-3 h-3 transition-transform duration-300 group-hover:rotate-12" />
                  GitHub Repo
                </a>
              </li>
              <li>
                <a href="mailto:hello@neuralflow.ai" className={`${linkUnderlineClass} text-zinc-500 hover:text-orange-500 text-sm transition-colors flex items-center gap-1 group`}>
                  <Check className="w-3 h-3 text-zinc-500 transition-transform duration-300 group-hover:rotate-90 group-hover:text-orange-500" />
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
                <Link href="/privacy" className={`${linkUnderlineClass} text-zinc-500 hover:text-orange-500 text-sm transition-colors flex items-center gap-1 group`}>
                  <ArrowRight className="w-3 h-3 text-orange-500 transition-transform duration-300 group-hover:translate-x-1" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className={`${linkUnderlineClass} text-zinc-500 hover:text-orange-500 text-sm transition-colors flex items-center gap-1 group`}>
                  <ArrowRight className="w-3 h-3 text-orange-500 transition-transform duration-300 group-hover:translate-x-1" />
                  Terms of Service
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
        </div>
      </div>
    </footer>
  );
}
