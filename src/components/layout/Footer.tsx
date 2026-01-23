import Link from "next/link";
import { Sparkles, Github, ArrowRight, Check, Twitter, Linkedin, Heart, Zap } from "lucide-react";
import { CarmenLogo } from "@/components/CarmenLogo";

const linkUnderlineClass = `
  relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0
  after:h-0.5 after:bg-violet-500 after:transition-all after:duration-300
  hover:after:w-full
`;

const socialLinkClass = `
  p-2.5 rounded-lg text-zinc-500 hover:text-white hover:bg-violet-500/10
  border border-transparent hover:border-violet-500/20
  transition-all duration-300 hover:scale-110 hover:-translate-y-1
  active:scale-95 group
`;

const sectionLinkClass = `
  flex items-center gap-2 text-zinc-400 hover:text-violet-400
  transition-all duration-300 group py-1
`;

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-800/50 mt-32 bg-gradient-to-b from-transparent to-zinc-950/50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Newsletter Section */}
        <div className="mb-12 p-6 rounded-2xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/20 relative overflow-hidden group">
          <div className="absolute inset-0 bg-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-violet-500/20">
                <Sparkles className="w-6 h-6 text-violet-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Stay Updated</h3>
                <p className="text-sm text-zinc-400">Get the latest job opportunities delivered to your inbox</p>
              </div>
            </div>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 text-white font-medium hover:from-violet-600 hover:to-purple-600 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-violet-500/30 active:scale-95"
            >
              <Zap className="w-4 h-4" />
              Get Started Free
            </Link>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4 group">
              <div className="relative">
                <CarmenLogo size="default" withGlow animated />
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-lg font-bold text-white transition-colors duration-300 group-hover:text-violet-400">
                  Carmen
                </h3>
                <span className="text-xs text-zinc-500">AI-Powered Search</span>
              </div>
            </Link>
            <p className="text-zinc-500 text-sm mb-4 leading-relaxed">
              Find your dream job with AI-powered automation. We monitor companies and match opportunities to your preferences.
            </p>
            <div className="flex items-center gap-2 text-xs text-zinc-600 mb-4">
              <span>Built with</span>
              <Heart className="w-3 h-3 text-red-500 animate-pulse" />
              <span>by Neuralflow</span>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-2">
              <a
                href="https://github.com/andresmoralesc1/carmen-job-search"
                target="_blank"
                rel="noopener noreferrer"
                className={socialLinkClass}
                aria-label="GitHub repository"
              >
                <Github className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
              </a>
              <a
                href="#"
                className={socialLinkClass}
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
              </a>
              <a
                href="#"
                className={socialLinkClass}
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-400" />
              Product
            </h4>
            <ul className="space-y-1">
              <li>
                <Link href="/register" className={sectionLinkClass}>
                  <ArrowRight className="w-3 h-3 text-violet-500 transition-transform duration-300 group-hover:translate-x-1" />
                  <span className="text-sm">Sign Up Free</span>
                </Link>
              </li>
              <li>
                <Link href="/features" className={sectionLinkClass}>
                  <ArrowRight className="w-3 h-3 text-violet-500 transition-transform duration-300 group-hover:translate-x-1" />
                  <span className="text-sm">Features</span>
                </Link>
              </li>
              <li>
                <Link href="/about" className={sectionLinkClass}>
                  <ArrowRight className="w-3 h-3 text-violet-500 transition-transform duration-300 group-hover:translate-x-1" />
                  <span className="text-sm">About Us</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-violet-400" />
              Resources
            </h4>
            <ul className="space-y-1">
              <li>
                <Link href="/dashboard" className={sectionLinkClass}>
                  <ArrowRight className="w-3 h-3 text-violet-500 transition-transform duration-300 group-hover:translate-x-1" />
                  <span className="text-sm">Dashboard</span>
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/andresmoralesc1/carmen-job-search"
                  className={sectionLinkClass}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="w-3 h-3 transition-transform duration-300 group-hover:rotate-12" />
                  <span className="text-sm">GitHub Repo</span>
                </a>
              </li>
              <li>
                <a href="mailto:hello@neuralflow.ai" className={sectionLinkClass}>
                  <Check className="w-3 h-3 transition-transform duration-300 group-hover:rotate-90 group-hover:text-violet-500" />
                  <span className="text-sm">Support</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-1">
              <li>
                <Link href="/privacy" className={sectionLinkClass}>
                  <ArrowRight className="w-3 h-3 text-zinc-600 group-hover:text-violet-500 transition-transform duration-300 group-hover:translate-x-1" />
                  <span className="text-sm">Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link href="/terms" className={sectionLinkClass}>
                  <ArrowRight className="w-3 h-3 text-zinc-600 group-hover:text-violet-500 transition-transform duration-300 group-hover:translate-x-1" />
                  <span className="text-sm">Terms of Service</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-zinc-800/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-zinc-500 text-sm flex items-center gap-2">
            <span>&copy; {currentYear} Carmen Job Search</span>
            <span className="text-zinc-700">•</span>
            <span className="text-zinc-600">Made with AI by Neuralflow</span>
          </p>
          <div className="flex items-center gap-4 text-xs text-zinc-600">
            <Link href="/privacy" className="hover:text-violet-400 transition-colors">Privacy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-violet-400 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
