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
  ChevronDown,
} from "lucide-react";
import { Header, Footer, Button, ScrollReveal, StaggerReveal } from "@/components";
import { images } from "@/lib/images";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black">
      <Header />

      {/* Hero Section - Futurista 2026 con imagen */}
      <main id="main-content" className="relative min-h-screen flex items-center overflow-hidden">
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
        <div className="relative max-w-7xl mx-auto px-6 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Columna izquierda: Contenido */}
            <div className="text-center lg:text-left">
              {/* Badge futurista */}
              <ScrollReveal direction="fade">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8 group hover:bg-white/10 hover:border-white/20 transition-all cursor-default">
                  <div className="relative">
                    <Sparkles className="w-4 h-4 text-orange-500" />
                    <div className="absolute inset-0 blur-md bg-orange-500/50" />
                  </div>
                  <span className="text-white/90 text-sm font-medium">Powered by Neuralflow AI</span>
                </div>
              </ScrollReveal>

              {/* Título principal con gradiente animado */}
              <ScrollReveal direction="up">
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 transition-all duration-700 hover:scale-[1.02]">
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
                <p className="text-lg sm:text-xl text-zinc-400 max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed transition-all duration-500">
                  AI-powered job search that works 24/7. Get personalized opportunities
                  delivered straight to your inbox.
                </p>
              </ScrollReveal>

              {/* CTA Buttons con efecto glassmorphism */}
              <ScrollReveal direction="up" delay={200}>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                  <Button
                    href="/register"
                    size="lg"
                    showArrow
                    className="group relative overflow-hidden bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-300 hover:scale-105"
                  >
                    <span className="relative z-10">Start for Free</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Button>
                  <Button
                    href="/features"
                    variant="outline"
                    size="lg"
                    className="group border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                  >
                    See how it works
                  </Button>
                </div>
              </ScrollReveal>

              {/* Trust badges */}
              <ScrollReveal direction="up" delay={300}>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-zinc-500">
                  <div className="flex items-center gap-2 transition-all duration-300 hover:text-zinc-300">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Free to start</span>
                  </div>
                  <div className="flex items-center gap-2 transition-all duration-300 hover:text-zinc-300">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>No credit card</span>
                  </div>
                  <div className="flex items-center gap-2 transition-all duration-300 hover:text-zinc-300">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Cancel anytime</span>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Columna derecha: Imagen */}
            <ScrollReveal direction="right" className="relative order-first lg:order-last">
              <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] rounded-3xl overflow-hidden group">
                <Image
                  src={images.hero.womanSearching}
                  alt="Person searching for job opportunities"
                  fill
                  priority
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                {/* Overlay decorativo */}
                <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <div className="p-6 lg:p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-orange-500/50 transition-all duration-300 hover:scale-[1.02] group">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4 group-hover:bg-orange-500/20 transition-colors duration-300">
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

            <div className="p-6 lg:p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-orange-500/50 transition-all duration-300 hover:scale-[1.02] group">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4 group-hover:bg-orange-500/20 transition-colors duration-300">
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

            <div className="p-6 lg:p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-orange-500/50 transition-all duration-300 hover:scale-[1.02] group">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4 group-hover:bg-orange-500/20 transition-colors duration-300">
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

      {/* How it works Section - Layout horizontal en desktop */}
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

          <StaggerReveal staggerDelay={150} className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {[
              { step: "01", title: "Sign Up", desc: "Create your account in seconds", icon: Users },
              { step: "02", title: "Configure", desc: "Define your job preferences", icon: Settings },
              { step: "03", title: "Monitor", desc: "Add companies you're interested in", icon: Building2 },
              { step: "04", title: "Receive", desc: "Get email alerts", icon: Mail },
            ].map((item) => (
              <div key={item.step} className="text-center group p-4 rounded-xl hover:bg-zinc-900/30 transition-all duration-300">
                <div className="text-5xl sm:text-6xl font-bold text-orange-500/20 mb-4 group-hover:text-orange-500/30 group-hover:scale-110 transition-all duration-300">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-orange-400 transition-colors duration-300">{item.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </StaggerReveal>
        </ScrollReveal>
      </section>

      {/* Benefits Section - Layout horizontal en desktop */}
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

          <StaggerReveal staggerDelay={100} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
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
                className="text-center p-6 rounded-xl bg-zinc-900/30 border border-zinc-800 hover:border-orange-500/30 transition-all duration-300 group hover:bg-zinc-900/50 hover:scale-105"
              >
                <div className={`w-12 h-12 rounded-xl ${benefit.bgColor} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
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
          <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-3xl p-8 sm:p-12 lg:p-16 text-center transition-all duration-300 hover:scale-[1.01] hover:shadow-lg hover:shadow-orange-500/10">
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
