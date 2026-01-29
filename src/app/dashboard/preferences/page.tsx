"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles, ArrowLeft, Check, Save, Loader2, Settings, Zap, Bell, Trash2,
  Key, Eye, EyeOff, Info, User, Lock, Download, AlertTriangle, Briefcase,
  MapPin, GraduationCap, Globe, Clock, Mail
} from "lucide-react";
import { toast } from "sonner";
import { preferencesApi, userApi, scheduleApi, searchFrequencyApi } from "@/lib/api";
import { Footer } from "@/components";

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

const searchFrequencies = [
  { value: "hourly", label: "Every Hour", desc: "Check for new jobs every hour" },
  { value: "3hours", label: "Every 3 Hours", desc: "Check for new jobs 8 times per day" },
  { value: "6hours", label: "Every 6 Hours", desc: "Check for new jobs 4 times per day" },
  { value: "12hours", label: "Every 12 Hours", desc: "Check for new jobs morning and evening" },
  { value: "daily", label: "Once Daily", desc: "Check for new jobs once per day" },
  { value: "weekly", label: "Once Weekly", desc: "Check for new jobs once per week" },
];

const emailFrequencies = [
  { value: "instant", label: "Instant", desc: "As soon as a job is found" },
  { value: "daily", label: "Daily", desc: "Daily summary of all new jobs" },
  { value: "weekly", label: "Weekly", desc: "Weekly summary every Monday" },
];

const experienceLevels = [
  { value: "entry", label: "Entry Level", desc: "0-2 years of experience" },
  { value: "mid", label: "Mid Level", desc: "2-5 years of experience" },
  { value: "senior", label: "Senior Level", desc: "5-10 years of experience" },
  { value: "lead", label: "Lead/Principal", desc: "10+ years of experience" },
];

const AI_PROVIDERS = [
  {
    id: "openai",
    name: "OpenAI (ChatGPT)",
    description: "GPT-4 for intelligent job matching",
    icon: "🤖",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
    keyPrefix: "sk-",
    learnMore: "https://platform.openai.com/api-keys",
  },
  {
    id: "claude",
    name: "Anthropic Claude",
    description: "Advanced AI for job recommendations",
    icon: "🧠",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
    keyPrefix: "sk-ant-",
    learnMore: "https://console.anthropic.com/",
  },
  {
    id: "gemini",
    name: "Google Gemini",
    description: "Google's AI model for insights",
    icon: "✨",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    learnMore: "https://aistudio.google.com/app/apikey",
  },
  {
    id: "zai",
    name: "Z.AI",
    description: "Alternative AI provider",
    icon: "⚡",
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/30",
    keyPrefix: "zai-",
    learnMore: "https://z.ai",
  },
];

type TabId = "profile" | "job-preferences" | "ai-providers" | "search-email" | "account";

interface ApiKeyStatus {
  provider: string;
  hasKey: boolean;
  isActive: boolean;
}

