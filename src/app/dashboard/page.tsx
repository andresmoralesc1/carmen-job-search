"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Briefcase, Building2, Mail, Settings, Search, ArrowRight, TrendingUp, Clock, Bell, Sparkles,
  LogOut, RefreshCw, Loader2, Check
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { userApi, companyApi } from "@/lib/api";

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
  } | null>(null);

  const [stats, setStats] = useState<{
    companiesCount: number;
    jobsFound: number;
    jobsThisWeek: number;
    lastEmailSent: string;
  }>({
    companiesCount: 0,
    jobsFound: 0,
    jobsThisWeek: 0,
    lastEmailSent: "No emails sent yet"
  });

  const [statsCards, setStatsCards] = useState<Array<{
    label: string;
    value: string | number;
    icon: any;
    color: string;
    trend: string;
  }>>([]);

  const [recentActivity, setRecentActivity] = useState<Array<{
    id: string;
    title: string;
    companyName?: string;
    url?: string;
    time: string;
    isNew: boolean
  }>>([]);

  const quickActions = [
    {
      title: "Manage Companies",
      description: "Add or remove companies you want to monitor",
      href: "/dashboard/companies",
      icon: Building2,
      color: "text-orange-500",
      bgColor: "bg-orange-500"
    },
    {
      title: "Job Preferences",
      description: "Define your job preferences",
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

  // Fetch user data
  const fetchUserData = async () => {
    try {
      setIsLoading(true);

      // Fetch user profile
      const userData = await userApi.getProfile();
      setUser(userData.user);

      // Fetch stats
      const statsData = await userApi.getStats();

      // Map stats to cards
      const statsCardsMapped = statsData.stats.map((stat: any) => ({
        label: stat.label,
        value: stat.value,
        icon: stat.icon,
        color: stat.color,
        trend: stat.trend
      }));

      setStatsCards(statsCardsMapped);
    } catch (error: any) {
      console.error('Error fetching user data:', error);

      // Handle 401 Unauthorized
      if ((error as Error).message?.includes('Unauthorized')) {
        if (typeof window !== 'undefined') {
          router.push('/login');
        }
        return;
      }

      toast.error("Error loading dashboard", {
        description: "Could not load your data"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch recent activity
  const fetchActivity = async () => {
    try {
      const activityData = await userApi.getActivity();
      setRecentActivity(activityData.activity);
    } catch (error) {
      console.error('Error fetching activity:', error);
    }
  };

  // Refresh user data
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchUserData();
      toast.success("Dashboard refreshed", {
        description: "Latest data has been loaded"
      });
    } catch (error) {
      console.error('Error refreshing dashboard:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    router.push('/login');
  };

  useEffect(() => {
    fetchUserData();
    fetchActivity();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black">
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-orange-500" />
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
            {user && <span className="hidden sm:block text-zinc-400 text-sm">{user.name}</span>}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-semibold shadow-lg shadow-orange-500/20">
              {user ? user.name.charAt(0).toUpperCase() : "M"}
            </div>
            {user && (
              <button
                onClick={handleLogout}
                disabled={isRefreshing}
                className="hidden sm:flex p-2 text-zinc-400 hover:text-red-400 transition-colors"
                title="Sign out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            )}
            {!user && (
              <Link
                href="/login"
                className="px-4 py-2 rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors text-sm font-medium"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 lg:py-12">
        {/* Welcome */}
        <div className="mb-8 lg:mb-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                Welcome, {user?.name || "Cargando"} {user?.name ? "👋" : ""} 👋
              </h1>
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              >
                <RefreshCw className="w-4 h-4" />
                {isRefreshing ? "Refreshing..." : "Refresh"}
              </button>
            </div>
            <p className="text-zinc-400 text-lg">
              Here's your job search summary
            </p>
          </div>
        </div>

        {/* Layout de 2 columnas en desktop */}
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Columna izquierda (2/3) */}
          <div className="lg:col-span-2 space-y-6 lg:space-y-8">
            {/* Stats */}
            <div className="grid sm:grid-cols-3 gap-4 lg:gap-6">
              {statsCards.map((stat, index) => (
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
                {recentActivity.length > 0 && (
                  <span className="text-zinc-500 text-sm flex items-center gap-1">
                    {recentActivity.filter(a => a.isNew).length > 0 ? (
                      <>
                        <Bell className="w-5 h-5 text-orange-500" />
                        <span className="text-orange-500">
                          {recentActivity.filter(a => a.isNew).length} new
                        </span>
                      </>
                    ) : null}
                  </span>
                )}
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 p-4 rounded-xl bg-zinc-900/30 hover:bg-zinc-900/50 transition-colors">
                    <div className={`w-2 h-2 rounded-full ${activity.isNew ? 'bg-orange-500' : 'bg-zinc-700'} mt-2 flex-shrink-0`}></div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium mb-1">{activity.title}</p>
                      <p className="text-zinc-500 text-xs flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {activity.time}
                      </p>
                      {activity.companyName && (
                        <span className="text-zinc-500 text-xs ml-2">
                          en {activity.companyName}
                        </span>
                      )}
                      {activity.isNew && (
                        <span className="px-2 py-1 text-xs font-medium bg-orange-500/10 text-orange-500 rounded-full">
                          New
                        </span>
                      )}
                    </div>
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
                {quickActions.map((action, index) => (
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

            {/* API Key Status Card */}
            {user && (
              <div className="p-6 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-600/10 border border-green-500/20">
                <div className="flex items-center gap-2 mb-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <h3 className="text-sm font-semibold text-white">Account Ready</h3>
                </div>
                <p className="text-sm text-zinc-300">
                  Your account está configurado y listo para usar.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
