import Link from "next/link";
import { Briefcase, FileText } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black">
      {/* Header */}
      <header className="border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Briefcase className="w-8 h-8 text-orange-500" />
            <h1 className="text-xl font-bold text-white">Carmen Job Search</h1>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="flex items-center gap-3 mb-8">
          <FileText className="w-10 h-10 text-orange-500" />
          <h1 className="text-4xl font-bold text-white">Términos de Servicio</h1>
        </div>

        <p className="text-zinc-400 mb-8">
          Última actualización: Enero 2026
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              1. Aceptación de los Términos
            </h2>
            <div className="space-y-4 text-zinc-400">
              <p>
                Al acceder y usar Carmen Job Search ("el Servicio"), aceptas estos términos
                de servicio ("Términos") y nuestra política de privacidad. Si no estás de
                acuerdo con estos términos, no utilices el Servicio.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              2. Descripción del Servicio
            </h2>
            <div className="space-y-4 text-zinc-400">
              <p>
                Carmen Job Search es una plataforma de búsqueda de empleo automatizada
                que incluye:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Búsqueda automatizada de ofertas en LinkedIn, Indeed y otros sitios</li>
                <li>Matching con IA de ofertas con tu perfil</li>
                <li>Alertas por email de oportunidades relevantes</li>
                <li>Monitoreo de empresas específicas</li>
                <li>Dashboard y estadísticas de tu búsqueda</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              3. Responsabilidades del Usuario
            </h2>
            <div className="space-y-4 text-zinc-400">
              <p>Como usuario, te comprometes a:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Proporcionar información veraz y actualizada</li>
                <li>Mantener segura tu contraseña y cuenta</li>
                <li>No compartir tu cuenta con terceros</li>
                <li>Usar el servicio solo para búsqueda personal de empleo</li>
                <li>No hacer scraping abusivo de las plataformas monitoreadas</li>
                <li>Respetar los términos de servicio de las plataformas de empleo</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              4. Uso Prohibido
            </h2>
            <div className="space-y-4 text-zinc-400">
              <p>Está prohibido:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Usar el servicio para fines ilegales o no autorizados</li>
                <li>Revertir ingeniería o hackear el servicio</li>
                <li>Interrumpir o sobrecargar los servidores</li>
                <li>Crear múltiples cuentas abusivas</li>
                <li>Usar el servicio para reclutamiento masivo sin autorización</li>
                <li>Compartir datos de ofertas con terceros comercialmente</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              5. Propiedad Intelectual
            </h2>
            <div className="space-y-4 text-zinc-400">
              <p>
                El Servicio y su contenido original, características y funcionalidades son
                propiedad exclusiva de Neuralflow y están protegidos por leyes de
                propiedad intelectual.
              </p>
              <p>
                Las ofertas de empleo encontradas son propiedad de sus respectivos
                publicadores. Solo actúamos como intermediario tecnológico.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              6. Pagos y Suscripciones
            </h2>
            <div className="space-y-4 text-zinc-400">
              <p>
                <strong className="text-white">Planes de pago:</strong> Los planes Pro y Enterprise
                se facturan mensualmente. Puedes cancelar en cualquier momento.
              </p>
              <p>
                <strong className="text-white">Reembolsos:</strong> Proveemos reembolsos
                dentro de los primeros 14 días si no estás satisfecho.
              </p>
              <p>
                <strong className="text-white">Cambios de precio:</strong> Te notificaremos con
                30 días de anticipación antes de cualquier cambio de precio.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              7. Limitación de Responsabilidad
            </h2>
            <div className="space-y-4 text-zinc-400">
              <p>
                El Servicio se proporciona "tal cual" sin garantías de ningún tipo. No
                somos responsables de:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>La precisión o vigencia de las ofertas encontradas</li>
                <li>La contratación final por parte de las empresas</li>
                <li>Interrupciones temporales del servicio</li>
                <li>Daños indirectos, incidentales o consecuentes</li>
                <li>Contenido de terceros en las plataformas monitoreadas</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              8. Terminación
            </h2>
            <div className="space-y-4 text-zinc-400">
              <p>
                Podemos suspender o terminar tu cuenta si violas estos términos o usas
                el servicio de manera abusiva. También puedes cerrar tu cuenta en
                cualquier momento desde tu dashboard.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              9. Modificaciones del Servicio
            </h2>
            <div className="space-y-4 text-zinc-400">
              <p>
                Nos reservamos el derecho de modificar, suspender o discontinuar
                cualquier aspecto del servicio en cualquier momento. Te notificaremos
                cambios significativos con al menos 30 días de anticipación.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              10. Ley Aplicable
            </h2>
            <div className="space-y-4 text-zinc-400">
              <p>
                Estos términos se rigen por las leyes de Colombia. Cualquier disputa será
                resuelta en los tribunales de Bogotá, Colombia.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              11. Contacto
            </h2>
            <div className="space-y-4 text-zinc-400">
              <p>
                Para preguntas sobre estos términos:
              </p>
              <ul className="list-none space-y-2">
                <li>Email: <a href="mailto:legal@neuralflow.ai" className="text-orange-500 hover:text-orange-400">legal@neuralflow.ai</a></li>
                <li>Dirección: Neuralflow AI, Calle 123 #45-67, Bogotá, Colombia</li>
              </ul>
            </div>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-800">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
          >
            ← Volver al inicio
          </Link>
        </div>
      </main>
    </div>
  );
}
