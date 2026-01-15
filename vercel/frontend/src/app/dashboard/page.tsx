"use client";

import Link from "next/link";
import { Briefcase, Building2, Mail, Settings, Search, ArrowRight } from "lucide-react";

export default function DashboardPage() {
  // TODO: Get user data from session
  const user = {
    name: "María García",
    email: "maria@example.com",
    companiesCount: 3,
    jobsFound: 12,
    lastEmailSent: "Hoy, 8:00 AM"
  };

  const stats = [
    {
      label: "Empresas monitoreadas",
      value: user.companiesCount,
      icon: Building2,
      color: "bg-orange-500/10 text-orange-500"
    },
    {
      label: "Trabajos encontrados",
      value: user.jobsFound,
      icon: Briefcase,
      color: "bg-blue-500/10 text-blue-500"
    },
    {
      label: "Último email",
      value: user.lastEmailSent,
      icon: Mail,
      color: "bg-green-500/10 text-green-500"
    }
  ];

  const actions = [
    {
      title: "Gestionar Empresas",
      description: "Agrega o elimina empresas que deseas monitorear",
      href: "/dashboard/companies",
      icon: Building2
    },
    {
      title: "Configurar Horarios",
      description: "Define cuándo quieres recibir notificaciones por email",
      href: "/dashboard/preferences",
      icon: Settings
    },
    {
      title: "Ver Trabajos",
      description: "Explora las oportunidades encontradas para ti",
      href: "/dashboard/jobs",
      icon: Search
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <Briefcase className="w-8 h-8 text-orange-500" />
              <h1 className="text-xl font-bold text-white">Carmen Job Search</h1>
            </Link>
            <nav className="hidden md:flex items-center gap-4">
              <Link href="/dashboard" className="text-orange-500 font-medium">Dashboard</Link>
              <Link href="/dashboard/companies" className="text-zinc-400 hover:text-white transition-colors">Empresas</Link>
              <Link href="/dashboard/jobs" className="text-zinc-400 hover:text-white transition-colors">Trabajos</Link>
              <Link href="/dashboard/preferences" className="text-zinc-400 hover:text-white transition-colors">Configuración</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:block text-zinc-400 text-sm">{user.name}</span>
            <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold">
              {user.name.charAt(0)}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Welcome */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-white mb-2">
            Bienvenido, {user.name} 👋
          </h1>
          <p className="text-zinc-400">
            Aquí está el resumen de tu búsqueda de empleo
          </p>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-6 mb-12">
          {stats.map((stat) => (
            <div key={stat.label} className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
              <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center mb-4`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <p className="text-zinc-400 text-sm mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-6">Acciones rápidas</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {actions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-orange-500/50 transition-all hover:scale-[1.02] group"
              >
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4 group-hover:bg-orange-500/20 transition-colors">
                  <action.icon className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{action.title}</h3>
                <p className="text-zinc-400 text-sm mb-4">{action.description}</p>
                <div className="flex items-center gap-2 text-orange-500 text-sm font-medium">
                  Acceder
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
          <h2 className="text-lg font-semibold text-white mb-4">Actividad reciente</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-orange-500 mt-2" />
              <div className="flex-1">
                <p className="text-white text-sm">Se encontraron 3 nuevos trabajos para "Senior Frontend Developer"</p>
                <p className="text-zinc-500 text-xs mt-1">Hace 2 horas</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-zinc-700 mt-2" />
              <div className="flex-1">
                <p className="text-white text-sm">Email enviado con 5 ofertas relevantes</p>
                <p className="text-zinc-500 text-xs mt-1">Hoy, 8:00 AM</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-zinc-700 mt-2" />
              <div className="flex-1">
                <p className="text-white text-sm">Agregaste "Google" a tus empresas monitoreadas</p>
                <p className="text-zinc-500 text-xs mt-1">Ayer</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
