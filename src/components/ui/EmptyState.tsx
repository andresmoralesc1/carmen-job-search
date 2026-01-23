"use client";

import { ReactNode } from "react";
import {
  Search,
  Briefcase,
  Building2,
  Mail,
  FileQuestion,
  Inbox,
  AlertCircle,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components";

export type EmptyStateVariant = "neutral" | "info" | "success" | "warning" | "error";
export type EmptyStateType = "no-results" | "no-companies" | "no-jobs" | "no-emails" | "error" | "loading" | "generic";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  variant?: EmptyStateVariant;
  type?: EmptyStateType;
  icon?: ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const iconMap: Record<EmptyStateType, ReactNode> = {
  "no-results": <Search className="w-full h-full" />,
  "no-companies": <Building2 className="w-full h-full" />,
  "no-jobs": <Briefcase className="w-full h-full" />,
  "no-emails": <Mail className="w-full h-full" />,
  "error": <AlertCircle className="w-full h-full" />,
  "loading": <Sparkles className="w-full h-full animate-spin-slow" />,
  "generic": <Inbox className="w-full h-full" />,
};

const colorMap: Record<EmptyStateVariant, string> = {
  neutral: "text-zinc-500",
  info: "text-blue-500",
  success: "text-green-500",
  warning: "text-orange-500",
  error: "text-red-500",
};

const bgColorMap: Record<EmptyStateVariant, string> = {
  neutral: "bg-zinc-500/10 border-zinc-500/20",
  info: "bg-blue-500/10 border-blue-500/20",
  success: "bg-green-500/10 border-green-500/20",
  warning: "bg-orange-500/10 border-orange-500/20",
  error: "bg-red-500/10 border-red-500/20",
};

const sizeClasses = {
  sm: {
    container: "p-6 rounded-xl",
    icon: "w-10 h-10",
    title: "text-base",
    description: "text-sm",
  },
  md: {
    container: "p-8 rounded-2xl",
    icon: "w-14 h-14",
    title: "text-lg",
    description: "text-base",
  },
  lg: {
    container: "p-12 rounded-2xl",
    icon: "w-16 h-16",
    title: "text-xl",
    description: "text-lg",
  },
};

export function EmptyState({
  title,
  description,
  action,
  variant = "neutral",
  type = "generic",
  icon: customIcon,
  size = "md",
  className = "",
}: EmptyStateProps) {
  const sizeConfig = sizeClasses[size];
  const iconColor = colorMap[variant];
  const bgColor = bgColorMap[variant];
  const iconElement = customIcon || iconMap[type];

  const iconContainer = (
    <div className={`mx-auto mb-4 flex items-center justify-center ${sizeConfig.icon} ${bgColor} rounded-full`}>
      <div className={`${iconColor} opacity-80`}>
        {iconElement}
      </div>
    </div>
  );

  const actionButton = action && (
    <div className="flex justify-center mt-6">
      {action.href ? (
        <Button
          href={action.href}
          size="sm"
          showArrow
          className="group"
        >
          {action.label}
        </Button>
      ) : (
        <button
          onClick={action.onClick}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 text-white font-medium hover:from-violet-600 hover:to-purple-600 transition-all hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
        >
          {action.label}
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </button>
      )}
    </div>
  );

  return (
    <div
      className={`text-center ${sizeConfig.container} bg-zinc-900/50 border border-zinc-800 ${className}`}
      role="status"
      aria-live="polite"
    >
      {iconContainer}
      <h2 className={`${sizeConfig.title} font-semibold text-white mb-2`}>
        {title}
      </h2>
      {description && (
        <p className={`${sizeConfig.description} text-zinc-400 mb-0 max-w-md mx-auto`}>
          {description}
        </p>
      )}
      {actionButton}
    </div>
  );
}

// Pre-configured empty states for common use cases
export function NoResultsState({
  title = "No results found",
  description = "Try adjusting your filters or search terms",
  onClear,
}: {
  title?: string;
  description?: string;
  onClear?: () => void;
}) {
  return (
    <EmptyState
      type="no-results"
      variant="neutral"
      size="lg"
      title={title}
      description={description}
      action={onClear ? {
        label: "Clear filters",
        onClick: onClear,
      } : undefined}
    />
  );
}

export function NoCompaniesState({
  onAdd,
}: {
  onAdd?: () => void;
}) {
  return (
    <EmptyState
      type="no-companies"
      variant="info"
      size="lg"
      title="No companies yet"
      description="Start by adding companies you want to monitor. We'll scrape their career pages for job opportunities."
      action={onAdd ? {
        label: "Add your first company",
        onClick: onAdd,
      } : {
        label: "Add companies",
        href: "/dashboard/companies",
      }}
    />
  );
}

export function NoJobsState({
  hasCompanies,
}: {
  hasCompanies?: boolean;
}) {
  return (
    <EmptyState
      type="no-jobs"
      variant={hasCompanies ? "warning" : "info"}
      size="lg"
      title={hasCompanies ? "No jobs found yet" : "No jobs available"}
      description={
        hasCompanies
          ? "We're still searching! Jobs will appear here once we find matching opportunities at your monitored companies."
          : "Add companies to monitor and we'll find jobs that match your preferences."
      }
      action={hasCompanies ? undefined : {
        label: "Add companies",
        href: "/dashboard/companies",
      }}
    />
  );
}

export function ErrorState({
  title = "Something went wrong",
  description,
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <EmptyState
      type="error"
      variant="error"
      size="lg"
      title={title}
      description={description || "An error occurred while loading. Please try again."}
      action={onRetry ? {
        label: "Try again",
        onClick: onRetry,
      } : undefined}
    />
  );
}
