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

      {/* Hero Section - Super Responsive */}
      <main id="main-content" className="relative min-h-[calc(100vh-64px)] flex items-center overflow-hidden">
        {/* Background decorativo - ocultar en móviles pequeños */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] sm:block hidden" />

        {/* Gradiente radial background */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-blue-500/5" />

        {/* Círculos decorativos - más pequeños en móviles */}
        <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black" />

        {/* Contenido principal - mejor espaciado */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
            {/* Columna izquierda: Contenido */}
            <div className="text-center lg:text-left order-2 lg:order-1">
              {/* Badge futurista - más pequeño en móvil */}
              <ScrollReveal direction="fade">
                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-6 sm:mb-8 group hover:bg-white/10 hover:border-white/20 transition-all cursor-default">
                  <div className="relative">
                    <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500" />
                    <div className="absolute inset-0 blur-md bg-orange-500/50" />
                  </div>
                  <span className="text-white/80 sm:text-white/90 text-xs sm:text-sm font-medium">Powered by Neuralflow AI</span>
                </div>
              </ScrollReveal>

              {/* Título principal - mejor escalado */}
              <ScrollReveal direction="up">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight mb-4 sm:mb-6 transition-all duration-700 hover:scale-[1.02]">
                  <span className="block text-white mb-1 sm:mb-2">Find your</span>
                  <span className="block relative">
                    <span className="relative z-10 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent animate-gradient">
                      dream job
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent blur-xl sm:blur-2xl opacity-50 animate-gradient" />
                  </span>
                  <span className="block text-white/80 sm:text-white/90 mt-1 sm:mt-2">effortlessly</span>
                </h1>
              </ScrollReveal>

              {/* Subtítulo */}
              <ScrollReveal direction="up" delay={100}>
                <p className="text-base sm:text-lg lg:text-xl text-zinc-400 max-w-xl mx-auto lg:mx-0 mb-6 sm:mb-8 leading-relaxed transition-all duration-500">
                  AI-powered job search that works 24/7. Get personalized opportunities
                  delivered straight to your inbox.
                </p>
              </ScrollReveal>

              {/* CTA Buttons */}
              <ScrollReveal direction="up" delay={200}>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start mb-6 sm:mb-8">
                  <Button
                    href="/register"
                    size="lg"
                    showArrow
                    className="group relative overflow-hidden bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-300 hover:scale-105 text-sm sm:text-base"
                  >
                    <span className="relative z-10">Start for Free</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Button>
                  <Button
                    href="/features"
                    variant="outline"
                    size="lg"
                    className="group border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-105 text-sm sm:text-base"
                  >
                    See how it works
                  </Button>
                </div>
              </ScrollReveal>

              {/* Trust badges - stack en móvil muy pequeño */}
              <ScrollReveal direction="up" delay={300}>
                <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-6 text-xs sm:text-sm text-zinc-500">
                  <div className="flex items-center gap-1.5 transition-all duration-300 hover:text-zinc-300">
                    <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                    <span>Free to start</span>
                  </div>
                  <div className="flex items-center gap-1.5 transition-all duration-300 hover:text-zinc-300">
                    <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                    <span>No credit card</span>
                  </div>
                  <div className="flex items-center gap-1.5 transition-all duration-300 hover:text-zinc-300">
                    <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                    <span>Cancel anytime</span>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Columna derecha: Imagen - más pequeña en móvil */}
            <ScrollReveal direction="right" className="relative order-1 lg:order-2">
              <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] rounded-2xl sm:rounded-3xl overflow-hidden group">
                <Image
                  src={images.hero.womanSearching}
                  alt="Person searching for job opportunities"
                  fill
                  priority
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </main>

      {/* Features Section - mejor responsive */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <div className="p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-orange-500/50 transition-all duration-300 hover:scale-[1.02] group">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-orange-500/10 flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-orange-500/20 transition-colors duration-300">
                <Search className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
              </div>
              <h3 className="text-base sm:text-xl font-semibold text-white mb-1.5 sm:mb-2">
                Automated Search
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Our system searches 24/7 on LinkedIn, Indeed, and company pages
                automatically to find the best opportunities.
              </p>
            </div>

            <div className="p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-orange-500/50 transition-all duration-300 hover:scale-[1.02] group">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-orange-500/10 flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-orange-500/20 transition-colors duration-300">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
              </div>
              <h3 className="text-base sm:text-xl font-semibold text-white mb-1.5 sm:mb-2">
                AI Matching
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                OpenAI GPT-4 analyzes each listing and compares it with your preferences to
                show you only the most relevant jobs.
              </p>
            </div>

            <div className="p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-orange-500/50 transition-all duration-300 hover:scale-[1.02] group">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-orange-500/10 flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-orange-500/20 transition-colors duration-300">
                <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
              </div>
              <h3 className="text-base sm:text-xl font-semibold text-white mb-1.5 sm:mb-2">
                Email Alerts
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Get personalized real-time notifications with the best
                opportunities found based on your profile.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* How it works - mejor responsive */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <ScrollReveal>
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
              How it works
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-zinc-400 max-w-2xl mx-auto px-4">
              Set up your search in minutes, let AI do the work for you
            </p>
          </div>

          <StaggerReveal staggerDelay={150} className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {[
              { step: "01", title: "Sign Up", desc: "Create your account in seconds", icon: Users },
              { step: "02", title: "Configure", desc: "Define your job preferences", icon: Settings },
              { step: "03", title: "Monitor", desc: "Add companies you're interested in", icon: Building2 },
              { step: "04", title: "Receive", desc: "Get email alerts", icon: Mail },
            ].map((item) => (
              <div key={item.step} className="text-center group p-3 sm:p-4 rounded-xl hover:bg-zinc-900/30 transition-all duration-300">
                <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-orange-500/20 mb-3 sm:mb-4 group-hover:text-orange-500/30 group-hover:scale-110 transition-all duration-300">
                  {item.step}
                </div>
                <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-white mb-1 sm:mb-2 group-hover:text-orange-400 transition-colors duration-300">{item.title}</h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </StaggerReveal>
        </ScrollReveal>
      </section>

      {/* Benefits Section - mejor responsive */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <ScrollReveal>
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
              Why choose Carmen?
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-zinc-400 max-w-2xl mx-auto px-4">
              The difference is in how we use artificial intelligence
            </p>
          </div>

          <StaggerReveal staggerDelay={100} className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
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
                className="text-center p-4 sm:p-6 rounded-xl bg-zinc-900/30 border border-zinc-800 hover:border-orange-500/30 transition-all duration-300 group hover:bg-zinc-900/50 hover:scale-105"
              >
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl ${benefit.bgColor} flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <benefit.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${benefit.color}`} />
                </div>
                <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-white mb-1 sm:mb-2">{benefit.title}</h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </StaggerReveal>
        </ScrollReveal>
      </section>

      {/* CTA Section - mejor padding */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <ScrollReveal>
          <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 lg:p-16 text-center transition-all duration-300 hover:scale-[1.01] hover:shadow-lg hover:shadow-orange-500/10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              Start your automated job search today
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-zinc-400 mb-6 sm:mb-10 max-w-2xl mx-auto px-4">
              Join thousands of professionals already finding better
              opportunities with Carmen Job Search.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button href="/register" size="lg" showArrow className="text-sm sm:text-base">
                Create free account
              </Button>
              <Button href="/features" variant="outline" size="lg" className="text-sm sm:text-base">
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
