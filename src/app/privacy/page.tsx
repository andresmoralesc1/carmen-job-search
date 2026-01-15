import Link from "next/link";
import { Briefcase, Shield } from "lucide-react";

export default function PrivacyPage() {
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
          <Shield className="w-10 h-10 text-orange-500" />
          <h1 className="text-4xl font-bold text-white">Política de Privacidad</h1>
        </div>

        <p className="text-zinc-400 mb-8">
          Última actualización: Enero 2026
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              1. Información que Recopilamos
            </h2>
            <div className="space-y-4 text-zinc-400">
              <p>
                Recopilamos la siguiente información para proporcionar nuestros servicios:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="text-white">Información de cuenta:</strong> Nombre, email, contraseña encriptada</li>
                <li><strong className="text-white">Preferencias laborales:</strong> Puestos de trabajo buscados, ubicación, rango salarial</li>
                <li><strong className="text-white">Empresas monitoreadas:</strong> Lista de empresas que deseas seguir</li>
                <li><strong className="text-white">API Keys:</strong> OpenAI API key encriptada para el servicio de matching</li>
                <li><strong className="text-white">Datos de uso:</strong> Cómo interactúas con nuestra plataforma</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              2. Cómo Usamos tu Información
            </h2>
            <div className="space-y-4 text-zinc-400">
              <p>Tu información se utiliza para:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Buscar y analizar ofertas de empleo que coincidan con tu perfil</li>
                <li>Enviarte alertas por email cuando haya ofertas relevantes</li>
                <li>Mejorar nuestros servicios y algoritmos de matching</li>
                <li>Proporcionar soporte técnico cuando lo necesites</li>
                <li>Cumplir con obligaciones legales</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              3. Protección de Datos
            </h2>
            <div className="space-y-4 text-zinc-400">
              <p>
                Implementamos medidas de seguridad robustas para proteger tu información:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="text-white">Encriptación:</strong> Todos los datos sensibles están encriptados en reposo y en tránsito</li>
                <li><strong className="text-white">Autenticación:</strong> Contraseñas hasheadas con bcrypt</li>
                <li><strong className="text-white">API Keys:</strong> Almacenadas con encriptación AES-256</li>
                <li><strong className="text-white">Acceso limitado:</strong> Solo personal autorizado puede acceder a los datos</li>
                <li><strong className="text-white">Auditoría:</strong> Logs de todos los accesos a datos</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              4. Compartición de Datos
            </h2>
            <div className="space-y-4 text-zinc-400">
              <p>
                <strong className="text-white">No vendemos</strong> tu información personal a terceros.
              </p>
              <p>
                Solo compartimos datos en los siguientes casos:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="text-white">Con tu consentimiento:</strong> Cuando explícitamente nos autorizas</li>
                <li><strong className="text-white">Proveedores de servicios:</strong> OpenAI (para matching), AWS (infraestructura)</li>
                <li><strong className="text-white">Requisitos legales:</strong> Cuando la ley lo exige</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              5. Tus Derechos
            </h2>
            <div className="space-y-4 text-zinc-400">
              <p>Tienes derecho a:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="text-white">Acceder:</strong> Solicitar una copia de tus datos</li>
                <li><strong className="text-white">Rectificar:</strong> Corregir información inexacta</li>
                <li><strong className="text-white">Eliminar:</strong> Solicitar la eliminación de tus datos</li>
                <li><strong className="text-white">Exportar:</strong> Recibir tus datos en formato portable</li>
                <li><strong className="text-white">Oponerte:</strong> Oponerte al procesamiento de tus datos</li>
              </ul>
              <p className="mt-4">
                Para ejercer estos derechos, contacta a{" "}
                <a href="mailto:privacy@neuralflow.ai" className="text-orange-500 hover:text-orange-400">
                  privacy@neuralflow.ai
                </a>
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              6. Retención de Datos
            </h2>
            <div className="space-y-4 text-zinc-400">
              <p>
                Conservamos tus datos mientras uses nuestros servicios. Después de cerrar tu
                cuenta, eliminamos:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Datos personales en 30 días</li>
                <li>Datos de uso en 90 días</li>
                <li>Logs del sistema en 1 año</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              7. Cookies y Tracking
            </h2>
            <div className="space-y-4 text-zinc-400">
              <p>
                Utilizamos cookies esenciales para la autenticación y preferencias. No usamos
                cookies de tracking de terceros para publicidad.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              8. Cambios a esta Política
            </h2>
            <div className="space-y-4 text-zinc-400">
              <p>
                Podemos actualizar esta política de privacidad. Te notificaremos por email
                cuando haya cambios significativos.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              9. Contacto
            </h2>
            <div className="space-y-4 text-zinc-400">
              <p>
                Para preguntas sobre esta política o tus datos personales:
              </p>
              <ul className="list-none space-y-2">
                <li>Email: <a href="mailto:privacy@neuralflow.ai" className="text-orange-500 hover:text-orange-400">privacy@neuralflow.ai</a></li>
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
