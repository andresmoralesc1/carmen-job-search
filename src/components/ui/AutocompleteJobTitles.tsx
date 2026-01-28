"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, X, Search, ChevronDown, Briefcase, Megaphone, BarChart3, Palette, Users } from "lucide-react";

// Lista de puestos sugeridos organizados por categoría
const JOB_SUGGESTIONS = [
  // Frontend
  "Frontend Developer",
  "Senior Frontend Developer",
  "Full Stack Developer",
  "React Developer",
  "Vue.js Developer",
  "Angular Developer",
  "Next.js Developer",
  "UI/UX Developer",
  // Backend
  "Backend Developer",
  "Senior Backend Developer",
  "Node.js Developer",
  "Python Developer",
  "Java Developer",
  "Go Developer",
  "Rust Developer",
  "PHP Developer",
  "DevOps Engineer",
  "Site Reliability Engineer",
  // Mobile
  "Mobile Developer",
  "iOS Developer",
  "Android Developer",
  "React Native Developer",
  "Flutter Developer",
  // Data
  "Data Scientist",
  "Data Analyst",
  "Data Engineer",
  "Machine Learning Engineer",
  "AI Engineer",
  // Marketing Digital
  "Digital Marketing Manager",
  "Digital Marketing Specialist",
  "Performance Marketing Manager",
  "PPC Specialist",
  "SEM Specialist",
  "Google Ads Specialist",
  "Facebook Ads Specialist",
  "LinkedIn Ads Specialist",
  "TikTok Ads Specialist",
  "Social Media Ads Manager",
  // Marketing y Redes Sociales
  "Social Media Manager",
  "Social Media Specialist",
  "Content Creator",
  "Content Manager",
  "Content Marketing Manager",
  "Content Strategist",
  "Copywriter",
  "Creative Director",
  "Brand Manager",
  "Community Manager",
  "Influencer Marketing Manager",
  // Email Marketing
  "Email Marketing Specialist",
  "Email Marketing Manager",
  "Marketing Automation Specialist",
  "CRM Specialist",
  "Lifecycle Marketing Manager",
  // SEO y Growth
  "SEO Specialist",
  "SEO Manager",
  "Growth Marketing Manager",
  "Growth Hacker",
  "Conversion Rate Optimization Specialist",
  "Web Analyst",
  "Marketing Analyst",
  // Product Marketing
  "Product Marketing Manager",
  "Technical Product Marketing Manager",
  "GTM Marketing Manager",
  "Product Marketing Specialist",
  // Marketing Tradicional
  "Marketing Manager",
  "Marketing Coordinator",
  "Marketing Director",
  "Brand Marketing Manager",
  "Campaign Manager",
  "Trade Marketing Manager",
  // Ventas y Business Development
  "Sales Manager",
  "Business Development Manager",
  "Sales Representative",
  "Account Manager",
  "Customer Success Manager",
  "Sales Development Representative",
  "Lead Generation Specialist",
  // Otros Tech
  "Software Engineer",
  "Senior Software Engineer",
  "Tech Lead",
  "Engineering Manager",
  "QA Engineer",
  "DevSecOps Engineer",
  "Cloud Architect",
  "Solutions Architect",
  "Project Manager",
  "Scrum Master",
];

// Categorías para mostrar sugerencias organizadas
const JOB_CATEGORIES = [
  {
    name: "Tech & Development",
    icon: Briefcase,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    suggestions: [
      "Frontend Developer",
      "Backend Developer",
      "Full Stack Developer",
      "Software Engineer",
      "DevOps Engineer",
    ]
  },
  {
    name: "Marketing Digital",
    icon: Megaphone,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    suggestions: [
      "Digital Marketing Manager",
      "Performance Marketing Manager",
      "PPC Specialist",
      "SEO Specialist",
      "Social Media Manager",
    ]
  },
  {
    name: "Growth & Datos",
    icon: BarChart3,
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    suggestions: [
      "Growth Marketing Manager",
      "Marketing Analyst",
      "Data Analyst",
      "Conversion Rate Optimization",
      "Web Analyst",
    ]
  },
  {
    name: "Contenido & Brand",
    icon: Palette,
    color: "text-pink-400",
    bgColor: "bg-pink-500/10",
    suggestions: [
      "Content Marketing Manager",
      "Copywriter",
      "Brand Manager",
      "Creative Director",
      "Content Creator",
    ]
  },
  {
    name: "Ventas & Customer Success",
    icon: Users,
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",
    suggestions: [
      "Sales Manager",
      "Business Development Manager",
      "Account Manager",
      "Customer Success Manager",
      "Sales Representative",
    ]
  },
];

