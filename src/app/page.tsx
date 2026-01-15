import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Mail,
  Search,
  Sparkles,
  Github,
  Twitter,
  Heart,
  Check,
  Building2,
  BarChart3,
  Shield,
  Zap,
  Users,
  Clock,
  TrendingUp,
} from "lucide-react";

export default function Home() {
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
            <Link href="/about" className="text-zinc-400 hover:text-white transition-colors">
              Nosotros
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

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 mb-6">
            <Sparkles className="w-4 h-4 text-orange-500" />
            <span className="text-orange-400 text-sm font-medium">Potenciado por IA de Neuralflow</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Encuentra tu trabajo
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
              sin esfuerzo
            </span>
          </h1>

          <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
            Deja que la IA busque oportunidades laborales por ti. Recibe notificaciones
            personalizadas de las empresas que te interesan, las 24 horas del día.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-orange-500 text-white font-semibold text-lg hover:bg-orange-600 transition-all hover:scale-105 shadow-lg shadow-orange-500/25"
            >
              Empezar Gratis
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/features"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-zinc-700 text-white font-semibold text-lg hover:bg-zinc-800 transition-colors"
            >
              Ver cómo funciona
            </Link>
          </div>

          <p className="text-sm text-zinc-500">
            ✓ Gratis para empezar • ✓ Sin tarjeta de crédito • ✓ Cancela cuando quieras
          </p>
        </div>

        {/* Features */}
        <div id="features" className="grid md:grid-cols-3 gap-8 mt-24">
          <div className="p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-orange-500/50 transition-all hover:scale-[1.02]">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4">
              <Search className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Búsqueda Automática
            </h3>
            <p className="text-zinc-400">
              Nuestro sistema busca 24/7 en LinkedIn, Indeed y páginas de empresas
              automáticamente para encontrar las mejores oportunidades.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-orange-500/50 transition-all hover:scale-[1.02]">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Matching con IA
            </h3>
            <p className="text-zinc-400">
              OpenAI GPT-4 analiza cada oferta y la compara con tus preferencias para
              mostrarte solo los trabajos más relevantes.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-orange-500/50 transition-all hover:scale-[1.02]">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Alertas por Email
            </h3>
            <p className="text-zinc-400">
              Recibe notificaciones personalizadas en tiempo real con las mejores
              oportunidades encontradas según tu perfil.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <section className="mt-32 py-16">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-orange-500 mb-2">+500K</div>
              <p className="text-zinc-400">Ofertas procesadas</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-orange-500 mb-2">+10K</div>
              <p className="text-zinc-400">Usuarios activos</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-orange-500 mb-2">+50K</div>
              <p className="text-zinc-400">Empresas monitoreadas</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-orange-500 mb-2">92%</div>
              <p className="text-zinc-400">Tasa de éxito</p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="mt-32">
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            ¿Cómo funciona?
          </h2>
          <p className="text-zinc-400 text-center mb-12 max-w-2xl mx-auto">
            Configura tu búsqueda en minutos, deja que la IA trabaje por ti
          </p>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Regístrate", desc: "Crea tu cuenta en segundos", icon: Users },
              { step: "02", title: "Configura", desc: "Define tus preferencias laborales", icon: Settings },
              { step: "03", title: "Monitorea", desc: "Añade las empresas que te interesan", icon: Building2 },
              { step: "04", title: "Recibe", desc: "Obtén alertas por email", icon: Mail },
            ].map((item) => (
              <div key={item.step} className="text-center group">
                <div className="text-6xl font-bold text-orange-500/20 mb-4 group-hover:text-orange-500/30 transition-colors">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-zinc-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="mt-32">
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            ¿Por qué elegir Carmen?
          </h2>
          <p className="text-zinc-400 text-center mb-12 max-w-2xl mx-auto">
            La diferencia está en cómo utilizamos la inteligencia artificial
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: Clock,
                title: "Ahorra tiempo",
                description: "Ahorra hasta 20 horas semanales en búsqueda activa de empleo",
              },
              {
                icon: TrendingUp,
                title: "Mayor eficacia",
                description: "Algoritmo de matching con 92% de tasa de éxito",
              },
              {
                icon: Shield,
                title: "Datos seguros",
                description: "Tu información está encriptada y protegida",
              },
              {
                icon: Zap,
                title: "Ultra rápido",
                description: "Las ofertas se procesan y notifican en segundos",
              },
              {
                icon: BarChart3,
                title: "Analytics",
                description: "Métricas detalladas sobre tu búsqueda y progreso",
              },
              {
                icon: Building2,
                title: "Empresas ilimitadas",
                description: "Monitorea todas las empresas que desees",
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
          </div>
        </section>

        {/* Testimonials */}
        <section className="mt-32">
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            Lo que dicen nuestros usuarios
          </h2>
          <p className="text-zinc-400 text-center mb-12">
            Miles de profesionales ya encontraron su trabajo ideal
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "María García",
                role: "UX Designer",
                content: "Encontré mi trabajo actual en 2 semanas. Las alertas son muy precisas y me ahorraron mucho tiempo.",
              },
              {
                name: "Carlos Rodríguez",
                role: "Software Engineer",
                content: "El matching con IA es increíble. Solo recibo ofertas que realmente me interesan.",
              },
              {
                name: "Ana Martínez",
                role: "Marketing Manager",
                content: "Puedo monitorear mis empresas soñadas y recibo alertas cuando publican vacantes. Perfecto.",
              },
            ].map((testimonial) => (
              <div
                key={testimonial.name}
                className="p-6 rounded-xl bg-zinc-900/30 border border-zinc-800"
              >
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="text-orange-500">★</span>
                  ))}
                </div>
                <p className="text-zinc-300 mb-4">&ldquo;{testimonial.content}&rdquo;</p>
                <div>
                  <p className="text-white font-semibold">{testimonial.name}</p>
                  <p className="text-zinc-500 text-sm">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-32">
          <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-3xl p-12 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Comienza tu búsqueda automatizada hoy
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
      <footer className="border-t border-zinc-800 mt-32">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="w-8 h-8 text-orange-500" />
                <h3 className="text-lg font-bold text-white">Carmen Job Search</h3>
              </div>
              <p className="text-zinc-500 text-sm mb-4">
                Búsqueda automática de empleo con IA. Encuentra tu trabajo ideal sin
                esfuerzo.
              </p>
              <p className="text-zinc-600 text-xs">Desarrollado por Neuralflow</p>
              <div className="flex items-center gap-3 mt-4">
                <a
                  href="https://github.com/andresmoralesc1/carmen-job-search"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Producto */}
            <div>
              <h4 className="text-white font-semibold mb-4">Producto</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/register" className="text-zinc-500 hover:text-orange-500 text-sm transition-colors">
                    Registrarse
                  </Link>
                </li>
                <li>
                  <Link href="/features" className="text-zinc-500 hover:text-orange-500 text-sm transition-colors">
                    Características
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-zinc-500 hover:text-orange-500 text-sm transition-colors">
                    Precios
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-zinc-500 hover:text-orange-500 text-sm transition-colors">
                    Sobre nosotros
                  </Link>
                </li>
              </ul>
            </div>

            {/* Recursos */}
            <div>
              <h4 className="text-white font-semibold mb-4">Recursos</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/dashboard" className="text-zinc-500 hover:text-orange-500 text-sm transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <a href="https://github.com/andresmoralesc1/carmen-job-search" className="text-zinc-500 hover:text-orange-500 text-sm transition-colors">
                    GitHub
                  </a>
                </li>
                <li>
                  <a href="mailto:hello@neuralflow.ai" className="text-zinc-500 hover:text-orange-500 text-sm transition-colors">
                    Soporte
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy" className="text-zinc-500 hover:text-orange-500 text-sm transition-colors">
                    Privacidad
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-zinc-500 hover:text-orange-500 text-sm transition-colors">
                    Términos
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-zinc-500 text-sm">
              &copy; 2026 Carmen Job Search by Neuralflow. Todos los derechos reservados.
            </p>
            <p className="text-zinc-600 text-sm flex items-center gap-1">
              Hecho con <Heart className="w-4 h-4 text-red-500 fill-red-500" /> para buscadores de empleo
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
