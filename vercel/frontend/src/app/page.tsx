import Link from "next/link";
import { ArrowRight, Briefcase, Mail, Search, Sparkles, Github, Twitter, Heart } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black">
      {/* Header */}
      <header className="border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="w-8 h-8 text-orange-500" />
            <h1 className="text-xl font-bold text-white">Carmen Job Search</h1>
          </div>
          <Link
            href="/register"
            className="px-6 py-2 rounded-full bg-orange-500 text-white font-medium hover:bg-orange-600 transition-colors"
          >
            Comenzar
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 mb-6">
            <Sparkles className="w-4 h-4 text-orange-500" />
            <span className="text-orange-400 text-sm font-medium">Potenciado por IA</span>
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
            personalizadas de las empresas que te interesan.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-orange-500 text-white font-semibold text-lg hover:bg-orange-600 transition-all hover:scale-105"
            >
              Empezar Gratis
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="#features"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-zinc-700 text-white font-semibold text-lg hover:bg-zinc-800 transition-colors"
            >
              Saber más
            </Link>
          </div>
        </div>

        {/* Features */}
        <div id="features" className="grid md:grid-cols-3 gap-8 mt-24">
          <div className="p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-orange-500/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4">
              <Search className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Búsqueda Automática
            </h3>
            <p className="text-zinc-400">
              Nuestro sistema scrapea LinkedIn, Indeed y páginas de empresas automáticamente
              para encontrar las mejores oportunidades.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-orange-500/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Matching con IA
            </h3>
            <p className="text-zinc-400">
              OpenAI analiza cada oferta y la compara con tus preferencias para mostrarte
              solo los trabajos más relevantes.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-orange-500/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Alertas por Email
            </h3>
            <p className="text-zinc-400">
              Recibe notificaciones personalizadas en el horario que prefieras con las
              mejores oportunidades encontradas.
            </p>
          </div>
        </div>

        {/* How it works */}
        <div className="mt-32">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            ¿Cómo funciona?
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Regístrate", desc: "Crea tu cuenta en segundos" },
              { step: "02", title: "Configura", desc: "Define tus preferencias laborales" },
              { step: "03", title: "Agrega empresas", desc: "Añade las empresas que te interesan" },
              { step: "04", title: "Recibe ofertas", desc: "Obtén alertas por email" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="text-6xl font-bold text-orange-500/20 mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-zinc-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
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
                Búsqueda automática de empleo con IA. Encuentra tu trabajo ideal sin esfuerzo.
              </p>
              <div className="flex items-center gap-3">
                <a
                  href="https://github.com"
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

            {/* Product */}
            <div>
              <h4 className="text-white font-semibold mb-4">Producto</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/register" className="text-zinc-500 hover:text-orange-500 text-sm transition-colors">
                    Registrarse
                  </Link>
                </li>
                <li>
                  <Link href="/#features" className="text-zinc-500 hover:text-orange-500 text-sm transition-colors">
                    Características
                  </Link>
                </li>
                <li>
                  <Link href="/#how-it-works" className="text-zinc-500 hover:text-orange-500 text-sm transition-colors">
                    Cómo funciona
                  </Link>
                </li>
                <li>
                  <a href="#pricing" className="text-zinc-500 hover:text-orange-500 text-sm transition-colors">
                    Precios
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-white font-semibold mb-4">Recursos</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#docs" className="text-zinc-500 hover:text-orange-500 text-sm transition-colors">
                    Documentación
                  </a>
                </li>
                <li>
                  <a href="#api" className="text-zinc-500 hover:text-orange-500 text-sm transition-colors">
                    API
                  </a>
                </li>
                <li>
                  <a href="#blog" className="text-zinc-500 hover:text-orange-500 text-sm transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#support" className="text-zinc-500 hover:text-orange-500 text-sm transition-colors">
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
                  <a href="#privacy" className="text-zinc-500 hover:text-orange-500 text-sm transition-colors">
                    Privacidad
                  </a>
                </li>
                <li>
                  <a href="#terms" className="text-zinc-500 hover:text-orange-500 text-sm transition-colors">
                    Términos
                  </a>
                </li>
                <li>
                  <a href="#cookies" className="text-zinc-500 hover:text-orange-500 text-sm transition-colors">
                    Cookies
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-zinc-500 text-sm">
              &copy; 2026 Carmen Job Search. Todos los derechos reservados.
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
