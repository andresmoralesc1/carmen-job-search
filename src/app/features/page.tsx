import Link from "next/link";
import {
  Briefcase,
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

export default function FeaturesPage() {
  const features = [
    {
      icon: Search,
      title: "Búsqueda Automatizada",
      description:
        "Nuestros bots爬虫 (scrapers) buscan 24/7 en LinkedIn, Indeed y páginas de empresas para encontrar las mejores ofertas.",
      details: [
        "LinkedIn Job Search",
        "Indeed",
        "Paginas de empresas",
        "Actualización en tiempo real",
      ],
    },
    {
      icon: Target,
      title: "Matching con IA",
      description:
        "OpenAI GPT-4 analiza cada oferta y la compara con tus preferencias para encontrar la mejor coincidencia.",
      details: [
        "Análisis semántico",
        "Coincidencia por habilidades",
        "Puntuación de relevancia",
        "Aprendizaje continuo",
      ],
    },
    {
      icon: Bell,
      title: "Alertas por Email",
      description:
        "Recibe notificaciones instantáneas cuando aparezcan ofertas que coincidan con tu perfil.",
      details: [
        "Notificaciones en tiempo real",
        "Resúmenes diarios/semanales",
        "Filtros personalizados",
        "Sin spam, solo lo relevante",
      ],
    },
    {
      icon: Building2,
      title: "Monitoreo de Empresas",
      description:
        "Agrega tus empresas soñadas y recibe alertas cuando publiquen nuevas vacantes.",
      details: [
        "Seguimiento de empresas",
        "Alertas de nuevas vacantes",
        "Historial de publicaciones",
        "Análisis de tendencias",
      ],
    },
    {
      icon: Settings,
      title: "Preferencias Avanzadas",
      description:
        "Configura filtros detallados por ubicación, salario, modalidad, tipo de contrato y más.",
      details: [
        "Ubación y remoto",
        "Rango salarial",
        "Tipo de contrato",
        "Jornada y horarios",
      ],
    },
    {
      icon: BarChart3,
      title: "Dashboard y Estadísticas",
      description:
        "Visualiza tu progreso con gráficos interactivos y métricas detalladas de tu búsqueda.",
      details: [
        "Ofertas por día",
        "Tasa de respuesta",
        "Empresas más activas",
        "Análisis de mercado",
      ],
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
            <Link href="/pricing" className="text-zinc-400 hover:text-white transition-colors">
              Precios
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
            <span className="text-orange-400 text-sm font-medium">Características</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Todo lo que necesitas
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
              para encontrar trabajo
            </span>
          </h1>

          <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
            Una suite completa de herramientas impulsadas por IA para automatizar tu
            búsqueda de empleo y maximizar tus oportunidades.
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
                    <span className="text-orange-400 text-sm font-medium">Característica</span>
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
              Más características potentes
            </h2>
            <p className="text-zinc-400 text-lg">
              Todo lo que necesitas para una búsqueda exitosa
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Clock,
                title: "Ahorro de Tiempo",
                description:
                  "Ahorra hasta 20 horas semanales en búsqueda activa de empleo",
              },
              {
                icon: Shield,
                title: "Datos Seguros",
                description:
                  "Tu información está encriptada y protegida con los más altos estándares",
              },
              {
                icon: Zap,
                title: "Ultra Rápido",
                description:
                  "Las ofertas se procesan y notifican en segundos de aparecer",
              },
              {
                icon: Globe,
                title: "Ámbito Global",
                description:
                  "Busca oportunidades en múltiples países y regiones simultáneamente",
              },
              {
                icon: BarChart3,
                title: "Analytics",
                description:
                  "Métricas detalladas sobre tu búsqueda y tasa de éxito",
              },
              {
                icon: Settings,
                title: "Personalizable",
                description:
                  "Adapta todos los parámetros a tus necesidades específicas",
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
              ¿Cómo funciona?
            </h2>
            <p className="text-zinc-400 text-lg">
              Configura tu búsqueda en minutos, deja que la IA trabaje
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Crea tu cuenta",
                description: "Regístrate en menos de 2 minutos",
              },
              {
                step: "02",
                title: "Configura preferencias",
                description: "Define qué puestos y empresas te interesan",
              },
              {
                step: "03",
                title: "IA busca por ti",
                description: "Nuestros bots trabajan 24/7 automáticamente",
              },
              {
                step: "04",
                title: "Recibe ofertas",
                description: "Notificaciones instantáneas por email",
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
              Comienza a recibir ofertas hoy
            </h2>
            <p className="text-zinc-400 text-lg mb-10 max-w-2xl mx-auto">
              Únete a miles de profesionales que ya están encontrando mejores
              oportunidades con Carmen Job Search.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-orange-500 text-white font-semibold text-lg hover:bg-orange-600 transition-all hover:scale-105"
              >
                Crear cuenta gratis
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-zinc-700 text-white font-semibold text-lg hover:bg-zinc-800 transition-all"
              >
                Ver planes
              </Link>
            </div>
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
