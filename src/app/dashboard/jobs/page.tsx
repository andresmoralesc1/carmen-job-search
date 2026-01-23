"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Sparkles, ArrowLeft, ExternalLink, MapPin, DollarSign, Building2, Search, SlidersHorizontal, X, Loader2 } from "lucide-react";
import { jobApi } from "@/lib/api";
import { NoResultsState } from "@/components";

interface Job {
  id: string;
  title: string;
  companyName: string;
  location: string;
  salaryRange?: string;
  description: string;
  url: string;
  similarityScore: number;
  postedDate: string;
  sentViaEmail: boolean;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    company: [] as string[],
    location: [] as string[],
    minScore: 0,
    sentViaEmail: null as boolean | null,
  });

  // Load jobs on mount
  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setIsLoading(true);
      const data = await jobApi.getAll(100);
      setJobs(data.jobs || []);
    } catch (error) {
      console.error("Error loading jobs:", error);
      // Don't show error toast - empty state is fine
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Extract unique companies and locations from jobs for filters
  const { COMPANIES, LOCATIONS } = useMemo(() => {
    const companies = new Set<string>();
    const locations = new Set<string>();

    jobs.forEach(job => {
      companies.add(job.companyName);
      // Extract locations (handle multi-word locations)
      const locationParts = job.location.split(',').map(l => l.trim());
      locationParts.forEach(loc => {
        if (loc) locations.add(loc);
      });
    });

    return {
      COMPANIES: Array.from(companies).sort(),
      LOCATIONS: Array.from(locations).sort()
    };
  }, [jobs]);

  // Filter jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Search query
      const matchesSearch =
        searchQuery === "" ||
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Company filter
      const matchesCompany =
        filters.company.length === 0 || filters.company.includes(job.companyName);

      // Location filter
      const matchesLocation =
        filters.location.length === 0 ||
        filters.location.some((loc) => job.location.toLowerCase().includes(loc.toLowerCase()));

      // Score filter
      const matchesScore = job.similarityScore >= filters.minScore / 100;

      // Email status filter
      const matchesEmail =
        filters.sentViaEmail === null ||
        job.sentViaEmail === filters.sentViaEmail;

      return matchesSearch && matchesCompany && matchesLocation && matchesScore && matchesEmail;
    });
  }, [jobs, searchQuery, filters]);

  const toggleFilter = (type: "company" | "location", value: string) => {
    setFilters((prev) => {
      const current = prev[type];
      return {
        ...prev,
        [type]: current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value],
      };
    });
  };

  const clearFilters = () => {
    setFilters({
      company: [],
      location: [],
      minScore: 0,
      sentViaEmail: null,
    });
  };

  const activeFilterCount = (
    filters.company.length +
    filters.location.length +
    (filters.minScore > 0 ? 1 : 0) +
    (filters.sentViaEmail !== null ? 1 : 0)
  );

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

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Opportunities Found</h1>
          <p className="text-zinc-400">
            {!isLoading && `${filteredJobs.length} ${filteredJobs.length === 1 ? "offer" : "offers"} matching your preferences`}
          </p>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          </div>
        ) : (
          <>
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title, company, or description..."
                  className="w-full pl-12 pr-32 py-4 rounded-xl bg-zinc-900/50 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors"
                />
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white transition-colors"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-orange-500 text-white text-xs">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="mb-6 p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Filters</h3>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-orange-500 hover:text-orange-400 flex items-center gap-1"
                    >
                      <X className="w-4 h-4" />
                      Clear filters
                    </button>
                  )}
                </div>

                <div className="grid md:grid-cols-4 gap-6">
                  {/* Company Filter */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Company
                    </label>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {COMPANIES.map((company) => (
                        <label key={company} className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer hover:text-white">
                          <input
                            type="checkbox"
                            checked={filters.company.includes(company)}
                            onChange={() => toggleFilter("company", company)}
                            className="rounded border-zinc-700 text-orange-500 focus:ring-orange-500 focus:ring-offset-zinc-900"
                          />
                          {company}
                        </label>
                      ))}
                      {COMPANIES.length === 0 && (
                        <span className="text-sm text-zinc-500">No companies available</span>
                      )}
                    </div>
                  </div>

                  {/* Location Filter */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Location
                    </label>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {LOCATIONS.map((location) => (
                        <label key={location} className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer hover:text-white">
                          <input
                            type="checkbox"
                            checked={filters.location.includes(location)}
                            onChange={() => toggleFilter("location", location)}
                            className="rounded border-zinc-700 text-orange-500 focus:ring-orange-500 focus:ring-offset-zinc-900"
                          />
                          {location}
                        </label>
                      ))}
                      {LOCATIONS.length === 0 && (
                        <span className="text-sm text-zinc-500">No locations available</span>
                      )}
                    </div>
                  </div>

                  {/* Score Filter */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Minimum Match: {filters.minScore}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={filters.minScore}
                      onChange={(e) => setFilters({ ...filters, minScore: parseInt(e.target.value) })}
                      className="w-full accent-orange-500"
                    />
                    <div className="flex justify-between text-xs text-zinc-500 mt-1">
                      <span>0%</span>
                      <span>50%</span>
                      <span>100%</span>
                    </div>
                  </div>

                  {/* Email Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Email Status
                    </label>
                    <div className="space-y-2">
                      {[
                        { value: null as boolean | null, label: "All" },
                        { value: true, label: "Sent" },
                        { value: false, label: "Pending" },
                      ].map((status) => (
                        <label key={status.label} className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer hover:text-white">
                          <input
                            type="radio"
                            name="emailStatus"
                            checked={filters.sentViaEmail === status.value}
                            onChange={() => setFilters({ ...filters, sentViaEmail: status.value })}
                            className="border-zinc-700 text-orange-500 focus:ring-orange-500 focus:ring-offset-zinc-900"
                          />
                          {status.label}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Results */}
            <div className="space-y-4">
              {filteredJobs.length === 0 ? (
                <NoResultsState
                  title={searchQuery || activeFilterCount > 0 ? "No results found" : "No jobs yet"}
                  description={
                    searchQuery || activeFilterCount > 0
                      ? "Try adjusting your filters or search terms"
                      : "Jobs you save will appear here"
                  }
                  onClear={(searchQuery || activeFilterCount > 0) ? () => {
                    setSearchQuery("");
                    clearFilters();
                  } : undefined}
                />
              ) : (
                filteredJobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-orange-500/30 transition-all"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-semibold text-white">{job.title}</h3>
                          {job.similarityScore >= 0.9 && (
                            <span className="px-2 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-medium">
                              Excellent Match
                            </span>
                          )}
                          {job.sentViaEmail && (
                            <span className="px-2 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-medium">
                              ✓ Sent
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-zinc-400">
                          <div className="flex items-center gap-1">
                            <Building2 className="w-4 h-4" />
                            {job.companyName}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {job.location}
                          </div>
                        </div>
                      </div>
                      <a
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition-colors"
                      >
                        Apply
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>

                    {/* Description */}
                    <p className="text-zinc-400 text-sm mb-4 line-clamp-2">
                      {job.description}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                      {job.salaryRange && (
                        <div className="flex items-center gap-1 text-sm text-zinc-500">
                          <DollarSign className="w-4 h-4" />
                          {job.salaryRange}
                        </div>
                      )}
                      {!job.salaryRange && <div />}
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-zinc-500">
                          {new Date(job.postedDate).toLocaleDateString("es-CO", {
                            day: "numeric",
                            month: "short"
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Similarity Score Bar */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-zinc-500">Match with your profile</span>
                        <span className="text-orange-400 font-medium">
                          {Math.round(job.similarityScore * 100)}%
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full transition-all duration-500"
                          style={{ width: `${job.similarityScore * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
