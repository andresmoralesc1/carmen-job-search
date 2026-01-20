import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  ArrowRight,
  Github,
  Mail,
} from "lucide-react";
import { Header, Footer, Button } from "@/components";
import { images } from "@/lib/images";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 mb-6">
            <Sparkles className="w-4 h-4 text-orange-500" />
            <span className="text-orange-400 text-sm font-medium">About Us</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Find a job
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
              effortlessly
            </span>
          </h1>

          <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
            Carmen Job Search was created by{" "}
            <span className="text-orange-400 font-semibold">Neuralflow</span> to
            revolutionize the way you search for jobs using advanced artificial
            intelligence.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-orange-500 text-white font-semibold text-lg hover:bg-orange-600 transition-all hover:scale-105"
            >
              Start Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/features"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-zinc-700 text-white font-semibold text-lg hover:bg-zinc-800 transition-all"
            >
              View Features
            </Link>
          </div>

          {/* Hero Image */}
          <div className="relative w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden mt-12">
            <Image
              src={images.workspace.openOffice}
              alt="Modern office workspace"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          </div>
        </section>

        {/* Mission Section */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6">
              Our Mission
            </h2>
            <p className="text-zinc-400 text-lg mb-6">
              At Neuralflow we believe that job searching should not be a job in
              itself. That's why we developed Carmen Job Search, a platform that
              uses AI to automate the entire process.
            </p>
            <p className="text-zinc-400 text-lg mb-6">
              Our system automatically searches for opportunities on LinkedIn, Indeed and
              company pages, analyzes them with AI to find the best
              matches with your profile, and notifies you instantly.
            </p>
          </div>
        </section>

        {/* Why Us Section */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              Why Carmen Job Search?
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              The difference is in how we use artificial intelligence to
              make your life easier
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Automated Search",
                description:
                  "Our bots search 24/7 on multiple platforms so you don't have to.",
                icon: "🔍",
              },
              {
                title: "AI Matching",
                description:
                  "OpenAI analyzes each offer and compares it with your preferences to find the best match.",
                icon: "🤖",
              },
              {
                title: "Instant Notifications",
                description:
                  "Receive email alerts the moment offers that match your profile appear.",
                icon: "🔔",
              },
              {
                title: "Advanced Filters",
                description:
                  "Configure filters by location, salary, modality and more to receive only relevant offers.",
                icon: "⚙️",
              },
              {
                title: "Company Monitoring",
                description:
                  "Add your dream companies and receive alerts when they publish new vacancies.",
                icon: "🏢",
              },
              {
                title: "Intuitive Dashboard",
                description:
                  "Manage everything from a modern, easy-to-use control panel with real-time statistics.",
                icon: "📊",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 hover:border-orange-500/50 transition-all hover:scale-[1.02]"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-zinc-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-3xl p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Developed by Neuralflow
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto mb-8">
              We are a team of engineers passionate about artificial intelligence and
              machine learning, dedicated to creating tools that simplify people's
              lives.
            </p>
            <div className="flex justify-center gap-4">
              <a
                href="https://github.com/neuralflow"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800 transition-colors"
              >
                <Github className="w-5 h-5" />
                GitHub
              </a>
              <a
                href="mailto:hello@neuralflow.ai"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800 transition-colors"
              >
                <Mail className="w-5 h-5" />
                Contact
              </a>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-7xl mx-auto px-6 py-24 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Start your automated search today
          </h2>
          <p className="text-zinc-400 text-lg mb-10 max-w-2xl mx-auto">
            Join thousands of professionals who are already finding better opportunities
            with Carmen Job Search.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-orange-500 text-white font-semibold text-lg hover:bg-orange-600 transition-all hover:scale-105"
          >
            Create free account
            <ArrowRight className="w-5 h-5" />
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
