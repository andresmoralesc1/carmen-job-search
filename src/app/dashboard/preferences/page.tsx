"use client";

import { useState } from "react";
import Link from "next/link";
import { Briefcase, ArrowLeft, Clock, Check } from "lucide-react";

const timezones = [
  { value: "America/Bogota", label: "Colombia (Bogotá)", offset: -5 },
  { value: "America/Mexico_City", label: "México (CDMX)", offset: -6 },
  { value: "America/Argentina/Buenos_Aires", label: "Argentina (Buenos Aires)", offset: -3 },
  { value: "America/Lima", label: "Perú (Lima)", offset: -5 },
  { value: "America/Santiago", label: "Chile (Santiago)", offset: -4 },
  { value: "Europe/Madrid", label: "España (Madrid)", offset: +1 },
];

const availableTimes = [
  "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"
];

export default function PreferencesPage() {
  const [timezone, setTimezone] = useState("America/Bogota");
  const [selectedTimes, setSelectedTimes] = useState<string[]>(["08:00", "12:00", "18:00"]);
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "instant">("daily");

  const toggleTime = (time: string) => {
    if (selectedTimes.includes(time)) {
      setSelectedTimes(selectedTimes.filter(t => t !== time));
    } else {
      setSelectedTimes([...selectedTimes, time].sort());
    }
  };

  const handleSave = () => {
    // TODO: Call API to save preferences
    console.log({ timezone, preferredTimes: selectedTimes, frequency });
    alert("Preferencias guardadas correctamente");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <Link href="/" className="flex items-center gap-2">
              <Briefcase className="w-8 h-8 text-orange-500" />
              <h1 className="text-xl font-bold text-white">Carmen Job Search</h1>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold">
              M
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Configuración de Email</h1>
          <p className="text-zinc-400">
            Define cuándo y cómo deseas recibir notificaciones sobre nuevas oportunidades
          </p>
        </div>

        <div className="space-y-8">
          {/* Timezone Selection */}
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
            <h2 className="text-xl font-semibold text-white mb-4">Zona Horaria</h2>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:border-orange-500 transition-colors"
            >
              {timezones.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label} (GMT{tz.offset >= 0 ? "+" : ""}{tz.offset})
                </option>
              ))}
            </select>
          </div>

          {/* Preferred Times */}
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
            <h2 className="text-xl font-semibold text-white mb-4">
              Horarios Preferidos
            </h2>
            <p className="text-zinc-400 text-sm mb-4">
              Selecciona las horas en las que deseas recibir emails con nuevas ofertas
            </p>

            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
              {availableTimes.map((time) => {
                const isSelected = selectedTimes.includes(time);
                return (
                  <button
                    key={time}
                    onClick={() => toggleTime(time)}
                    className={`relative px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                      isSelected
                        ? "bg-orange-500 text-white"
                        : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                    }`}
                  >
                    {time}
                    {isSelected && (
                      <Check className="w-4 h-4 absolute top-1 right-1 opacity-70" />
                    )}
                  </button>
                );
              })}
            </div>

            {selectedTimes.length > 0 && (
              <div className="mt-4 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                <p className="text-sm text-orange-400">
                  Recibirás emails a las: {selectedTimes.join(", ")} {timezoneLabel(timezone)}
                </p>
              </div>
            )}
          </div>

          {/* Frequency */}
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
            <h2 className="text-xl font-semibold text-white mb-4">Frecuencia</h2>
            <div className="space-y-3">
              {[
                { value: "daily", label: "Diario", desc: "Recibe un resumen diario con todas las nuevas ofertas" },
                { value: "weekly", label: "Semanal", desc: "Recibe un resumen semanal cada lunes" },
                { value: "instant", label: "Inmediato", desc: "Recibe notificación en cuanto se encuentre una oferta" },
              ].map((freq) => (
                <button
                  key={freq.value}
                  onClick={() => setFrequency(freq.value as any)}
                  className={`w-full p-4 rounded-xl text-left transition-all ${
                    frequency === freq.value
                      ? "bg-orange-500 border-orange-500"
                      : "bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
                  } border`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      frequency === freq.value ? "border-white" : "border-zinc-500"
                    }`}>
                      {frequency === freq.value && (
                        <div className="w-2.5 h-2.5 rounded-full bg-white" />
                      )}
                    </div>
                    <div>
                      <p className={`font-medium ${frequency === freq.value ? "text-white" : "text-zinc-300"}`}>
                        {freq.label}
                      </p>
                      <p className={`text-sm ${frequency === freq.value ? "text-orange-100" : "text-zinc-500"}`}>
                        {freq.desc}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="w-full py-4 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-all hover:scale-[1.01]"
          >
            Guardar Preferencias
          </button>
        </div>
      </main>
    </div>
  );
}

function timezoneLabel(tz: string): string {
  const labels: Record<string, string> = {
    "America/Bogota": "COL",
    "America/Mexico_City": "MEX",
    "America/Argentina/Buenos_Aires": "ARG",
    "America/Lima": "PER",
    "America/Santiago": "CHL",
    "Europe/Madrid": "ESP",
  };
  return labels[tz] || tz;
}
