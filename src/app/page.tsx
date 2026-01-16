import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Mail,
  Search,
  Sparkles,
  Check,
  Building2,
  BarChart3,
  Shield,
  Zap,
  Users,
  Clock,
  TrendingUp,
  Settings,
} from "lucide-react";
import { Header, Footer, Button, ScrollReveal, StaggerReveal } from "@/components";
import { images } from "@/lib/images";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black">
      <Header />

      {/* Hero Section */}
      <main id="main-content" className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 mb-6">
            <Sparkles className="w-4 h-4 text-orange-500" />
            <span className="text-orange-400 text-sm font-medium">Powered by Neuralflow AI</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Find your dream job
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
              effortlessly
            </span>
          </h1>

          <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
            Let AI search for job opportunities for you. Get personalized notifications
            from companies you care about, 24/7.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button href="/register" size="lg" showArrow>
              Start for Free
            </Button>
            <Button href="/features" variant="outline" size="lg">
              See how it works
            </Button>
          </div>

          <p className="text-sm text-zinc-500">
            ✓ Free to start • ✓ No credit card required • ✓ Cancel anytime
          </p>
        </div>

        {/* Hero Image */}
        <ScrollReveal direction="fade">
          <div className="relative w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden mt-12">
            <Image
              src={images.hero.womanSearching}
              alt="Person searching for job opportunities"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          </div>
        </ScrollReveal>

        {/* Features */}
        <StaggerReveal className="grid md:grid-cols-3 gap-8 mt-24">
          <div className="p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-orange-500/50 transition-all hover:scale-[1.02]">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4">
              <Search className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Automated Search
            </h3>
            <p className="text-zinc-400">
              Our system searches 24/7 on LinkedIn, Indeed, and company pages
              automatically to find the best opportunities.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-orange-500/50 transition-all hover:scale-[1.02]">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              AI Matching
            </h3>
            <p className="text-zinc-400">
              OpenAI GPT-4 analyzes each listing and compares it with your preferences to
              show you only the most relevant jobs.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-orange-500/50 transition-all hover:scale-[1.02]">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Email Alerts
            </h3>
            <p className="text-zinc-400">
              Get personalized real-time notifications with the best
              opportunities found based on your profile.
            </p>
          </div>
        </StaggerReveal>

        {/* How it works */}
        <ScrollReveal>
          <section id="how-it-works" className="mt-32">
            <h2 className="text-3xl font-bold text-white text-center mb-4">
              How it works
            </h2>
            <p className="text-zinc-400 text-center mb-12 max-w-2xl mx-auto">
              Set up your search in minutes, let AI do the work for you
            </p>
            <StaggerReveal staggerDelay={150} className="grid md:grid-cols-4 gap-6">
              {[
                { step: "01", title: "Sign Up", desc: "Create your account in seconds", icon: Users },
                { step: "02", title: "Configure", desc: "Define your job preferences", icon: Settings },
                { step: "03", title: "Monitor", desc: "Add companies you're interested in", icon: Building2 },
                { step: "04", title: "Receive", desc: "Get email alerts", icon: Mail },
              ].map((item) => (
                <div key={item.step} className="text-center group">
                  <div className="text-6xl font-bold text-orange-500/20 mb-4 group-hover:text-orange-500/30 transition-colors">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-zinc-400 text-sm">{item.desc}</p>
                </div>
              ))}
            </StaggerReveal>
          </section>
        </ScrollReveal>

        {/* Benefits Section */}
        <ScrollReveal>
          <section className="mt-32">
            <h2 className="text-3xl font-bold text-white text-center mb-4">
              Why choose Carmen?
            </h2>
            <p className="text-zinc-400 text-center mb-12 max-w-2xl mx-auto">
              The difference is in how we use artificial intelligence
            </p>
            <StaggerReveal staggerDelay={100} className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: Clock,
                  title: "Save Time",
                  description: "Save up to 20 hours per week in active job searching",
                },
                {
                  icon: TrendingUp,
                  title: "Higher Efficiency",
                  description: "AI-powered matching for relevant opportunities",
                },
                {
                  icon: Shield,
                  title: "Secure Data",
                  description: "Your information is encrypted and protected",
                },
                {
                  icon: Zap,
                  title: "Ultra Fast",
                  description: "Jobs are processed and notified in seconds",
                },
                {
                  icon: BarChart3,
                  title: "Analytics",
                  description: "Detailed metrics about your search and progress",
                },
                {
                  icon: Building2,
                  title: "Unlimited Companies",
                  description: "Monitor as many companies as you want",
                },
              ].map((benefit) => (
                <div
                  key={benefit.title}
                  className="flex gap-4 p-6 rounded-xl bg-zinc-900/30 border border-zinc-800 hover:border-orange-500/30 transition-all"
                >
                  <div className="flex-shrink-0">
                    <benefit.icon className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">{benefit.title}</h3>
                    <p className="text-zinc-400 text-sm">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </StaggerReveal>
          </section>
        </ScrollReveal>

        {/* CTA Section */}
        <ScrollReveal>
          <section className="mt-32">
            <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-3xl p-12 text-center">
              <h2 className="text-4xl font-bold text-white mb-6">
                Start your automated job search today
              </h2>
              <p className="text-zinc-400 text-lg mb-10 max-w-2xl mx-auto">
                Join thousands of professionals already finding better
                opportunities with Carmen Job Search.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button href="/register" size="lg" showArrow>
                  Create free account
                </Button>
                <Button href="/features" variant="outline" size="lg">
                  View features
                </Button>
              </div>
            </div>
          </section>
        </ScrollReveal>
      </main>

      <Footer />
    </div>
  );
}