interface AutocompleteJobTitlesProps {
  selectedTitles: string[];
  onAdd: (title: string) => void;
  onRemove: (title: string) => void;
  disabled?: boolean;
}

export function AutocompleteJobTitles({
  selectedTitles,
  onAdd,
  onRemove,
  disabled = false,
}: AutocompleteJobTitlesProps) {
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Filtrar sugerencias basadas en el input
  useEffect(() => {
    if (input.length > 0) {
      const filtered = JOB_SUGGESTIONS.filter(
        (suggestion) =>
          suggestion.toLowerCase().includes(input.toLowerCase()) &&
          !selectedTitles.includes(suggestion)
      );
      setFilteredSuggestions(filtered.slice(0, 8)); // Máximo 8 sugerencias
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
      setFilteredSuggestions([]);
    }
  }, [input, selectedTitles]);

  // Cerrar sugerencias al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAdd = (title: string) => {
    if (title.trim() && !selectedTitles.includes(title)) {
      onAdd(title);
      setInput("");
      setShowSuggestions(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && input.trim()) {
      e.preventDefault();
      handleAdd(input);
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      {/* Selected Tags */}
      {selectedTitles.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {selectedTitles.map((title) => (
            <div
              key={title}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm animate-in fade-in slide-in-from-bottom-2 duration-200"
            >
              {title}
              <button
                type="button"
                disabled={disabled}
                onClick={() => onRemove(title)}
                className="hover:text-orange-300 disabled:cursor-not-allowed transition-colors"
                aria-label={`Remove ${title}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input + Suggestion Button */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input
            type="text"
            disabled={disabled}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            onFocus={() => {
              if (input.length > 0 && filteredSuggestions.length > 0) {
                setShowSuggestions(true);
              }
            }}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="Ej: Senior Frontend Developer"
          />
        </div>
        <button
          type="button"
          disabled={disabled || !input.trim()}
          onClick={() => handleAdd(input)}
          className="px-4 py-3 rounded-xl bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-2 bg-zinc-900 border border-zinc-700 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-h-60 overflow-y-auto">
            <div className="px-3 py-2 text-xs text-zinc-500 border-b border-zinc-800">
              Sugerencias ({filteredSuggestions.length})
            </div>
            {filteredSuggestions.map((suggestion, index) => (
              <button
                key={suggestion}
                type="button"
                disabled={disabled}
                onClick={() => handleAdd(suggestion)}
                className="w-full px-4 py-3 text-left text-white hover:bg-zinc-800 disabled:cursor-not-allowed transition-colors flex items-center gap-3"
              >
                <Plus className="w-4 h-4 text-orange-500 flex-shrink-0" />
                <span className="truncate">{suggestion}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Empty State con categorías */}
      {selectedTitles.length === 0 && !input && (
        <div className="mt-4 space-y-4">
          <p className="text-sm text-zinc-400">
            Escribe un puesto o selecciona una sugerencia por categoría:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {JOB_CATEGORIES.map((category) => (
              <div
                key={category.name}
                className="p-3 rounded-lg bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer"
                onClick={() => {
                  // Mostrar sugerencias de esta categoría al hacer click
                  setInput(category.suggestions[0]);
                  setShowSuggestions(true);
                  setFilteredSuggestions(category.suggestions);
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <category.icon className={`w-4 h-4 ${category.color} flex-shrink-0`} />
                  <span className="text-sm font-medium text-zinc-300">{category.name}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {category.suggestions.slice(0, 4).map((suggestion) => (
                    <span
                      key={suggestion}
                      className="text-xs px-2 py-1 rounded-md bg-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700 transition-colors cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAdd(suggestion);
                      }}
                    >
                      {suggestion}
                    </span>
                  ))}
                  {category.suggestions.length > 4 && (
                    <span className="text-xs px-2 py-1 rounded-md text-zinc-500">
                      +{category.suggestions.length - 4} más
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
