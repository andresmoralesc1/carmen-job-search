import Link from "next/link";
import {
  Sparkles,
  Check,
  X,
  ArrowRight,
  Crown,
} from "lucide-react";
import { Header, Footer, Button } from "@/components";

export default function PricingPage() {
  const plans = [
    {
      name: "Free",
      description: "To start your search",
      price: "$0",
      period: "forever",
      popular: false,
      features: [
        { included: true, text: "5 active searches" },
        { included: true, text: "10 monitored companies" },
        { included: true, text: "Email alerts" },
        { included: true, text: "Basic dashboard" },
        { included: true, text: "Basic AI matching" },
        { included: false, text: "Unlimited searches" },
        { included: false, text: "Real-time alerts" },
        { included: false, text: "API access" },
        { included: false, text: "Priority support" },
      ],
      cta: "Start free",
      href: "/register",
    },
    {
      name: "Pro",
      description: "For active job seekers",
      price: "$9",
      period: "/month",
      popular: true,
      features: [
        { included: true, text: "Unlimited searches" },
        { included: true, text: "Unlimited companies" },
        { included: true, text: "Real-time alerts" },
        { included: true, text: "Advanced dashboard" },
        { included: true, text: "GPT-4 AI matching" },
        { included: true, text: "Export to CSV/PDF" },
        { included: true, text: "Unlimited history" },
        { included: false, text: "API access" },
        { included: false, text: "Priority support" },
        { included: false, text: "Integrations" },
      ],
      cta: "Start Pro",
      href: "/register?plan=pro",
    },
    {
      name: "Enterprise",
      description: "For teams and recruiters",
      price: "Custom",
      period: "",
      popular: false,
      features: [
        { included: true, text: "Everything in Pro" },
        { included: true, text: "Full API access" },
        { included: true, text: "24/7 priority support" },
        { included: true, text: "Custom integrations" },
        { included: true, text: "Guaranteed SLA" },
        { included: true, text: "Multiple users" },
        { included: true, text: "Custom reports" },
        { included: true, text: "Webhooks" },
        { included: true, text: "Dedicated account manager" },
        { included: true, text: "Onsite training" },
      ],
      cta: "Contact Sales",
      href: "mailto:hello@neuralflow.ai",
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
            <span className="text-orange-400 text-sm font-medium">Pricing</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Plans for every
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
              need
            </span>
          </h1>

          <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
            Start free, scale when you need. No commitments, cancel anytime.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800">
            <span className="text-white text-sm">Monthly</span>
            <div className="w-12 h-6 rounded-full bg-orange-500 relative">
              <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white" />
            </div>
            <span className="text-zinc-500 text-sm">Yearly (save 20%)</span>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 ${
                  plan.popular
                    ? "bg-gradient-to-b from-orange-500/20 to-orange-600/20 border-2 border-orange-500"
                    : "bg-zinc-900/50 border border-zinc-800"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-orange-500 text-white text-sm font-medium">
                      <Crown className="w-4 h-4" />
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-zinc-400 mb-6">{plan.description}</p>

                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-bold text-white">{plan.price}</span>
                    {plan.period && (
                      <span className="text-zinc-400">{plan.period}</span>
                    )}
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature.text} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-5 h-5 text-zinc-700 flex-shrink-0 mt-0.5" />
                      )}
                      <span
                        className={`text-sm ${
                          feature.included ? "text-zinc-300" : "text-zinc-700"
                        }`}
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={`block w-full text-center px-6 py-3 rounded-xl font-semibold transition-all ${
                    plan.popular
                      ? "bg-orange-500 text-white hover:bg-orange-600"
                      : "bg-zinc-800 text-white hover:bg-zinc-700"
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="inline w-4 h-4 ml-2" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="max-w-4xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-zinc-400">
              Everything you need to know about our plans
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Can I change plans at any time?",
                a: "Yes, you can upgrade or downgrade your plan at any time from your dashboard. Changes take effect immediately and we prorate charges.",
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all credit and debit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for Enterprise plans.",
              },
              {
                q: "Is there a free trial?",
                a: "The Free plan is completely free with no time limit. We also offer a 14-day trial of the Pro plan with no commitment.",
              },
              {
                q: "Can I cancel my subscription?",
                a: "Of course. You can cancel at any time from your dashboard. No penalties and you'll continue to have access until the end of your billing period.",
              },
              {
                q: "What does priority support include?",
                a: "Priority support includes guaranteed response in under 2 hours, direct communication channel with our team, and personalized onboarding sessions.",
              },
            ].map((faq) => (
              <details
                key={faq.q}
                className="group bg-zinc-900/50 border border-zinc-800 rounded-xl"
              >
                <summary className="px-6 py-4 cursor-pointer flex items-center justify-between">
                  <span className="font-semibold text-white">{faq.q}</span>
                  <span className="text-zinc-500 group-open:rotate-180 transition-transform">↓</span>
                </summary>
                <div className="px-6 pb-4 text-zinc-400">{faq.a}</div>
              </details>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-3xl p-12 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to get started?
            </h2>
            <p className="text-zinc-400 text-lg mb-10 max-w-2xl mx-auto">
              Join thousands of professionals already finding better
              opportunities with Carmen Job Search.
            </p>
            <Button href="/register" size="lg" showArrow>
              Start free
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
