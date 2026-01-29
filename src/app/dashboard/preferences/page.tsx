"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles, ArrowLeft, Clock, Check, Key, Eye, EyeOff, Save, Loader2,
  Settings, Zap, Globe, Bell, Trash2, Plus, ExternalLink, Info
} from "lucide-react";
import { toast } from "sonner";
import { preferencesApi } from "@/lib/api";
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

// Search frequency options
const searchFrequencies = [
  { value: "hourly", label: "Every Hour", desc: "Check for new jobs every hour" },
  { value: "3hours", label: "Every 3 Hours", desc: "Check for new jobs 8 times per day" },
  { value: "6hours", label: "Every 6 Hours", desc: "Check for new jobs 4 times per day" },
  { value: "12hours", label: "Every 12 Hours", desc: "Check for new jobs morning and evening" },
  { value: "daily", label: "Once Daily", desc: "Check for new jobs once per day" },
  { value: "weekly", label: "Once Weekly", desc: "Check for new jobs once per week" },
];

// AI Provider configurations
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
    keyPrefix: "",
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

interface ApiKeyStatus {
  provider: string;
  hasKey: boolean;
  isActive: boolean;
}

export default function PreferencesPage() {
  const [timezone, setTimezone] = useState("America/Bogota");
  const [selectedTimes, setSelectedTimes] = useState<string[]>(["08:00", "12:00", "18:00"]);
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "instant">("daily");
  const [searchFrequency, setSearchFrequency] = useState("6hours");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // User preferences state
  const [jobTitles, setJobTitles] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [experienceLevel, setExperienceLevel] = useState<string>("mid");
  const [remoteOnly, setRemoteOnly] = useState(false);

  // API Keys state
  const [apiKeys, setApiKeys] = useState<Record<string, ApiKeyStatus>>({});
  const [apiKeyInputs, setApiKeyInputs] = useState<Record<string, string>>({});
  const [showApiKeys, setShowApiKeys] = useState<Record<string, boolean>>({});
  const [isSavingKey, setIsSavingKey] = useState<Record<string, boolean>>({});

  // Load existing preferences on mount
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const data = await preferencesApi.get();
        if (data.preferences && data.preferences.length > 0) {
          const prefs = data.preferences[0];
          setJobTitles(prefs.job_titles || []);
          setLocations(prefs.locations || []);
          setExperienceLevel(prefs.experience_level || "mid");
          setRemoteOnly(prefs.remote_only || false);
        }
      } catch (error) {
        console.log("No existing preferences found");
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
    loadApiKeysStatus();
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      const API_BRIDGE_URL = process.env.NEXT_PUBLIC_API_BRIDGE_URL || 'https://carmen.neuralflow.space';
      const response = await fetch(`${API_BRIDGE_URL}/api/api-keys/providers`);
      if (response.ok) {
        // Providers loaded successfully - used for UI rendering
      }
    } catch (error) {
      console.error("Error loading providers");
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

        // Initialize all providers as not having keys
        AI_PROVIDERS.forEach(p => {
          statusMap[p.id] = { provider: p.id, hasKey: false, isActive: false };
        });

        // Update with actual keys
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

  const toggleTime = (time: string) => {
    if (selectedTimes.includes(time)) {
      setSelectedTimes(selectedTimes.filter(t => t !== time));
    } else {
      setSelectedTimes([...selectedTimes, time].sort());
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

      // Update local state
      setApiKeys(prev => ({
        ...prev,
        [providerId]: { provider: providerId, hasKey: true, isActive: true }
      }));

      // Clear input
      setApiKeyInputs(prev => ({ ...prev, [providerId]: '' }));
      setShowApiKeys(prev => ({ ...prev, [providerId]: false }));

      toast.success(`${provider.name} API key saved`, {
        description: "Your API key is now configured and encrypted"
      });
    } catch (error: any) {
      toast.error("Error saving API key", {
        description: error.message || "Could not save your API key"
      });
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

      // Update local state
      setApiKeys(prev => ({
        ...prev,
        [providerId]: { provider: providerId, hasKey: false, isActive: false }
      }));

      toast.success(`${provider.name} API key removed`, {
        description: "Your API key has been removed from our system"
      });
    } catch (error) {
      toast.error("Error removing API key", {
        description: "Could not remove your API key"
      });
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

      // Update local state
      setApiKeys(prev => ({
        ...prev,
        [providerId]: { ...currentStatus, isActive: !currentStatus.isActive }
      }));

      toast.success(`${provider.name} ${!currentStatus.isActive ? 'enabled' : 'disabled'}`, {
        description: `Your ${provider.name} API key is now ${!currentStatus.isActive ? 'active' : 'inactive'}`
      });
    } catch (error) {
      toast.error("Error toggling API key", {
        description: "Could not toggle your API key"
      });
    } finally {
      setIsSavingKey(prev => ({ ...prev, [providerId]: false }));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      // Save email schedule
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
          frequency,
          searchFrequency
        })
      });

      toast.success("Preferences saved successfully", {
        description: "Your settings have been updated"
      });
    } catch (error) {
      toast.error("Error saving preferences", {
        description: "Could not save your settings. Try again."
      });
    } finally {
      setIsSaving(false);
    }
  };

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
              U
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-zinc-400">
            Configure your AI providers, job search, and email preferences
          </p>
        </div>

        <div className="space-y-8">
          {/* AI Providers Section */}
          <div className="p-6 lg:p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                <Settings className="w-5 h-5 text-violet-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">AI Providers</h2>
                <p className="text-sm text-zinc-400">
                  Configure API keys for AI-powered job matching
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {AI_PROVIDERS.map((provider) => {
                const keyStatus = apiKeys[provider.id] || { hasKey: false, isActive: false };
                const hasKey = keyStatus.hasKey;

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
                      {hasKey && (
                        <div className="flex items-center gap-2">
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
                        </div>
                      )}
                    </div>

                    {hasKey ? (
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
                            className="w-full px-4 py-2 pr-20 rounded-lg bg-zinc-800/50 border border-zinc-700 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-orange-500 transition-colors"
                          />
                          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => setShowApiKeys(prev => ({ ...prev, [provider.id]: !prev[provider.id] }))}
                              className="p-1 text-zinc-500 hover:text-zinc-300"
                            >
                              {showApiKeys[provider.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleSaveApiKey(provider.id)}
                            disabled={isSavingKey[provider.id] || !apiKeyInputs[provider.id]}
                            className="flex-1 px-4 py-2 rounded-lg bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            {isSavingKey[provider.id] ? (
                              <span className="flex items-center justify-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Saving...
                              </span>
                            ) : (
                              <span className="flex items-center justify-center gap-2">
                                <Save className="w-4 h-4" />
                                Save Key
                              </span>
                            )}
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
            </div>

            <div className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <p className="text-sm text-blue-400 flex items-start gap-2">
                <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>Why configure multiple providers?</strong> Each AI provider offers unique capabilities.
                  Configure one or more to improve job matching accuracy. Your keys are encrypted with AES-256-GCM.
                </span>
              </p>
            </div>
          </div>

          {/* Search Frequency Section */}
          <div className="p-6 lg:p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Search Frequency</h2>
                <p className="text-sm text-zinc-400">
                  How often should we check for new jobs?
                </p>
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
          </div>

          {/* Email Notifications Section */}
          <div className="p-6 lg:p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <Bell className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Email Notifications</h2>
                <p className="text-sm text-zinc-400">
                  Configure when you receive job alerts
                </p>
              </div>
            </div>

            {/* Timezone Selection */}
            <div className="mb-8">
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
            <div className="mb-8">
              <label className="block text-sm font-medium text-zinc-300 mb-3">
                Preferred Times
              </label>
              <p className="text-zinc-400 text-sm mb-4">
                Select the hours when you want to receive emails with new offers
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
                    You will receive emails at: {selectedTimes.join(", ")} {timezoneLabel(timezone)}
                  </p>
                </div>
              )}
            </div>

            {/* Frequency */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-3">Email Frequency</label>
              <div className="space-y-3">
                {[
                  { value: "daily", label: "Daily", desc: "Receive a daily summary with all new offers" },
                  { value: "weekly", label: "Weekly", desc: "Receive a weekly summary every Monday" },
                  { value: "instant", label: "Instant", desc: "Receive notification as soon as an offer is found" },
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
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-violet-600 text-white font-semibold hover:from-orange-600 hover:to-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.01] shadow-lg shadow-orange-500/20"
          >
            {isSaving ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Save className="w-5 h-5" />
                Save All Settings
              </span>
            )}
          </button>
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