export default function PreferencesPage() {
  const [activeTab, setActiveTab] = useState<TabId>("profile");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Profile state
  const [user, setUser] = useState<{ id: string; name: string; email: string } | null>(null);
  const [profileName, setProfileName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Job preferences state
  const [jobTitles, setJobTitles] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [experienceLevel, setExperienceLevel] = useState<string>("mid");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [newJobTitle, setNewJobTitle] = useState("");
  const [newLocation, setNewLocation] = useState("");

  // Search & Email state
  const [timezone, setTimezone] = useState("America/Bogota");
  const [selectedTimes, setSelectedTimes] = useState<string[]>(["08:00", "12:00", "18:00"]);
  const [emailFrequency, setEmailFrequency] = useState<"instant" | "daily" | "weekly">("daily");
  const [searchFrequency, setSearchFrequency] = useState("6hours");

  // API Keys state
  const [apiKeys, setApiKeys] = useState<Record<string, ApiKeyStatus>>({});
  const [apiKeyInputs, setApiKeyInputs] = useState<Record<string, string>>({});
  const [showApiKeys, setShowApiKeys] = useState<Record<string, boolean>>({});
  const [isSavingKey, setIsSavingKey] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load user profile
      const userData = await userApi.getProfile();
      setUser(userData.user);
      setProfileName(userData.user.name);

      // Load job preferences
      const prefsData = await preferencesApi.get();
      if (prefsData.preferences && prefsData.preferences.length > 0) {
        const prefs = prefsData.preferences[0];
        setJobTitles(prefs.job_titles || []);
        setLocations(prefs.locations || []);
        setExperienceLevel(prefs.experience_level || "mid");
        setRemoteOnly(prefs.remote_only || false);
      }

      // Load API keys status
      await loadApiKeysStatus();

      // Load email schedule
      try {
        const scheduleData = await scheduleApi.getSchedule();
        if (scheduleData.schedule) {
          setTimezone(scheduleData.schedule.timezone || 'America/Bogota');
          setEmailFrequency(scheduleData.schedule.frequency || 'daily');
          // Convert preferred_times from "HH:MM" format to hours
          const times = scheduleData.schedule.preferred_times || ['09:00', '18:00'];
          setPreferredTimes(times.map((t: string) => parseInt(t.split(':')[0])));
        }
      } catch (e) {
        console.log("No email schedule found, using defaults");
      }

      // Load search frequency
      try {
        const freqData = await searchFrequencyApi.getFrequency();
        if (freqData.searchFrequency) {
          setSearchFrequency(freqData.searchFrequency);
        }
      } catch (e) {
        console.log("No search frequency found, using defaults");
      }
    } catch (error) {
      console.log("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadApiKeysStatus = async () => {
    try {
      const API_BRIDGE_URL = process.env.NEXT_PUBLIC_API_BRIDGE_URL || 'https://carmen.neuralflow.space';
      const token = localStorage.getItem('accessToken');

      const response = await fetch(`${API_BRIDGE_URL}/api/api-keys/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        const statusMap: Record<string, ApiKeyStatus> = {};

        AI_PROVIDERS.forEach(p => {
          statusMap[p.id] = { provider: p.id, hasKey: false, isActive: false };
        });

        data.apiKeys?.forEach((key: any) => {
          statusMap[key.provider] = {
            provider: key.provider,
            hasKey: true,
            isActive: key.isActive
          };
        });

        setApiKeys(statusMap);
      }
    } catch (error) {
      console.error("Error loading API keys status");
    }
  };

  // Save email schedule when it changes
  useEffect(() => {
    if (!isLoading) {
      saveEmailSchedule();
    }
  }, [emailFrequency, timezone, preferredTimes]);

  // Save search frequency when it changes
  useEffect(() => {
    if (!isLoading) {
      saveSearchFrequency();
    }
  }, [searchFrequency]);

  const saveEmailSchedule = async () => {
    try {
      // Convert preferred times (hours) back to "HH:MM" format
      const preferredTimesFormatted = preferredTimes
        .sort((a, b) => a - b)
        .map(h => `${h.toString().padStart(2, '0')}:00`);

      await scheduleApi.upsertSchedule({
        timezone,
        preferredTimes: preferredTimesFormatted,
        frequency: emailFrequency
      });
    } catch (error) {
      console.error("Error saving email schedule:", error);
    }
  };

  const saveSearchFrequency = async () => {
    try {
      await searchFrequencyApi.updateFrequency(searchFrequency);
    } catch (error) {
      console.error("Error saving search frequency:", error);
    }
  };

  const handleSaveProfile = async () => {
    if (!profileName.trim()) {
      toast.error("Name is required");
      return;
    }

    setIsSaving(true);
    try {
      const API_BRIDGE_URL = process.env.NEXT_PUBLIC_API_BRIDGE_URL || 'https://carmen.neuralflow.space';
      const token = localStorage.getItem('accessToken');

      const response = await fetch(`${API_BRIDGE_URL}/api/users/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({ name: profileName })
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      setUser(prev => prev ? { ...prev, name: profileName } : null);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Error updating profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePassword = async () => {
    if (!currentPassword || !newPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setIsSaving(true);
    try {
      const API_BRIDGE_URL = process.env.NEXT_PUBLIC_API_BRIDGE_URL || 'https://carmen.neuralflow.space';
      const token = localStorage.getItem('accessToken');

      const response = await fetch(`${API_BRIDGE_URL}/api/users/me/password`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update password');
      }

      setCurrentPassword("");
      setNewPassword("");
      toast.success("Password updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Error updating password");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddJobTitle = () => {
    if (!newJobTitle.trim()) return;
    if (jobTitles.includes(newJobTitle.trim())) {
      toast.error("Job title already exists");
      return;
    }
    setJobTitles([...jobTitles, newJobTitle.trim()]);
    setNewJobTitle("");
  };

  const handleRemoveJobTitle = (title: string) => {
    setJobTitles(jobTitles.filter(t => t !== title));
  };

  const handleAddLocation = () => {
    if (!newLocation.trim()) return;
    if (locations.includes(newLocation.trim())) {
      toast.error("Location already exists");
      return;
    }
    setLocations([...locations, newLocation.trim()]);
    setNewLocation("");
  };

  const handleRemoveLocation = (location: string) => {
    setLocations(locations.filter(l => l !== location));
  };

  const handleSaveJobPreferences = async () => {
    if (jobTitles.length === 0) {
      toast.error("Please add at least one job title");
      return;
    }

    setIsSaving(true);
    try {
      await preferencesApi.create({
        jobTitles,
        locations,
        experienceLevel,
        remoteOnly
      });

      toast.success("Job preferences saved successfully");
    } catch (error) {
      toast.error("Error saving job preferences");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveApiKey = async (providerId: string) => {
    const provider = AI_PROVIDERS.find(p => p.id === providerId);
    if (!provider) return;

    const apiKey = apiKeyInputs[providerId];
    if (!apiKey) {
      toast.error("API key is required", {
        description: `Please enter your ${provider.name} API key`
      });
      return;
    }

    if (provider.keyPrefix && !apiKey.startsWith(provider.keyPrefix)) {
      toast.error("Invalid API key format", {
        description: `${provider.name} API keys should start with "${provider.keyPrefix}"`
      });
      return;
    }

    setIsSavingKey(prev => ({ ...prev, [providerId]: true }));

    try {
      const API_BRIDGE_URL = process.env.NEXT_PUBLIC_API_BRIDGE_URL || 'https://carmen.neuralflow.space';
      const token = localStorage.getItem('accessToken');

      const response = await fetch(`${API_BRIDGE_URL}/api/api-keys/me/${providerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({ apiKey })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save API key');
      }

      setApiKeys(prev => ({
        ...prev,
        [providerId]: { provider: providerId, hasKey: true, isActive: true }
      }));

      setApiKeyInputs(prev => ({ ...prev, [providerId]: '' }));
      setShowApiKeys(prev => ({ ...prev, [providerId]: false }));

      toast.success(`${provider.name} API key saved`);
    } catch (error: any) {
      toast.error(error.message || "Error saving API key");
    } finally {
      setIsSavingKey(prev => ({ ...prev, [providerId]: false }));
    }
  };

  const handleRemoveApiKey = async (providerId: string) => {
    const provider = AI_PROVIDERS.find(p => p.id === providerId);
    if (!provider) return;

    setIsSavingKey(prev => ({ ...prev, [providerId]: true }));

    try {
      const API_BRIDGE_URL = process.env.NEXT_PUBLIC_API_BRIDGE_URL || 'https://carmen.neuralflow.space';
      const token = localStorage.getItem('accessToken');

      const response = await fetch(`${API_BRIDGE_URL}/api/api-keys/me/${providerId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to remove API key');
      }

      setApiKeys(prev => ({
        ...prev,
        [providerId]: { provider: providerId, hasKey: false, isActive: false }
      }));

      toast.success(`${provider.name} API key removed`);
    } catch (error) {
      toast.error("Error removing API key");
    } finally {
      setIsSavingKey(prev => ({ ...prev, [providerId]: false }));
    }
  };

  const handleToggleApiKey = async (providerId: string) => {
    const currentStatus = apiKeys[providerId];
    if (!currentStatus?.hasKey) return;

    const provider = AI_PROVIDERS.find(p => p.id === providerId);
    if (!provider) return;

    setIsSavingKey(prev => ({ ...prev, [providerId]: true }));

    try {
      const API_BRIDGE_URL = process.env.NEXT_PUBLIC_API_BRIDGE_URL || 'https://carmen.neuralflow.space';
      const token = localStorage.getItem('accessToken');

      const response = await fetch(`${API_BRIDGE_URL}/api/api-keys/me/${providerId}/toggle`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({ isActive: !currentStatus.isActive })
      });

      if (!response.ok) {
        throw new Error('Failed to toggle API key');
      }

      setApiKeys(prev => ({
        ...prev,
        [providerId]: { ...currentStatus, isActive: !currentStatus.isActive }
      }));

      toast.success(`${provider.name} ${!currentStatus.isActive ? 'enabled' : 'disabled'}`);
    } catch (error) {
      toast.error("Error toggling API key");
    } finally {
      setIsSavingKey(prev => ({ ...prev, [providerId]: false }));
    }
  };

  const toggleTime = (time: string) => {
    if (selectedTimes.includes(time)) {
      setSelectedTimes(selectedTimes.filter(t => t !== time));
    } else {
      setSelectedTimes([...selectedTimes, time].sort());
    }
  };

  const handleSaveSearchEmail = async () => {
    setIsSaving(true);
    try {
      const API_BRIDGE_URL = process.env.NEXT_PUBLIC_API_BRIDGE_URL || 'https://carmen.neuralflow.space';
      const token = localStorage.getItem('accessToken');

      await fetch(`${API_BRIDGE_URL}/api/schedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({
          timezone,
          preferredTimes: selectedTimes,
          frequency: emailFrequency,
          searchFrequency
        })
      });

      toast.success("Search & email settings saved successfully");
    } catch (error) {
      toast.error("Error saving settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportData = async () => {
    try {
      const [stats, jobs, companies] = await Promise.all([
        userApi.getStats(),
        fetch('/api/jobs').then(r => r.json()),
        companyApi.getAll(),
      ]);

      const data = {
        profile: user,
        stats,
        jobs,
        companies,
        exportedAt: new Date().toISOString()
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `carmen-data-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success("Data exported successfully");
    } catch (error) {
      toast.error("Error exporting data");
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }

    if (!confirm("This will permanently delete all your data including jobs, companies, and preferences. Continue?")) {
      return;
    }

    setIsSaving(true);
    try {
      const API_BRIDGE_URL = process.env.NEXT_PUBLIC_API_BRIDGE_URL || 'https://carmen.neuralflow.space';
      const token = localStorage.getItem('accessToken');

      const response = await fetch(`${API_BRIDGE_URL}/api/users/me`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to delete account');
      }

      localStorage.clear();
      window.location.href = '/';
    } catch (error) {
      toast.error("Error deleting account");
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: "profile" as TabId, label: "Profile", icon: User },
    { id: "job-preferences" as TabId, label: "Job Preferences", icon: Briefcase },
    { id: "ai-providers" as TabId, label: "AI Providers", icon: Settings },
    { id: "search-email" as TabId, label: "Search & Email", icon: Bell },
    { id: "account" as TabId, label: "Account", icon: Lock },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

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
              <Sparkles className="w-8 h-8 text-orange-500" />
              <h1 className="text-xl font-bold text-white">Carmen Job Search</h1>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-lg">
              {user?.name?.split(' ').map(n => n.charAt(0).toUpperCase()).join('').slice(0, 2) || "U"}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-zinc-400">
            Manage your profile, job preferences, and account settings
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8 border-b border-zinc-800">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-orange-500 text-orange-500"
                      : "border-transparent text-zinc-400 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6 lg:p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="space-y-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-violet-500" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Profile Information</h2>
                  <p className="text-sm text-zinc-400">Update your personal details</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Name</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:border-orange-500 transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Email</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-4 py-3 rounded-xl bg-zinc-800/50 border border-zinc-700 text-zinc-500 cursor-not-allowed"
                  />
                  <p className="mt-1 text-xs text-zinc-500">Email cannot be changed</p>
                </div>
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="px-6 py-3 rounded-xl bg-orange-500 text-white font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  {isSaving ? "Saving..." : "Save Profile"}
                </button>
              </div>

              <div className="border-t border-zinc-800 pt-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">Change Password</h2>
                    <p className="text-sm text-zinc-400">Update your password</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Current Password</label>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:border-orange-500 transition-colors"
                    />
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium text-zinc-300 mb-2">New Password</label>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:border-orange-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-10 text-zinc-500 hover:text-zinc-300"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <button
                    onClick={handleSavePassword}
                    disabled={isSaving}
                    className="px-6 py-3 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    {isSaving ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Job Preferences Tab */}
          {activeTab === "job-preferences" && (
            <div className="space-y-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Job Preferences</h2>
                  <p className="text-sm text-zinc-400">Tell us what kind of jobs you're looking for</p>
                </div>
              </div>

              {/* Job Titles */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-3">Job Titles</label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newJobTitle}
                    onChange={(e) => setNewJobTitle(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddJobTitle()}
                    className="flex-1 px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors"
                    placeholder="e.g., Senior Software Engineer"
                  />
                  <button
                    onClick={handleAddJobTitle}
                    className="px-4 py-3 rounded-xl bg-orange-500 text-white hover:bg-orange-600 transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {jobTitles.map((title) => (
                    <span
                      key={title}
                      className="px-3 py-2 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-400 flex items-center gap-2"
                    >
                      {title}
                      <button
                        onClick={() => handleRemoveJobTitle(title)}
                        className="hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Locations */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-3">Locations</label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddLocation()}
                    className="flex-1 px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors"
                    placeholder="e.g., Remote, Bogotá, Madrid"
                  />
                  <button
                    onClick={handleAddLocation}
                    className="px-4 py-3 rounded-xl bg-green-500 text-white hover:bg-green-600 transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {locations.map((location) => (
                    <span
                      key={location}
                      className="px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 flex items-center gap-2"
                    >
                      <MapPin className="w-3 h-3" />
                      {location}
                      <button
                        onClick={() => handleRemoveLocation(location)}
                        className="hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-3">Experience Level</label>
                <div className="grid sm:grid-cols-2 gap-3">
                  {experienceLevels.map((level) => (
                    <button
                      key={level.value}
                      onClick={() => setExperienceLevel(level.value)}
                      className={`p-4 rounded-xl text-left transition-all border ${
                        experienceLevel === level.value
                          ? "bg-orange-500/20 border-orange-500"
                          : "bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          experienceLevel === level.value ? "border-orange-500" : "border-zinc-500"
                        }`}>
                          {experienceLevel === level.value && (
                            <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                          )}
                        </div>
                        <div>
                          <p className={`font-medium ${experienceLevel === level.value ? "text-white" : "text-zinc-300"}`}>
                            {level.label}
                          </p>
                          <p className={`text-sm ${experienceLevel === level.value ? "text-orange-200" : "text-zinc-500"}`}>
                            {level.desc}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Remote Only Toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-800/50 border border-zinc-700">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-zinc-400" />
                  <div>
                    <p className="font-medium text-white">Remote Only</p>
                    <p className="text-sm text-zinc-500">Show only remote job opportunities</p>
                  </div>
                </div>
                <button
                  onClick={() => setRemoteOnly(!remoteOnly)}
                  className={`w-14 h-8 rounded-full transition-colors ${
                    remoteOnly ? 'bg-orange-500' : 'bg-zinc-700'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full bg-white transition-transform ${
                    remoteOnly ? 'translate-x-7' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <button
                onClick={handleSaveJobPreferences}
                disabled={isSaving}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-violet-600 text-white font-semibold hover:from-orange-600 hover:to-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isSaving ? <Loader2 className="w-5 h-5 animate-spin inline mx-auto" /> : <Save className="w-5 h-5 inline mr-2" />}
                {isSaving ? "Saving..." : "Save Job Preferences"}
              </button>
            </div>
          )}

          {/* AI Providers Tab */}
          {activeTab === "ai-providers" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                  <Settings className="w-5 h-5 text-violet-500" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">AI Providers</h2>
                  <p className="text-sm text-zinc-400">Configure API keys for AI-powered job matching</p>
                </div>
              </div>

              {AI_PROVIDERS.map((provider) => {
                const keyStatus = apiKeys[provider.id] || { hasKey: false, isActive: false };

                return (
                  <div key={provider.id} className={`p-4 rounded-xl border ${provider.borderColor} ${provider.bgColor}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{provider.icon}</span>
                        <div>
                          <h3 className={`font-semibold ${provider.color}`}>{provider.name}</h3>
                          <p className="text-xs text-zinc-400">{provider.description}</p>
                        </div>
                      </div>
                      {keyStatus.hasKey && (
                        <button
                          onClick={() => handleToggleApiKey(provider.id)}
                          disabled={isSavingKey[provider.id]}
                          className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                            keyStatus.isActive
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-zinc-700 text-zinc-400'
                          }`}
                        >
                          {keyStatus.isActive ? 'Active' : 'Inactive'}
                        </button>
                      )}
                    </div>

                    {keyStatus.hasKey ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-green-400">
                          <Check className="w-4 h-4" />
                          <span>API key configured and encrypted</span>
                        </div>
                        <button
                          onClick={() => handleRemoveApiKey(provider.id)}
                          disabled={isSavingKey[provider.id]}
                          className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 disabled:opacity-50"
                        >
                          <Trash2 className="w-3 h-3" />
                          Remove key
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="relative">
                          <input
                            type={showApiKeys[provider.id] ? "text" : "password"}
                            value={apiKeyInputs[provider.id] || ''}
                            onChange={(e) => setApiKeyInputs(prev => ({ ...prev, [provider.id]: e.target.value }))}
                            placeholder={`${provider.keyPrefix || ''}...`}
                            className="w-full px-4 py-2 pr-10 rounded-lg bg-zinc-800/50 border border-zinc-700 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-orange-500 transition-colors"
                          />
                          <button
                            type="button"
                            onClick={() => setShowApiKeys(prev => ({ ...prev, [provider.id]: !prev[provider.id] }))}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                          >
                            {showApiKeys[provider.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleSaveApiKey(provider.id)}
                            disabled={isSavingKey[provider.id] || !apiKeyInputs[provider.id]}
                            className="flex-1 px-4 py-2 rounded-lg bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            {isSavingKey[provider.id] ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {isSavingKey[provider.id] ? "Saving..." : "Save Key"}
                          </button>
                          <a
                            href={provider.learnMore}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2 rounded-lg bg-zinc-800 text-zinc-400 text-xs hover:text-white transition-colors flex items-center gap-1"
                          >
                            <Info className="w-3 h-3" />
                            Get Key
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <p className="text-sm text-blue-400 flex items-start gap-2">
                  <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Why configure multiple providers?</strong> Each AI provider offers unique capabilities.
                    Configure one or more to improve job matching accuracy. Your keys are encrypted with AES-256-GCM.
                  </span>
                </p>
              </div>
            </div>
          )}

          {/* Search & Email Tab */}
          {activeTab === "search-email" && (
            <div className="space-y-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Search Frequency</h2>
                  <p className="text-sm text-zinc-400">How often should we check for new jobs?</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                {searchFrequencies.map((freq) => (
                  <button
                    key={freq.value}
                    onClick={() => setSearchFrequency(freq.value)}
                    className={`p-4 rounded-xl text-left transition-all border ${
                      searchFrequency === freq.value
                        ? "bg-orange-500/20 border-orange-500"
                        : "bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        searchFrequency === freq.value ? "border-orange-500" : "border-zinc-500"
                      }`}>
                        {searchFrequency === freq.value && (
                          <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                        )}
                      </div>
                      <div>
                        <p className={`font-medium ${searchFrequency === freq.value ? "text-white" : "text-zinc-300"}`}>
                          {freq.label}
                        </p>
                        <p className={`text-sm ${searchFrequency === freq.value ? "text-orange-200" : "text-zinc-500"}`}>
                          {freq.desc}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="border-t border-zinc-800 pt-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">Email Notifications</h2>
                    <p className="text-sm text-zinc-400">Configure when you receive job alerts</p>
                  </div>
                </div>

                {/* Email Frequency */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-zinc-300 mb-3">Email Frequency</label>
                  <div className="space-y-3">
                    {emailFrequencies.map((freq) => (
                      <button
                        key={freq.value}
                        onClick={() => setEmailFrequency(freq.value as any)}
                        className={`w-full p-4 rounded-xl text-left transition-all border ${
                          emailFrequency === freq.value
                            ? "bg-orange-500 border-orange-500"
                            : "bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            emailFrequency === freq.value ? "border-white" : "border-zinc-500"
                          }`}>
                            {emailFrequency === freq.value && (
                              <div className="w-2.5 h-2.5 rounded-full bg-white" />
                            )}
                          </div>
                          <div>
                            <p className={`font-medium ${emailFrequency === freq.value ? "text-white" : "text-zinc-300"}`}>
                              {freq.label}
                            </p>
                            <p className={`text-sm ${emailFrequency === freq.value ? "text-orange-100" : "text-zinc-500"}`}>
                              {freq.desc}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Timezone */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-zinc-300 mb-3">Timezone</label>
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
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-3">Preferred Times</label>
                  <p className="text-zinc-400 text-sm mb-4">
                    Select the hours when you want to receive emails with new offers
                  </p>

                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 mb-4">
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
                    <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                      <p className="text-sm text-orange-400">
                        You will receive emails at: {selectedTimes.join(", ")} {timezoneLabel(timezone)}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={handleSaveSearchEmail}
                disabled={isSaving}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-violet-600 text-white font-semibold hover:from-orange-600 hover:to-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isSaving ? <Loader2 className="w-5 h-5 animate-spin inline mx-auto" /> : <Save className="w-5 h-5 inline mr-2" />}
                {isSaving ? "Saving..." : "Save Settings"}
              </button>
            </div>
          )}

          {/* Account Tab */}
          {activeTab === "account" && (
            <div className="space-y-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Account Settings</h2>
                  <p className="text-sm text-zinc-400">Manage your account data</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700">
                <h3 className="font-medium text-white mb-2">Export Your Data</h3>
                <p className="text-sm text-zinc-400 mb-4">
                  Download all your data including jobs, companies, and preferences
                </p>
                <button
                  onClick={handleExportData}
                  className="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export Data
                </button>
              </div>

              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <h3 className="font-medium text-red-400">Delete Account</h3>
                </div>
                <p className="text-sm text-zinc-400 mb-4">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <button
                  onClick={handleDeleteAccount}
                  disabled={isSaving}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  {isSaving ? "Deleting..." : "Delete Account"}
                </button>
              </div>

              <div className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700">
                <h3 className="font-medium text-white mb-2">Account Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Account ID</span>
                    <span className="text-zinc-300 font-mono">{user?.id?.slice(0, 8)}...</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Member Since</span>
                    <span className="text-zinc-300">{
                      user && new Date(user.createdAt || Date.now()).toLocaleDateString()
                    }</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
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
