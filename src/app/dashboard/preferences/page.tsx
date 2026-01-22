"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowLeft, Clock, Check, Key, Eye, EyeOff, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

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
  const [isSaving, setIsSaving] = useState(false);

  // OpenAI API Key state
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false); // TODO: Get from API

  const toggleTime = (time: string) => {
    if (selectedTimes.includes(time)) {
      setSelectedTimes(selectedTimes.filter(t => t !== time));
    } else {
      setSelectedTimes([...selectedTimes, time].sort());
    }
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      // Save preferences
      const API_BRIDGE_URL = process.env.NEXT_PUBLIC_API_BRIDGE_URL || 'http://localhost:3001';
      const response = await fetch(`${API_BRIDGE_URL}/api/preferences`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        credentials: 'include',
        body: JSON.stringify({
          jobTitles: ["Software Engineer", "Frontend Developer"], // TODO: Get from user
          locations: [],
          experienceLevel: "mid",
          remoteOnly: false
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save preferences');
      }

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

  const handleSaveApiKey = async () => {
    if (!apiKey) {
      toast.error("API key is required", {
        description: "Please enter your OpenAI API key"
      });
      return;
    }

    if (!apiKey.startsWith('sk-')) {
      toast.error("Invalid API key format", {
        description: "OpenAI API keys start with 'sk-'"
      });
      return;
    }

    setIsSaving(true);

    try {
      const API_BRIDGE_URL = process.env.NEXT_PUBLIC_API_BRIDGE_URL || 'http://localhost:3001';
      const response = await fetch(`${API_BRIDGE_URL}/api/users/api-key`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        credentials: 'include',
        body: JSON.stringify({
          openaiApiKey: apiKey
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save API key');
      }

      setHasApiKey(true);
      setApiKey(""); // Clear the input
      setShowApiKey(false);

      toast.success("API key saved successfully", {
        description: "Your OpenAI API key is now configured",
        duration: 3000
      });
    } catch (error) {
      toast.error("Error saving API key", {
        description: "Could not save your API key. Try again."
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveApiKey = async () => {
    setIsSaving(true);

    try {
      // Get user ID from localStorage or use 'me' endpoint
      const API_BRIDGE_URL = process.env.NEXT_PUBLIC_API_BRIDGE_URL || 'http://localhost:3001';

      // First get current user info to obtain userId
      const userResponse = await fetch(`${API_BRIDGE_URL}/api/users/me`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        credentials: 'include'
      });

      if (!userResponse.ok) {
        throw new Error('Failed to get user info');
      }

      const userData = await userResponse.json();
      const userId = userData.user.id;

      const response = await fetch(`${API_BRIDGE_URL}/api/users/${userId}/api-key`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to remove API key');
      }

      setHasApiKey(false);
      setApiKey("");

      toast.success("API key removed", {
        description: "Your OpenAI API key has been removed from our system"
      });
    } catch (error) {
      toast.error("Error removing API key", {
        description: "Could not remove your API key. Try again."
      });
    } finally {
      setIsSaving(false);
    }
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
              <Sparkles className="w-8 h-8 text-orange-500" />
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
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-zinc-400">
            Configure your job search preferences and API settings
          </p>
        </div>

        <div className="space-y-8">
          {/* OpenAI API Key Section */}
          <div className="p-6 lg:p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                <Key className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">OpenAI API Key</h2>
                <p className="text-sm text-zinc-400">
                  Required for AI-powered job matching
                </p>
              </div>
            </div>

            {hasApiKey ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                  <div className="flex items-center gap-2 text-green-400 mb-1">
                    <Check className="w-4 h-4" />
                    <span className="font-medium">API key configured</span>
                  </div>
                  <p className="text-sm text-zinc-400">
                    Your API key is being used for intelligent job matching. Your key is encrypted
                    and stored securely.
                  </p>
                </div>

                <button
                  onClick={handleRemoveApiKey}
                  disabled={isSaving}
                  className="px-4 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                >
                  Remove API Key
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Your OpenAI API Key
                  </label>
                  <div className="relative">
                    <input
                      type={showApiKey ? "text" : "password"}
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="sk-..."
                      className="w-full px-4 py-3 pr-12 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                    >
                      {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-zinc-500">
                    Your API key will be encrypted and stored securely using AES-256-GCM encryption.
                    It will only be used to match jobs with your preferences.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <p className="text-sm text-blue-400">
                    <Sparkles className="w-4 h-4 inline mr-1" />
                    <strong>Why do I need this?</strong> Your OpenAI API key allows us to use GPT-4
                    to intelligently match job listings with your preferences, giving you more relevant results.
                  </p>
                </div>

                <button
                  onClick={handleSaveApiKey}
                  disabled={isSaving || !apiKey}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02]"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save API Key
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Email Notification Settings */}
          <div className="p-6 lg:p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800">
            <h2 className="text-xl font-semibold text-white mb-6">Email Notifications</h2>

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
              <label className="block text-sm font-medium text-zinc-300 mb-3">Frequency</label>
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
            className="w-full py-4 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.01]"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin inline mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5 inline mr-2" />
                Save Preferences
              </>
            )}
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
