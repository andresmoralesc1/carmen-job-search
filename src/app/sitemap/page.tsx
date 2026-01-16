import Link from "next/link";
import { Header, Footer } from "@/components";
import { FileText, Home, Users, Briefcase, Settings, Shield, Scale, HelpCircle } from "lucide-react";

export const metadata = {
  title: "Sitemap - Carmen Job Search",
  description: "Complete site map of Carmen Job Search pages",
};

export default function SitemapPage() {
  const sections = [
    {
      title: "Main Pages",
      icon: Home,
      links: [
        { href: "/", label: "Home", description: "Landing page with hero section and features overview" },
        { href: "/features", label: "Features", description: "Detailed features of our AI-powered job search" },
        { href: "/about", label: "About Us", description: "Learn about Neuralflow and our mission" },
      ],
    },
    {
      title: "Account",
      icon: Users,
      links: [
        { href: "/login", label: "Sign In", description: "Login to your account" },
        { href: "/register", label: "Sign Up", description: "Create a new account" },
      ],
    },
    {
      title: "Dashboard",
      icon: Briefcase,
      links: [
        { href: "/dashboard", label: "Dashboard", description: "Main dashboard overview" },
        { href: "/dashboard/jobs", label: "Job Opportunities", description: "View and manage found jobs" },
        { href: "/dashboard/companies", label: "Monitored Companies", description: "Manage tracked companies" },
        { href: "/dashboard/preferences", label: "Preferences", description: "Configure your job search preferences" },
      ],
    },
    {
      title: "Legal",
      icon: Shield,
      links: [
        { href: "/privacy", label: "Privacy Policy", description: "How we handle your data" },
        { href: "/terms", label: "Terms of Service", description: "Terms and conditions" },
      ],
    },
    {
      title: "Support",
      icon: HelpCircle,
      links: [
        { href: "mailto:hello@neuralflow.ai", label: "Contact Support", description: "Get help from our team" },
        { href: "https://github.com/andresmoralesc1/carmen-job-search", label: "GitHub Repository", description: "View source code" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black">
      <Header />

      <main id="main-content" className="max-w-7xl mx-auto px-6 py-24">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 mb-6">
            <FileText className="w-4 h-4 text-orange-500" />
            <span className="text-orange-400 text-sm font-medium">Sitemap</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Site Map
          </h1>

          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Navigate all pages of Carmen Job Search easily. Everything you need to
            find your dream job.
          </p>
        </div>

        {/* Sitemap Sections */}
        <div className="grid md:grid-cols-2 gap-8">
          {sections.map((section) => (
            <div
              key={section.title}
              className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8"
            >
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-zinc-800">
                <section.icon className="w-6 h-6 text-orange-500" />
                <h2 className="text-xl font-semibold text-white">{section.title}</h2>
              </div>

              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="block group"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-white font-medium group-hover:text-orange-500 transition-colors">
                            {link.label}
                          </h3>
                          <p className="text-zinc-500 text-sm mt-1">
                            {link.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-zinc-400 mb-6">
            Can't find what you're looking for?
          </p>
          <a
            href="mailto:hello@neuralflow.ai"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-colors"
          >
            Contact Support
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
