import Link from "next/link";
import {
  Sparkles,
  Search,
  Bell,
  Building2,
  Settings,
  BarChart3,
  Shield,
  Zap,
  Clock,
  Globe,
  Target,
  ArrowRight,
  Check,
} from "lucide-react";
import { Header, Footer, Button } from "@/components";

export default function FeaturesPage() {
  const features = [
    {
      icon: Search,
      title: "Automated Search",
      description:
        "Our bots (scrapers) search 24/7 on LinkedIn, Indeed and company pages to find the best offers.",
      details: [
        "LinkedIn Job Search",
        "Indeed",
        "Company pages",
        "Real-time updates",
      ],
    },
    {
      icon: Target,
      title: "AI Matching",
      description:
        "OpenAI GPT-4 analyzes each offer and compares it with your preferences to find the best match.",
      details: [
        "Semantic analysis",
        "Skills matching",
        "Relevance scoring",
        "Continuous learning",
      ],
    },
    {
      icon: Bell,
      title: "Email Alerts",
      description:
        "Receive instant notifications when offers that match your profile appear.",
      details: [
        "Real-time notifications",
        "Daily/weekly summaries",
        "Custom filters",
        "No spam, only what's relevant",
      ],
    },
    {
      icon: Building2,
      title: "Company Monitoring",
      description:
        "Add your dream companies and receive alerts when they publish new vacancies.",
      details: [
        "Company tracking",
        "New vacancy alerts",
        "Posting history",
        "Trend analysis",
      ],
    },
    {
      icon: Settings,
      title: "Advanced Preferences",
      description:
        "Configure detailed filters by location, salary, modality, contract type and more.",
      details: [
        "Location and remote",
        "Salary range",
        "Contract type",
        "Schedule and hours",
      ],
    },
    {
      icon: BarChart3,
      title: "Dashboard and Statistics",
      description:
        "Visualize your progress with interactive charts and detailed metrics of your search.",
      details: [
        "Offers per day",
        "Response rate",
        "Most active companies",
        "Market analysis",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 mb-6">
            <Sparkles className="w-4 h-4 text-orange-500" />
            <span className="text-orange-400 text-sm font-medium">Features</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Everything you need
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
              to find a job
            </span>
          </h1>

          <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
            A complete suite of AI-powered tools to automate your job search and
            maximize your opportunities.
          </p>
        </section>

        {/* Main Features */}
        <section className="max-w-7xl mx-auto px-6 py-12">
          <div className="space-y-24">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className={`grid md:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? "md:flex-row-reverse" : ""
                }`}
              >
                <div className={index % 2 === 1 ? "md:order-2" : ""}>
                  <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 mb-6">
                    <feature.icon className="w-5 h-5 text-orange-500" />
                    <span className="text-orange-400 text-sm font-medium">Feature</span>
                  </div>

                  <h2 className="text-3xl font-bold text-white mb-4">
                    {feature.title}
                  </h2>

                  <p className="text-zinc-400 text-lg mb-8">
                    {feature.description}
                  </p>

                  <ul className="space-y-3">
                    {feature.details.map((detail) => (
                      <li key={detail} className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center">
                          <Check className="w-4 h-4 text-orange-500" />
                        </div>
                        <span className="text-zinc-300">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={`bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 ${
                  index % 2 === 1 ? "md:order-1" : ""
                }`}>
                  <div className="aspect-square rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/20 flex items-center justify-center">
                    <feature.icon className="w-24 h-24 text-orange-500" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Additional Features Grid */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              More powerful features
            </h2>
            <p className="text-zinc-400 text-lg">
              Everything you need for a successful search
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Clock,
                title: "Time Saving",
                description:
                  "Save up to 20 hours per week in active job searching",
              },
              {
                icon: Shield,
                title: "Secure Data",
                description:
                  "Your information is encrypted and protected with the highest standards",
              },
              {
                icon: Zap,
                title: "Ultra Fast",
                description:
                  "Offers are processed and notified within seconds of appearing",
              },
              {
                icon: Globe,
                title: "Global Scope",
                description:
                  "Search for opportunities in multiple countries and regions simultaneously",
              },
              {
                icon: BarChart3,
                title: "Analytics",
                description:
                  "Detailed metrics about your search and success rate",
              },
              {
                icon: Settings,
                title: "Customizable",
                description:
                  "Adapt all parameters to your specific needs",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 hover:border-orange-500/50 transition-all"
              >
                <feature.icon className="w-10 h-10 text-orange-500 mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-zinc-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              How does it work?
            </h2>
            <p className="text-zinc-400 text-lg">
              Set up your search in minutes, let the AI work
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Create your account",
                description: "Sign up in less than 2 minutes",
              },
              {
                step: "02",
                title: "Set preferences",
                description: "Define which positions and companies interest you",
              },
              {
                step: "03",
                title: "AI searches for you",
                description: "Our bots work 24/7 automatically",
              },
              {
                step: "04",
                title: "Receive offers",
                description: "Instant notifications by email",
              },
            ].map((step) => (
              <div key={step.step} className="text-center">
                <div className="text-6xl font-bold text-orange-500/20 mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-zinc-400">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-3xl p-12 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Start receiving offers today
            </h2>
            <p className="text-zinc-400 text-lg mb-10 max-w-2xl mx-auto">
              Join thousands of professionals who are already finding better
              opportunities with Carmen Job Search.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-orange-500 text-white font-semibold text-lg hover:bg-orange-600 transition-all hover:scale-105"
              >
                Create free account
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-zinc-700 text-white font-semibold text-lg hover:bg-zinc-800 transition-all"
              >
                View plans
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
