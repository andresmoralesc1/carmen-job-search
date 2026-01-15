"use client";

import { useState } from "react";
import Link from "next/link";
import { Briefcase, ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AutocompleteJobTitles } from "@/components/ui/AutocompleteJobTitles";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [jobTitles, setJobTitles] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    openaiApiKey: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1) {
      // Validate step 1
      if (!formData.name || !formData.email || !formData.openaiApiKey) {
        toast.error("Completa todos los campos", {
          description: "Nombre, email y API key son obligatorios"
        });
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast.error("Email inválido", {
          description: "Ingresa un email válido"
        });
        return;
      }

      setStep(2);
    } else {
      // Validate step 2
      if (jobTitles.length === 0) {
        toast.error("Agrega al menos un puesto", {
          description: "Debes agregar al menos un puesto de trabajo"
        });
        return;
      }

      setIsSubmitting(true);

      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        // TODO: Submit to API Bridge
        console.log("Submitting:", { ...formData, jobTitles });

        toast.success("¡Cuenta creada correctamente!", {
          description: "Bienvenido a Carmen Job Search",
          duration: 3000
        });

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      } catch (error) {
        toast.error("Error al crear cuenta", {
          description: "No se pudo completar el registro. Inténtalo de nuevo."
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black">
      {/* Header */}
      <header className="border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-2">
          <Briefcase className="w-8 h-8 text-orange-500" />
          <h1 className="text-xl font-bold text-white">Carmen Job Search</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-16">
        {/* Progress */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className={`flex items-center gap-2 ${step >= 1 ? "text-orange-500" : "text-zinc-600"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              step >= 1 ? "bg-orange-500 text-white" : "bg-zinc-800 text-zinc-500"
            }`}>
              1
            </div>
            <span className="font-medium">Cuenta</span>
          </div>
          <div className={`w-16 h-1 rounded ${step >= 2 ? "bg-orange-500" : "bg-zinc-800"}`} />
          <div className={`flex items-center gap-2 ${step >= 2 ? "text-orange-500" : "text-zinc-600"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              step >= 2 ? "bg-orange-500 text-white" : "bg-zinc-800 text-zinc-500"
            }`}>
              2
            </div>
            <span className="font-medium">Preferencias</span>
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            {step === 1 ? "Crea tu cuenta" : "¿Qué estás buscando?"}
          </h2>
          <p className="text-zinc-400 mb-8">
            {step === 1
              ? "Comienza tu búsqueda de empleo automatizada"
              : "Cuéntanos qué puestos te interesan"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 ? (
              <>
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isSubmitting}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Ej: María García"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    disabled={isSubmitting}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="tu@email.com"
                  />
                </div>

                {/* OpenAI API Key */}
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    OpenAI API Key
                  </label>
                  <div className="relative">
                    <input
                      type={showApiKey ? "text" : "password"}
                      required
                      disabled={isSubmitting}
                      value={formData.openaiApiKey}
                      onChange={(e) => setFormData({ ...formData, openaiApiKey: e.target.value })}
                      className="w-full px-4 py-3 pr-12 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="sk-..."
                    />
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 disabled:cursor-not-allowed"
                    >
                      {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-zinc-500">
                    Tu API key se encriptará y almacenará de forma segura. Se usará para el
                    matching de ofertas con tus preferencias.
                  </p>
                </div>
              </>
            ) : (
              <>
                {/* Job Titles with Autocomplete */}
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Puestos de trabajo que buscas
                  </label>
                  <AutocompleteJobTitles
                    selectedTitles={jobTitles}
                    onAdd={(title) => setJobTitles([...jobTitles, title])}
                    onRemove={(title) => setJobTitles(jobTitles.filter((t) => t !== title))}
                    disabled={isSubmitting}
                  />
                </div>

                {/* Info box */}
                <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
                  <p className="text-sm text-orange-400">
                    <strong>Próximo paso:</strong> Después de registrarte, podrás agregar
                    empresas específicas que deseas monitorear y configurar tus horarios de
                    notificación.
                  </p>
                </div>
              </>
            )}

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              {step === 2 && (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setStep(1)}
                  className="px-6 py-3 rounded-xl border border-zinc-700 text-white font-medium hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Atrás
                </button>
              )}
              <button
                type="submit"
                disabled={isSubmitting || (step === 2 && jobTitles.length === 0)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {step === 1 ? "Validando..." : "Creando cuenta..."}
                  </>
                ) : (
                  <>
                    {step === 1 ? "Continuar" : "Crear cuenta"}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-500">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="text-orange-500 hover:text-orange-400 font-medium">
              Inicia sesión
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
