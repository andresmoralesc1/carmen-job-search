import Link from "next/link";
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
  ChevronDown,
} from "lucide-react";
import { Header, Footer, Button, ScrollReveal, StaggerReveal } from "@/components";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black">
      <Header />

      {/* Hero Section - Futurista 2026 */}
      <main id="main-content" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background decorativo con grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        {/* Gradiente radial background */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-blue-500/5" />

        {/* Círculos decorativos con blur */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black" />

        {/* Contenido principal */}
        <div className="relative max-w-7xl mx-auto px-6 py-32 lg:py-48">
          <div className="text-center">
            {/* Badge futurista */}
            <ScrollReveal direction="fade">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8 group hover:bg-white/10 hover:border-white/20 transition-all cursor-default">
                <div className="relative">
                  <Sparkles className="w-4 h-4 text-orange-500" />
                  <div className="absolute inset-0 blur-md bg-orange-500/50" />
                </div>
                <span className="text-white/90 text-sm font-medium">Powered by Neuralflow AI</span>
                <ChevronDown className="w-4 h-4 text-white/50 group-hover:text-white/80 group-hover:translate-y-0.5 transition-all" />
              </div>
            </ScrollReveal>

            {/* Título principal con gradiente animado */}
            <ScrollReveal direction="up">
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tight mb-8">
                <span className="block text-white mb-2">Find your</span>
                <span className="block relative">
                  <span className="relative z-10 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent animate-gradient">
                    dream job
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent blur-2xl opacity-50 animate-gradient" />
                </span>
                <span className="block text-white/90 mt-2">effortlessly</span>
              </h1>
            </ScrollReveal>

            {/* Subtítulo con descripción */}
            <ScrollReveal direction="up" delay={100}>
              <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed">
                AI-powered job search that works 24/7. Get personalized opportunities
                delivered straight to your inbox.
              </p>
            </ScrollReveal>

            {/* CTA Buttons con efecto glassmorphism */}
            <ScrollReveal direction="up" delay={200}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <Button
                  href="/register"
                  size="lg"
                  showArrow
                  className="group relative overflow-hidden bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all"
                >
                  <span className="relative z-10">Start for Free</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
                <Button
                  href="/features"
                  variant="outline"
                  size="lg"
                  className="group border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 backdrop-blur-sm"
                >
                  See how it works
                </Button>
              </div>
            </ScrollReveal>

            {/* Trust badges */}
            <ScrollReveal direction="up" delay={300}>
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-500">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Free to start</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>No credit card</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Elementos decorativos flotantes */}
        <div className="absolute top-1/4 right-1/4 hidden lg:block">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-blue-500 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
            <div className="relative px-6 py-4 bg-zinc-900/90 backdrop-blur-sm rounded-lg border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">New Match</p>
                  <p className="text-zinc-400 text-xs">Senior UX Designer</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-1/4 left-1/4 hidden lg:block">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
            <div className="relative px-6 py-4 bg-zinc-900/90 backdrop-blur-sm rounded-lg border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Email Sent</p>
                  <p className="text-zinc-400 text-xs">12 new jobs found</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <div className="p-6 lg:p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-orange-500/50 transition-all hover:scale-[1.02] group">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4 group-hover:bg-orange-500/20 transition-colors">
                <Search className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Automated Search
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Our system searches 24/7 on LinkedIn, Indeed, and company pages
                automatically to find the best opportunities.
              </p>
            </div>

            <div className="p-6 lg:p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-orange-500/50 transition-all hover:scale-[1.02] group">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4 group-hover:bg-orange-500/20 transition-colors">
                <Sparkles className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                AI Matching
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                OpenAI GPT-4 analyzes each listing and compares it with your preferences to
                show you only the most relevant jobs.
              </p>
            </div>

            <div className="p-6 lg:p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-orange-500/50 transition-all hover:scale-[1.02] group">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4 group-hover:bg-orange-500/20 transition-colors">
                <Mail className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Email Alerts
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Get personalized real-time notifications with the best
                opportunities found based on your profile.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* How it works Section */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-6 py-24">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              How it works
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Set up your search in minutes, let AI do the work for you
            </p>
          </div>

          <StaggerReveal staggerDelay={150} className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            {[
              { step: "01", title: "Sign Up", desc: "Create your account in seconds", icon: Users },
              { step: "02", title: "Configure", desc: "Define your job preferences", icon: Settings },
              { step: "03", title: "Monitor", desc: "Add companies you're interested in", icon: Building2 },
              { step: "04", title: "Receive", desc: "Get email alerts", icon: Mail },
            ].map((item) => (
              <div key={item.step} className="text-center group">
                <div className="text-5xl sm:text-6xl font-bold text-orange-500/20 mb-4 group-hover:text-orange-500/30 transition-colors">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </StaggerReveal>
        </ScrollReveal>
      </section>

      {/* Benefits Section */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Why choose Carmen?
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              The difference is in how we use artificial intelligence
            </p>
          </div>

          <StaggerReveal staggerDelay={100} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {[
              {
                icon: Clock,
                title: "Save Time",
                description: "Save up to 20 hours per week in active job searching",
                color: "text-blue-500",
                bgColor: "bg-blue-500/10"
              },
              {
                icon: TrendingUp,
                title: "Higher Efficiency",
                description: "AI-powered matching for relevant opportunities",
                color: "text-green-500",
                bgColor: "bg-green-500/10"
              },
              {
                icon: Shield,
                title: "Secure Data",
                description: "Your information is encrypted and protected",
                color: "text-purple-500",
                bgColor: "bg-purple-500/10"
              },
              {
                icon: Zap,
                title: "Ultra Fast",
                description: "Jobs are processed and notified in seconds",
                color: "text-yellow-500",
                bgColor: "bg-yellow-500/10"
              },
              {
                icon: BarChart3,
                title: "Analytics",
                description: "Detailed metrics about your search and progress",
                color: "text-pink-500",
                bgColor: "bg-pink-500/10"
              },
              {
                icon: Building2,
                title: "Unlimited Companies",
                description: "Monitor as many companies as you want",
                color: "text-orange-500",
                bgColor: "bg-orange-500/10"
              },
            ].map((benefit) => (
              <div
                key={benefit.title}
                className="text-center p-6 rounded-xl bg-zinc-900/30 border border-zinc-800 hover:border-orange-500/30 transition-all group hover:bg-zinc-900/50"
              >
                <div className={`w-12 h-12 rounded-xl ${benefit.bgColor} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <benefit.icon className={`w-6 h-6 ${benefit.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{benefit.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </StaggerReveal>
        </ScrollReveal>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <ScrollReveal>
          <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-3xl p-8 sm:p-12 lg:p-16 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
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
        </ScrollReveal>
      </section>

      <Footer />
    </div>
  );
}
