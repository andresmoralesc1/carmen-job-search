"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Plus, Trash2, ExternalLink, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog, NoCompaniesState, Footer } from "@/components";
import { companyApi } from "@/lib/api";

interface Company {
  id: string;
  name: string;
  careerPageUrl: string;
  jobBoardUrl?: string;
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [newCompany, setNewCompany] = useState({
    name: "",
    careerPageUrl: "",
    jobBoardUrl: ""
  });

  // Load companies on mount
  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      setIsLoading(true);
      const data = await companyApi.getAll();
      setCompanies(data.companies || []);
    } catch (error) {
      console.error("Error loading companies:", error);
      // Don't show error toast on initial load - empty state is fine
      setCompanies([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = await companyApi.create({
        name: newCompany.name,
        careerPageUrl: newCompany.careerPageUrl,
        jobBoardUrl: newCompany.jobBoardUrl || undefined
      });

      setCompanies([...companies, data.company]);
      setNewCompany({ name: "", careerPageUrl: "", jobBoardUrl: "" });
      setShowAddForm(false);

      toast.success("Company added successfully", {
        description: `${data.company.name} has been added to your monitoring list`
      });
    } catch (error) {
      console.error("Error adding company:", error);
      toast.error("Error adding company", {
        description: error instanceof Error ? error.message : "Could not add the company. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;

    const companyToDelete = companies.find(c => c.id === deleteConfirm);

    try {
      // Get userId by calling /api/users/me (since backend uses JWT)
      const API_BRIDGE_URL = process.env.NEXT_PUBLIC_API_BRIDGE_URL || 'http://localhost:3001';
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

      await companyApi.delete(deleteConfirm, userId);

      setCompanies(companies.filter(c => c.id !== deleteConfirm));
      setDeleteConfirm(null);

      toast.success("Company removed", {
        description: `${companyToDelete?.name} will no longer be monitored`
      });
    } catch (error) {
      console.error("Error deleting company:", error);
      toast.error("Error removing company", {
        description: "Could not remove the company. Please try again."
      });
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

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Monitored Companies</h1>
            <p className="text-zinc-400">
              Add companies you want to monitor to find job opportunities
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-all hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Add Company
          </button>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          </div>
        ) : (
          <>
            {/* Add Company Form */}
            {showAddForm && (
              <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">New Company</h2>
                <form onSubmit={handleAddCompany} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      required
                      disabled={isSubmitting}
                      value={newCompany.name}
                      onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="e.g. Google"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Career Page Link *
                    </label>
                    <input
                      type="url"
                      required
                      disabled={isSubmitting}
                      value={newCompany.careerPageUrl}
                      onChange={(e) => setNewCompany({ ...newCompany, careerPageUrl: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="https://careers.google.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Job Board Link (optional)
                    </label>
                    <input
                      type="url"
                      disabled={isSubmitting}
                      value={newCompany.jobBoardUrl}
                      onChange={(e) => setNewCompany({ ...newCompany, jobBoardUrl: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="https://boards.greenhouse.io/google"
                    />
                    <p className="text-xs text-zinc-500 mt-2">
                      Some companies use external job boards like Greenhouse, Lever, etc.
                    </p>
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => {
                        setShowAddForm(false);
                        setNewCompany({ name: "", careerPageUrl: "", jobBoardUrl: "" });
                      }}
                      className="px-6 py-3 rounded-xl border border-zinc-700 text-white font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        "Add Company"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Companies List - Two Columns Layout */}
            <div className="space-y-4">
              {companies.length === 0 ? (
                <NoCompaniesState onAdd={() => setShowAddForm(true)} />
              ) : (
                companies.map((company) => (
                  <div
                    key={company.id}
                    className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-orange-500/30 transition-all"
                  >
                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Column 1: Company Name */}
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                          <Sparkles className="w-6 h-6 text-orange-500" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">{company.name}</h3>
                          <p className="text-zinc-500 text-sm">Monitored company</p>
                        </div>
                      </div>

                      {/* Column 2: Links + Actions */}
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <a
                            href={company.careerPageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-zinc-400 hover:text-orange-500 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Career Page
                          </a>
                          {company.jobBoardUrl && (
                            <a
                              href={company.jobBoardUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-sm text-zinc-400 hover:text-orange-500 transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                              Job board
                            </a>
                          )}
                        </div>
                        <button
                          onClick={() => setDeleteConfirm(company.id)}
                          className="p-2 rounded-lg text-zinc-500 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                          title="Remove company"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* Info Box */}
        <div className="mt-8 p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
          <p className="text-sm text-orange-400">
            <strong>Note:</strong> The system will automatically search for new offers on these companies'
            career pages. Offers will be analyzed with AI to find those that best match your preferences.
          </p>
        </div>
      </main>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={!!deleteConfirm}
        title="Remove company?"
        message="This action will remove the company from your monitoring list. Already found offers will not be deleted."
        confirmText="Yes, remove"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirm(null)}
      />
      <Footer />
    </div>
  );
}
