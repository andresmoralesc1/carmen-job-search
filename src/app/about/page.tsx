import Link from "next/link";
import {
  Briefcase,
  Sparkles,
  Target,
  Users,
  Zap,
  Shield,
  ArrowRight,
  Github,
  Twitter,
  Mail,
} from "lucide-react";

export default function AboutPage() {
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
            <Link href="/features" className="text-zinc-400 hover:text-white transition-colors">
              Características
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
            <span className="text-orange-400 text-sm font-medium">Sobre Nosotros</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Encuentra trabajo
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
              sin esfuerzo
            </span>
          </h1>

          <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
            Carmen Job Search fue creada por{" "}
            <span className="text-orange-400 font-semibold">Neuralflow</span> para
            revolucionar la forma en que buscas empleo utilizando inteligencia artificial
            avanzada.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-orange-500 text-white font-semibold text-lg hover:bg-orange-600 transition-all hover:scale-105"
            >
              Comenzar Gratis
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/features"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-zinc-700 text-white font-semibold text-lg hover:bg-zinc-800 transition-all"
            >
              Ver Características
            </Link>
          </div>
        </section>

        {/* Mission Section */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">
                Nuestra Misión
              </h2>
              <p className="text-zinc-400 text-lg mb-6">
                En Neuralflow creemos que la búsqueda de empleo no debe ser un trabajo en
                sí mismo. Por eso desarrollamos Carmen Job Search, una plataforma que
                utiliza IA para automatizar todo el proceso.
              </p>
              <p className="text-zinc-400 text-lg mb-6">
                Nuestro sistema busca automáticamente oportunidades en LinkedIn, Indeed y
                páginas de empresas, las analiza con IA para encontrar las mejores
                coincidencias con tu perfil, y te notifica instantáneamente.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 border-2 border-zinc-900 flex items-center justify-center text-white font-bold"
                    >
                      {i}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-white font-semibold">+10,000</p>
                  <p className="text-zinc-500 text-sm">Usuarios activos</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Target, label: "Matches", value: "+500K" },
                { icon: Users, label: "Empresas", value: "+50K" },
                { icon: Zap, label: "Alertas", value: "+1M" },
                { icon: Shield, label: "Uptime", value: "99.9%" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 text-center"
                >
                  <stat.icon className="w-8 h-8 text-orange-500 mx-auto mb-3" />
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-zinc-500 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Us Section */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              ¿Por qué Carmen Job Search?
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              La diferencia está en cómo utilizamos la inteligencia artificial para
              hacerte la vida más fácil
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Búsqueda Automatizada",
                description:
                  "Nuestros bots buscan 24/7 en múltiples plataformas para que tú no tengas que hacerlo.",
                icon: "🔍",
              },
              {
                title: "Matching con IA",
                description:
                  "OpenAI analiza cada oferta y la compara con tus preferencias para encontrar la mejor coincidencia.",
                icon: "🤖",
              },
              {
                title: "Notificaciones Instantáneas",
                description:
                  "Recibe alertas por email en el momento que aparezcan ofertas que coinciden con tu perfil.",
                icon: "🔔",
              },
              {
                title: "Filtros Avanzados",
                description:
                  "Configura filtros por ubicación, salario, modalidad y más para recibir solo ofertas relevantes.",
                icon: "⚙️",
              },
              {
                title: "Monitoreo de Empresas",
                description:
                  "Agrega tus empresas soñadas y recibe alertas cuando publiquen nuevas vacantes.",
                icon: "🏢",
              },
              {
                title: "Dashboard Intuitivo",
                description:
                  "Gestiona todo desde un panel de control moderno y fácil de usar con estadísticas en tiempo real.",
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
              Desarrollado por Neuralflow
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto mb-8">
              Somos un equipo de ingenieros apasionados por la inteligencia artificial y
              el machine learning, dedicados a crear herramientas que simplifican la
              vida de las personas.
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
                href="https://twitter.com/neuralflow"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800 transition-colors"
              >
                <Twitter className="w-5 h-5" />
                Twitter
              </a>
              <a
                href="mailto:hello@neuralflow.ai"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800 transition-colors"
              >
                <Mail className="w-5 h-5" />
                Contacto
              </a>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-7xl mx-auto px-6 py-24 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Comienza tu búsqueda automatizada hoy
          </h2>
          <p className="text-zinc-400 text-lg mb-10 max-w-2xl mx-auto">
            Únete a miles de profesionales que ya están encontrando mejores oportunidades
            con Carmen Job Search.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-orange-500 text-white font-semibold text-lg hover:bg-orange-600 transition-all hover:scale-105"
          >
            Crear cuenta gratis
            <ArrowRight className="w-5 h-5" />
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="w-6 h-6 text-orange-500" />
                <span className="font-bold text-white">Carmen Job Search</span>
              </div>
              <p className="text-zinc-500 text-sm">
                Búsqueda de empleo automatizada con IA
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Producto</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/features" className="text-zinc-500 hover:text-white transition-colors">
                    Características
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-zinc-500 hover:text-white transition-colors">
                    Precios
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-zinc-500 hover:text-white transition-colors">
                    Sobre nosotros
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/privacy" className="text-zinc-500 hover:text-white transition-colors">
                    Privacidad
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-zinc-500 hover:text-white transition-colors">
                    Términos
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Conecta</h4>
              <div className="flex gap-3">
                <a
                  href="https://github.com/neuralflow"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-500 hover:text-white transition-colors"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href="https://twitter.com/neuralflow"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-500 hover:text-white transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-zinc-800 text-center text-sm text-zinc-500">
            <p>© 2026 Carmen Job Search by Neuralflow. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
