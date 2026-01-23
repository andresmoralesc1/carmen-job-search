"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Mail,
  Search,
  Check,
  Building2,
  BarChart3,
  Shield,
  Zap,
  Users,
  Clock,
  TrendingUp,
  Settings,
  Sparkles,
  Bot,
  Bell,
  Target,
} from "lucide-react";
import { Header, Footer, Button, ScrollReveal, StaggerReveal, GlassCard, BentoGrid, BentoCard, FeaturedBentoCard, StatBentoCard } from "@/components";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { images } from "@/lib/images";
import { CarmenLogo } from "@/components/CarmenLogo";
import { useState, useEffect } from "react";

export default function Home() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Ambient background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="orb orb-violet w-96 h-96 -top-48 -left-48 animate-float-slow" />
        <div className="orb orb-purple w-80 h-80 top-1/2 -right-40 animate-float-slow" style={{ animationDelay: '2s' }} />
        <div className="orb orb-blue w-72 h-72 bottom-20 left-1/4 animate-float-slow" style={{ animationDelay: '4s' }} />
      </div>

      <ScrollProgress />
      <Header />

      {/* Hero Section - Modern Design */}
      <main id="main-content" role="main" className="relative min-h-[calc(100vh-64px)] flex items-center">
        {/* Grid pattern with aurora effect */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />
        <div className="absolute inset-0 aurora-bg opacity-30" />

        {/* Contenido principal */}
        <div className="relative max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-8 sm:py-12 md:py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 xl:gap-16 items-center">
            {/* Columna izquierda: Contenido */}
            <div className="text-center lg:text-left order-2 lg:order-1">
              {/* Badge with glassmorphism */}
              <ScrollReveal direction="fade">
                <GlassCard size="sm" className="inline-flex items-center gap-3 px-4 py-2 mb-6 shimmer-sweep">
                  <div className="relative">
                    <CarmenLogo size="small" />
                    <div className="absolute inset-0 blur-md bg-violet-500/50" />
                  </div>
                  <span className="text-white/90 text-sm font-medium">Powered by Neuralflow AI</span>
                </GlassCard>
              </ScrollReveal>

              {/* Título principal con efecto gradiente */}
              <ScrollReveal direction="up">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-4 md:mb-6">
                  <span className="block text-white mb-2">Find your</span>
                  <span className="block relative mb-2">
                    <span className="gradient-text text-glow">dream job</span>
                  </span>
                  <span className="block text-white/90">effortlessly</span>
                </h1>
              </ScrollReveal>

              {/* Subtítulo */}
              <ScrollReveal direction="up" delay={100}>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-zinc-400 max-w-xl mx-auto lg:mx-0 mb-6 md:mb-8 leading-relaxed">
                  AI-powered job search that works 24/7. Get personalized opportunities
                  delivered straight to your inbox.
                </p>
              </ScrollReveal>

              {/* CTA Buttons con glassmorphism */}
              <ScrollReveal direction="up" delay={200}>
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start mb-6 md:mb-8">
                  <Button
                    href="/register"
                    size="lg"
                    showArrow
                    className="group relative overflow-hidden text-sm md:text-base shadow-xl shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-105"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-violet-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative z-10 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Start for Free
                    </span>
                  </Button>
                  <Button
                    href="/features"
                    variant="outline"
                    size="lg"
                    className="backdrop-blur-sm border-white/20 hover:border-white/30 text-sm md:text-base"
                  >
                    See how it works
                  </Button>
                </div>
              </ScrollReveal>

              {/* Trust badges */}
              <ScrollReveal direction="up" delay={300}>
                <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-4 md:gap-6 text-xs md:text-sm text-zinc-500">
                  <div className="flex items-center gap-2 text-zinc-400 hover:text-zinc-200 transition-colors">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Free to start</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-400 hover:text-zinc-200 transition-colors">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>No credit card</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-400 hover:text-zinc-200 transition-colors">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Cancel anytime</span>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Columna derecha: Imagen con efecto glassmorphism */}
            <ScrollReveal direction="right" className="relative order-1 lg:order-2">
              <div className="relative h-[350px] sm:h-[450px] md:h-[550px] lg:h-[650px]">
                <div className="absolute inset-0 rounded-3xl overflow-hidden glass-card group">
                  <Image
                    src={images.hero.womanSearching}
                    alt="Person searching for job opportunities"
                    fill
                    priority
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/20 via-transparent to-purple-500/20 opacity-60" />
                </div>

                {/* Floating stats card */}
                <div className="absolute -bottom-6 -left-6 sm:-bottom-8 sm:-left-8 md:-bottom-10 md:-left-10">
                  <GlassCard size="sm" className="p-4 glow">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                        <Target className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-zinc-400">Jobs Found</p>
                        <p className="text-lg font-bold text-white">2,847</p>
                      </div>
                    </div>
                  </GlassCard>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </main>

      {/* Features Section - Bento Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 md:py-24 relative">
        <ScrollReveal>
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
              <span className="gradient-text">Smart Features</span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-zinc-400 max-w-2xl mx-auto">
              Powered by AI, designed for your success
            </p>
          </div>

          <BentoGrid columns={3} gap="md" className="max-w-6xl mx-auto">
            <FeaturedBentoCard
              badge="AI-Powered"
              title="Intelligent Search"
              description="Our AI continuously searches LinkedIn, Indeed, and company career pages 24/7 to find opportunities matching your profile. The system learns from your preferences and improves over time."
              gradient="violet"
              icon={<Bot className="w-6 h-6 text-violet-400" />}
            />

            <BentoCard
              title="AI Matching"
              description="OpenAI GPT-4 analyzes each job posting and compares it with your preferences, experience, and career goals to show you only the most relevant opportunities."
              icon={<CarmenLogo size="default" />}
            />

            <BentoCard
              title="Email Alerts"
              description="Get personalized real-time notifications with the best opportunities found. Never miss a perfect match again."
              icon={<Bell className="w-6 h-6 text-violet-400" />}
            />
          </BentoGrid>
        </ScrollReveal>
      </section>

      {/* How it works - Modern Steps */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 md:py-24">
        <ScrollReveal>
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
              How it works
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-zinc-400 max-w-2xl mx-auto">
              Set up your search in minutes, let AI do the work
            </p>
          </div>

          {/* Steps with glassmorphism cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
            {[
              { step: "01", title: "Sign Up", desc: "Create account", icon: Users },
              { step: "02", title: "Configure", desc: "Set preferences", icon: Settings },
              { step: "03", title: "Monitor", desc: "Add companies", icon: Building2 },
              { step: "04", title: "Receive", desc: "Get alerts", icon: Mail },
            ].map((item) => (
              <GlassCard
                key={item.step}
                size="md"
                className="text-center group"
              >
                <div className="text-4xl md:text-5xl font-bold gradient-text mb-4">
                  {item.step}
                </div>
                <div className="w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <item.icon className="w-7 h-7 text-violet-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-zinc-400">{item.desc}</p>
              </GlassCard>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* Benefits Section - Stat Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 md:py-24">
        <ScrollReveal>
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
              Why choose Carmen?
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-zinc-400 max-w-2xl mx-auto">
              The difference is in how we use artificial intelligence
            </p>
          </div>

          <BentoGrid columns={3} gap="md" className="max-w-6xl mx-auto">
            <StatBentoCard
              value="20hrs+"
              label="Time saved per week"
              change="vs manual search"
              changeType="positive"
              trend="up"
              icon={<Clock className="w-5 h-5 text-purple-500" />}
            />

            <StatBentoCard
              value="98%"
              label="Match accuracy"
              change="AI-powered"
              changeType="positive"
              trend="stable"
              icon={<Target className="w-5 h-5 text-green-500" />}
            />

            <StatBentoCard
              value="24/7"
              label="Always monitoring"
              change="No breaks"
              changeType="neutral"
              trend="stable"
              icon={<Zap className="w-5 h-5 text-yellow-500" />}
            />

            <BentoCard
              title="Secure Data"
              description="Your information is encrypted and protected with enterprise-grade security."
              icon={<Shield className="w-6 h-6 text-blue-400" />}
            />

            <BentoCard
              title="Detailed Analytics"
              description="Track your search progress with comprehensive metrics and insights."
              icon={<BarChart3 className="w-6 h-6 text-pink-400" />}
            />

            <BentoCard
              title="Unlimited Companies"
              description="Monitor as many companies as you want without restrictions."
              icon={<Building2 className="w-6 h-6 text-violet-400" />}
            />
          </BentoGrid>
        </ScrollReveal>
      </section>

      {/* CTA Section - Modern Glass Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 md:py-24">
        <ScrollReveal>
          <GlassCard
            size="xl"
            glow
            className="text-center max-w-5xl mx-auto border-violet-500/30"
          >
            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute -top-20 -left-20 w-40 h-40 bg-violet-500/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl" />

              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6">
                Start your automated job search today
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-zinc-400 mb-6 md:mb-8 max-w-2xl mx-auto">
                Join thousands of professionals already finding better
                opportunities with Carmen Job Search.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
                <Button
                  href="/register"
                  size="lg"
                  showArrow
                  className="shadow-xl shadow-violet-500/30"
                >
                  Create free account
                </Button>
                <Button
                  href="/features"
                  variant="outline"
                  size="lg"
                  className="backdrop-blur-sm"
                >
                  View features
                </Button>
              </div>
            </div>
          </GlassCard>
        </ScrollReveal>
      </section>

      <Footer />
    </div>
  );
}
