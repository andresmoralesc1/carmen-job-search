"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, X, Search } from "lucide-react";

// Lista de puestos sugeridos
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
  // Otros
  "Software Engineer",
  "Senior Software Engineer",
  "Tech Lead",
  "Engineering Manager",
  "QA Engineer",
  "DevSecOps Engineer",
  "Cloud Architect",
  "Solutions Architect",
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

      {/* Empty State */}
      {selectedTitles.length === 0 && !input && (
        <p className="text-sm text-zinc-500 mt-2">
          Escribe un puesto o selecciona una sugerencia. Ejemplos:{" "}
          <span className="text-orange-400">Frontend Developer</span>,{" "}
          <span className="text-orange-400">Full Stack Developer</span>,{" "}
          <span className="text-orange-400">Data Scientist</span>
        </p>
      )}
    </div>
  );
}
