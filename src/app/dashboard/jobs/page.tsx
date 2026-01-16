"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Briefcase, ArrowLeft, ExternalLink, MapPin, DollarSign, Building2, Search, SlidersHorizontal, X } from "lucide-react";

// TODO: Get from API
const mockJobs = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    companyName: "Google",
    location: "Remote - Bogotá",
    salary: "$8,000 - $12,000 USD",
    description: "We are looking for a Senior Frontend Developer to join our team...",
    url: "https://careers.google.com/jobs/123",
    similarityScore: 0.92,
    postedDate: "2024-01-10",
    sentViaEmail: false
  },
  {
    id: "2",
    title: "Frontend Engineer",
    companyName: "Meta",
    location: "Remote",
    salary: "$10,000 - $15,000 USD",
    description: "Join our team to build the next generation of social experiences...",
    url: "https://www.metacareers.com/jobs/456",
    similarityScore: 0.88,
    postedDate: "2024-01-09",
    sentViaEmail: true
  },
  {
    id: "3",
    title: "React Developer",
    companyName: "Amazon",
    location: "Bogotá, Colombia",
    salary: "$6,000 - $9,000 USD",
    description: "We're seeking a talented React Developer to work on our e-commerce platform...",
    url: "https://www.amazon.jobs/jobs/789",
    similarityScore: 0.85,
    postedDate: "2024-01-08",
    sentViaEmail: true
  },
  {
    id: "4",
    title: "Full Stack Developer",
    companyName: "Google",
    location: "Remote",
    salary: "$9,000 - $14,000 USD",
    description: "Build scalable web applications serving millions of users...",
    url: "https://careers.google.com/jobs/456",
    similarityScore: 0.78,
    postedDate: "2024-01-07",
    sentViaEmail: false
  },
  {
    id: "5",
    title: "Senior Software Engineer",
    companyName: "Meta",
    location: "New York, USA",
    salary: "$15,000 - $20,000 USD",
    description: "Lead the development of core infrastructure...",
    url: "https://www.metacareers.com/jobs/123",
    similarityScore: 0.75,
    postedDate: "2024-01-06",
    sentViaEmail: true
  }
];

// Unique values for filters
const COMPANIES = ["Google", "Meta", "Amazon"];
const LOCATIONS = ["Remote", "Bogotá", "New York", "USA", "Colombia"];

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    company: [] as string[],
    location: [] as string[],
    minScore: 0,
    sentViaEmail: null as boolean | null,
  });

  // Filter jobs
  const filteredJobs = useMemo(() => {
    return mockJobs.filter((job) => {
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
  }, [searchQuery, filters]);

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

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Opportunities Found</h1>
          <p className="text-zinc-400">
            {filteredJobs.length} {filteredJobs.length === 1 ? "offer" : "offers"} matching your preferences
          </p>
        </div>

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
                <div className="space-y-2">
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
                </div>
              </div>

              {/* Location Filter */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Location
                </label>
                <div className="space-y-2">
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
                    { value: null, label: "All" },
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
            <div className="p-12 rounded-2xl bg-zinc-900/50 border border-zinc-800 text-center">
              <Briefcase className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Results</h3>
              <p className="text-zinc-400 mb-6">
                {searchQuery || activeFilterCount > 0
                  ? "No offers found with the applied filters"
                  : "New offers will appear here when found"}
              </p>
              {(searchQuery || activeFilterCount > 0) && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    clearFilters();
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-colors"
                >
                  Clear filters
                </button>
              )}
            </div>
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
                  <div className="flex items-center gap-1 text-sm text-zinc-500">
                    <DollarSign className="w-4 h-4" />
                    {job.salary}
                  </div>
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
      </main>
    </div>
  );
}
