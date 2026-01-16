"use client";

import Link from "next/link";
import { Briefcase, Building2, Mail, Settings, Search, ArrowRight, TrendingUp, Clock, Bell, Sparkles } from "lucide-react";

export default function DashboardPage() {
  // TODO: Get user data from session
  const user = {
    name: "María García",
    email: "maria@example.com",
    companiesCount: 3,
    jobsFound: 12,
    jobsThisWeek: 5,
    lastEmailSent: "Hoy, 8:00 AM"
  };

  const stats = [
    {
      label: "Companies Monitored",
      value: user.companiesCount,
      icon: Building2,
      color: "bg-orange-500/10 text-orange-500",
      trend: "+1 this week"
    },
    {
      label: "Jobs Found",
      value: user.jobsFound,
      icon: Briefcase,
      color: "bg-blue-500/10 text-blue-500",
      trend: `+${user.jobsThisWeek} this week`
    },
    {
      label: "Last Email",
      value: user.lastEmailSent,
      icon: Mail,
      color: "bg-green-500/10 text-green-500",
      trend: "Check inbox"
    }
  ];

  const actions = [
    {
      title: "Manage Companies",
      description: "Add or remove companies you want to monitor",
      href: "/dashboard/companies",
      icon: Building2,
      color: "text-orange-500",
      bgColor: "bg-orange-500"
    },
    {
      title: "Configure Schedule",
      description: "Define when you want to receive email notifications",
      href: "/dashboard/preferences",
      icon: Settings,
      color: "text-blue-500",
      bgColor: "bg-blue-500"
    },
    {
      title: "View Jobs",
      description: "Explore opportunities found for you",
      href: "/dashboard/jobs",
      icon: Search,
      color: "text-green-500",
      bgColor: "bg-green-500"
    }
  ];

  const recentActivity = [
    {
      id: 1,
      title: "Found 3 new jobs for \"Senior Frontend Developer\"",
      time: "2 hours ago",
      isNew: true
    },
    {
      id: 2,
      title: "Email sent with 5 relevant offers",
      time: "Today, 8:00 AM",
      isNew: false
    },
    {
      id: 3,
      title: "You added \"Google\" to your monitored companies",
      time: "Yesterday",
      isNew: false
    },
    {
      id: 4,
      title: "Updated job preferences",
      time: "2 days ago",
      isNew: false
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
              <Link href="/dashboard/companies" className="text-zinc-400 hover:text-white transition-colors">Companies</Link>
              <Link href="/dashboard/jobs" className="text-zinc-400 hover:text-white transition-colors">Jobs</Link>
              <Link href="/dashboard/preferences" className="text-zinc-400 hover:text-white transition-colors">Settings</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:block text-zinc-400 text-sm">{user.name}</span>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-semibold shadow-lg shadow-orange-500/20">
              {user.name.charAt(0)}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 lg:py-12">
        {/* Welcome */}
        <div className="mb-8 lg:mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
            Welcome, {user.name} 👋
          </h1>
          <p className="text-zinc-400 text-lg">
            Here's your job search summary
          </p>
        </div>

        {/* Layout de 2 columnas en desktop */}
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Columna izquierda (2/3) */}
          <div className="lg:col-span-2 space-y-6 lg:space-y-8">
            {/* Stats */}
            <div className="grid sm:grid-cols-3 gap-4 lg:gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="p-5 lg:p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-orange-500/30 transition-all group">
                  <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <p className="text-zinc-400 text-sm mb-1">{stat.label}</p>
                  <p className="text-2xl lg:text-3xl font-bold text-white mb-1">{stat.value}</p>
                  <p className="text-xs text-zinc-500">{stat.trend}</p>
                </div>
              ))}
            </div>

            {/* Recent Activity - Ahora más grande */}
            <div className="p-6 lg:p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg lg:text-xl font-semibold text-white">Recent Activity</h2>
                <Bell className="w-5 h-5 text-zinc-500" />
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 p-4 rounded-xl bg-zinc-900/30 hover:bg-zinc-900/50 transition-colors">
                    <div className={`w-2 h-2 rounded-full ${activity.isNew ? 'bg-orange-500' : 'bg-zinc-700'} mt-2 flex-shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium mb-1">{activity.title}</p>
                      <p className="text-zinc-500 text-xs flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {activity.time}
                      </p>
                    </div>
                    {activity.isNew && (
                      <span className="px-2 py-1 text-xs font-medium bg-orange-500/10 text-orange-500 rounded-full">
                        New
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid sm:grid-cols-2 gap-4 lg:gap-6">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">+45%</p>
                    <p className="text-sm text-zinc-400">Response rate</p>
                  </div>
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">2.5h</p>
                    <p className="text-sm text-zinc-400">Time saved daily</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha (1/3) - Sidebar */}
          <div className="lg:col-span-1 space-y-6 lg:space-y-8">
            {/* Quick Actions */}
            <div>
              <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
              <div className="space-y-3">
                {actions.map((action) => (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="block p-4 lg:p-5 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-orange-500/50 transition-all hover:scale-[1.02] group"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-lg ${action.bgColor}/10 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0`}>
                        <action.icon className={`w-5 h-5 ${action.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-white mb-1">{action.title}</h3>
                        <p className="text-zinc-400 text-xs leading-relaxed line-clamp-2">{action.description}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Pro Tip Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-orange-500" />
                <h3 className="text-sm font-semibold text-white">Pro Tip</h3>
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed mb-4">
                Add at least 5 companies to get better job matches. The more companies you monitor, the more opportunities you'll discover.
              </p>
              <Link
                href="/dashboard/companies"
                className="inline-flex items-center gap-2 text-sm text-orange-500 font-medium hover:text-orange-400 transition-colors"
              >
                Add companies
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Upgrade Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
              <Bell className="w-8 h-8 text-purple-500 mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Stay Updated</h3>
              <p className="text-sm text-zinc-300 mb-4">
                Enable instant notifications to never miss a job opportunity.
              </p>
              <Link
                href="/dashboard/preferences"
                className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-purple-500 text-white text-sm font-medium hover:bg-purple-600 transition-colors"
              >
                Configure Alerts
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
