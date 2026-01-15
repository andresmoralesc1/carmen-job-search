import Link from "next/link";
import {
  Briefcase,
  Sparkles,
  Check,
  X,
  ArrowRight,
  Zap,
  Crown,
} from "lucide-react";

export default function PricingPage() {
  const plans = [
    {
      name: "Free",
      description: "Para empezar tu búsqueda",
      price: "$0",
      period: "siempre",
      popular: false,
      features: [
        { included: true, text: "5 búsquedas activas" },
        { included: true, text: "10 empresas monitoreadas" },
        { included: true, text: "Alertas por email" },
        { included: true, text: "Dashboard básico" },
        { included: true, text: "Matching con IA básico" },
        { included: false, text: "Búsquedas ilimitadas" },
        { included: false, text: "Alertas en tiempo real" },
        { included: false, text: "API access" },
        { included: false, text: "Soporte prioritario" },
      ],
      cta: "Comenzar gratis",
      href: "/register",
    },
    {
      name: "Pro",
      description: "Para búsqueda activa",
      price: "$9",
      period: "/mes",
      popular: true,
      features: [
        { included: true, text: "Búsquedas ilimitadas" },
        { included: true, text: "Empresas ilimitadas" },
        { included: true, text: "Alertas en tiempo real" },
        { included: true, text: "Dashboard avanzado" },
        { included: true, text: "Matching con IA GPT-4" },
        { included: true, text: "Exportar a CSV/PDF" },
        { included: true, text: "Historial ilimitado" },
        { included: false, text: "API access" },
        { included: false, text: "Soporte prioritario" },
        { included: false, text: "Integraciones" },
      ],
      cta: "Empezar Pro",
      href: "/register?plan=pro",
    },
    {
      name: "Enterprise",
      description: "Para equipos y reclutadores",
      price: "Custom",
      period: "",
      popular: false,
      features: [
        { included: true, text: "Todo en Pro" },
        { included: true, text: "API access completo" },
        { included: true, text: "Soporte prioritario 24/7" },
        { included: true, text: "Integraciones custom" },
        { included: true, text: "SLA garantizado" },
        { included: true, text: "Múltiples usuarios" },
        { included: true, text: "Reportes custom" },
        { included: true, text: "Webhooks" },
        { included: true, text: "Dedicado account manager" },
        { included: true, text: "Onsite training" },
      ],
      cta: "Contactar ventas",
      href: "mailto:hello@neuralflow.ai",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black">
      {/* Header */}
      <header className="border-b border-zinc-800 sticky top-0 z-50 backdrop-blur-xl bg-black/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Briefcase className="w-8 h-8 text-orange-500" />
            <h1 className="text-xl font-bold text-white">Carmen Job Search</h1>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/about" className="text-zinc-400 hover:text-white transition-colors">
              Nosotros
            </Link>
            <Link href="/features" className="text-zinc-400 hover:text-white transition-colors">
              Características
            </Link>
            <Link
              href="/register"
              className="px-6 py-2 rounded-full bg-orange-500 text-white font-medium hover:bg-orange-600 transition-colors"
            >
              Comenzar
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 mb-6">
            <Sparkles className="w-4 h-4 text-orange-500" />
            <span className="text-orange-400 text-sm font-medium">Precios</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Planes para cada
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
              necesidad
            </span>
          </h1>

          <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
            Comienza gratis, escala cuando lo necesites. Sin compromisos, cancela
            cuando quieras.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800">
            <span className="text-white text-sm">Mensual</span>
            <div className="w-12 h-6 rounded-full bg-orange-500 relative">
              <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white" />
            </div>
            <span className="text-zinc-500 text-sm">Anual (ahorra 20%)</span>
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
                      Más popular
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
              Preguntas Frecuentes
            </h2>
            <p className="text-zinc-400">
              Todo lo que necesitas saber sobre nuestros planes
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "¿Puedo cambiar de plan en cualquier momento?",
                a: "Sí, puedes actualizar o bajar tu plan en cualquier momento desde tu dashboard. Los cambios se aplican de inmediato y te cobramos prorrateadamente.",
              },
              {
                q: "¿Qué métodos de pago aceptan?",
                a: "Aceptamos todas las tarjetas de crédito y débito (Visa, Mastercard, American Express), PayPal, y transferencias bancarias para planes Enterprise.",
              },
              {
                q: "¿Hay prueba gratuita?",
                a: "El plan Free es completamente gratis y sin límite de tiempo. También ofrecemos 14 días de prueba del plan Pro sin compromiso.",
              },
              {
                q: "¿Puedo cancelar mi suscripción?",
                a: "Por supuesto. Puedes cancelar en cualquier momento desde tu dashboard. No hay penalizaciones y continuarás teniendo acceso hasta el fin del periodo facturado.",
              },
              {
                q: "¿Qué incluye el soporte prioritario?",
                a: "El soporte prioritario incluye respuesta garantizada en menos de 2 horas, canal de comunicación directo con nuestro equipo, y sesiones de onboarding personalizadas.",
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
              ¿Listo para empezar?
            </h2>
            <p className="text-zinc-400 text-lg mb-10 max-w-2xl mx-auto">
              Únete a miles de profesionales que ya están encontrando mejores
              oportunidades con Carmen Job Search.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-orange-500 text-white font-semibold text-lg hover:bg-orange-600 transition-all hover:scale-105"
            >
              Comenzar gratis
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-orange-500" />
              <span className="font-bold text-white">Carmen Job Search</span>
            </div>
            <p className="text-sm text-zinc-500">
              © 2026 Neuralflow. Todos los derechos reservados.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="text-zinc-500 hover:text-white transition-colors">
                Privacidad
              </Link>
              <Link href="/terms" className="text-zinc-500 hover:text-white transition-colors">
                Términos
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
