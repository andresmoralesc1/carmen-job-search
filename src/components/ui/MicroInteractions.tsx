"use client";

import { ReactNode, CSSProperties } from "react";
import { Check, X, Loader2 } from "lucide-react";

// ============================================
// Types and Interfaces
// ============================================

export type InteractionState = "idle" | "loading" | "success" | "error";
export type AnimationType = "scale" | "slide" | "fade" | "bounce" | "shake" | "pulse";

interface MicroInteractionProps {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

// ============================================
// Feedback Button Component
// ============================================

interface FeedbackButtonProps {
  children: ReactNode;
  onClick?: () => void | Promise<void>;
  state?: InteractionState;
  onStateChange?: (state: InteractionState) => void;
  variant?: "primary" | "secondary" | "success" | "danger";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
  showSuccessIcon?: boolean;
  showErrorIcon?: boolean;
  successDuration?: number;
}

/**
 * Button with built-in feedback states (loading, success, error)
 */
export function FeedbackButton({
  children,
  onClick,
  state: externalState,
  onStateChange,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  showSuccessIcon = true,
  showErrorIcon = true,
  successDuration = 2000,
}: FeedbackButtonProps) {
  const [internalState, setInternalState] = React.useState<InteractionState>("idle");
  const state = externalState ?? internalState;

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const variantClasses: Record<string, string> = {
    primary:
      "bg-violet-500 text-white hover:bg-violet-600 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40",
    secondary:
      "bg-zinc-800 text-white hover:bg-zinc-700",
    success:
      "bg-green-500 text-white hover:bg-green-600 shadow-lg shadow-green-500/25",
    danger:
      "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/25",
  };

  const getStateClass = () => {
    switch (state) {
      case "loading":
        return "opacity-80 cursor-wait";
      case "success":
        return variantClasses.success;
      case "error":
        return variantClasses.danger;
      default:
        return variantClasses[variant];
    }
  };

  const handleClick = async () => {
    if (disabled || state === "loading") return;

    if (externalState === undefined) {
      setInternalState("loading");
      onStateChange?.("loading");
    }

    try {
      await onClick?.();

      if (externalState === undefined) {
        setInternalState("success");
        onStateChange?.("success");

        setTimeout(() => {
          setInternalState("idle");
          onStateChange?.("idle");
        }, successDuration);
      }
    } catch (error) {
      if (externalState === undefined) {
        setInternalState("error");
        onStateChange?.("error");

        setTimeout(() => {
          setInternalState("idle");
          onStateChange?.("idle");
        }, successDuration);
      }
    }
  };

  const renderContent = () => {
    if (state === "loading") {
      return (
        <>
          <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
          <span>Loading...</span>
        </>
      );
    }

    if (state === "success" && showSuccessIcon) {
      return (
        <>
          <Check className="w-5 h-5" aria-hidden="true" />
          <span>Success!</span>
        </>
      );
    }

    if (state === "error" && showErrorIcon) {
      return (
        <>
          <X className="w-5 h-5" aria-hidden="true" />
          <span>Error</span>
        </>
      );
    }

    return children;
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || state === "loading"}
      className={`
        inline-flex items-center justify-center gap-2 rounded-full
        ${sizeClasses[size]}
        ${getStateClass()}
        transition-all duration-200
        hover:scale-105 active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed
        disabled:hover:scale-100
        ${className}
      `.trim()}
      aria-busy={state === "loading"}
    >
      {renderContent()}
    </button>
  );
}

// ============================================
// Hover Card Component
// ============================================

interface HoverCardProps {
  children: ReactNode;
  className?: string;
  lift?: boolean;
  glow?: boolean;
  borderColor?: string;
  scale?: number;
}

/**
 * Card with enhanced hover effects
 */
export function HoverCard({
  children,
  className = "",
  lift = true,
  glow = false,
  borderColor,
  scale = 1.02,
}: HoverCardProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  const baseClasses = "rounded-2xl bg-zinc-900/50 border transition-all duration-300 ease-out";
  const hoverClasses = lift
    ? "hover:-translate-y-1 hover:shadow-xl"
    : "";
  const glowClass = glow
    ? "hover:shadow-violet-500/20"
    : "";
  const borderClass = borderColor
    ? `hover:border-${borderColor}`
    : "hover:border-violet-500/30";

  return (
    <div
      className={`${baseClasses} ${hoverClasses} ${glowClass} ${borderClass} border-zinc-800 ${className}`.trim()}
      style={{
        transform: isHovered ? `scale(${scale})` : "scale(1)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </div>
  );
}

// ============================================
// Ripple Effect Component
// ============================================

interface RippleButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  rippleColor?: string;
}

/**
 * Button with material design-style ripple effect
 */
export function RippleButton({
  children,
  onClick,
  className = "",
  disabled = false,
  rippleColor = "rgba(255, 255, 255, 0.3)",
}: RippleButtonProps) {
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [ripples, setRipples] = React.useState<{ id: number; x: number; y: number }[]>([]);

  const addRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;

    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const newRipple = {
      id: Date.now(),
      x,
      y,
    };

    setRipples((prev) => [...prev, newRipple]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);

    onClick?.();
  };

  return (
    <button
      ref={buttonRef}
      onClick={addRipple}
      disabled={disabled}
      className={`relative overflow-hidden ${className}`.trim()}
    >
      {children}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full pointer-events-none animate-ping"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: "0",
            height: "0",
            backgroundColor: rippleColor,
            transform: "translate(-50%, -50%)",
            animation: "ripple 600ms ease-out",
          }}
        />
      ))}
    </button>
  );
}

// ============================================
// Shake Animation Component
// ============================================

interface ShakeableProps {
  children: ReactNode;
  shake?: boolean;
  className?: string;
}

/**
 * Wrapper that applies shake animation on error
 */
export function Shakeable({ children, shake = false, className = "" }: ShakeableProps) {
  return (
    <div
      className={shake ? "animate-shake" : ""}
      style={{
        animation: shake ? "shake 0.5s ease-in-out" : undefined,
      }}
    >
      {children}
    </div>
  );
}

// ============================================
// Tooltip Component
// ============================================

interface TooltipProps {
  children: ReactNode;
  content: string;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
  delay?: number;
}

/**
 * Accessible tooltip with keyboard support
 */
export function Tooltip({
  children,
  content,
  position = "top",
  className = "",
  delay = 200,
}: TooltipProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout | undefined>(undefined);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const positionClasses: Record<string, string> = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  const arrowClasses: Record<string, string> = {
    top: "top-full left-1/2 -translate-x-1/2 -mt-1 border-l-transparent border-r-transparent border-b-transparent",
    bottom: "bottom-full left-1/2 -translate-x-1/2 -mb-1 border-l-transparent border-r-transparent border-t-transparent",
    left: "left-full top-1/2 -translate-y-1/2 -ml-1 border-t-transparent border-b-transparent border-r-transparent",
    right: "right-full top-1/2 -translate-y-1/2 -mr-1 border-t-transparent border-b-transparent border-l-transparent",
  };

  return (
    <div className={`relative inline-block ${className}`.trim()}>
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleMouseEnter}
        onBlur={handleMouseLeave}
        tabIndex={0}
        role="button"
        aria-describedby={`tooltip-${content.replace(/\s/g, "-")}`}
      >
        {children}
      </div>
      {isVisible && (
        <div
          id={`tooltip-${content.replace(/\s/g, "-")}`}
          role="tooltip"
          className={`
            absolute z-50 px-3 py-2 text-sm text-white bg-zinc-900
            rounded-lg border border-zinc-700 shadow-xl whitespace-nowrap
            animate-fade-in ${positionClasses[position]}
          `.trim()}
        >
          {content}
          <div
            className={`
              absolute w-2 h-2 bg-zinc-900 border border-zinc-700
              rotate-45 ${arrowClasses[position]}
            `.trim()}
          />
        </div>
      )}
    </div>
  );
}

// ============================================
// Press Animation Component
// ============================================

interface PressableProps {
  children: ReactNode;
  onPress?: () => void;
  className?: string;
  disabled?: boolean;
  scaleOnPress?: number;
}

/**
 * Element with press/down animation
 */
export function Pressable({
  children,
  onPress,
  className = "",
  disabled = false,
  scaleOnPress = 0.95,
}: PressableProps) {
  const [isPressed, setIsPressed] = React.useState(false);

  return (
    <div
      className={className}
      style={{
        transform: isPressed && !disabled ? `scale(${scaleOnPress})` : "scale(1)",
        transition: "transform 100ms ease-out",
        cursor: disabled ? "not-allowed" : "pointer",
      }}
      onMouseDown={() => !disabled && setIsPressed(true)}
      onMouseUp={() => !disabled && setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onClick={() => !disabled && onPress?.()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onPress?.();
        }
      }}
    >
      {children}
    </div>
  );
}

// ============================================
// Notification/Toast with Animation
// ============================================

interface NotificationProps {
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  onClose?: () => void;
  duration?: number;
}

/**
 * Animated notification/toast component
 */
export function Notification({
  type,
  title,
  message,
  onClose,
  duration = 4000,
}: NotificationProps) {
  React.useEffect(() => {
    if (duration > 0 && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const typeConfig: Record<string, { bg: string; border: string; icon: string }> = {
    success: { bg: "bg-green-500/10", border: "border-green-500/30", icon: "✓" },
    error: { bg: "bg-red-500/10", border: "border-red-500/30", icon: "✕" },
    warning: { bg: "bg-orange-500/10", border: "border-orange-500/30", icon: "⚠" },
    info: { bg: "bg-blue-500/10", border: "border-blue-500/30", icon: "ℹ" },
  };

  const config = typeConfig[type];

  return (
    <div
      className={`
        flex items-start gap-3 p-4 rounded-xl border shadow-xl
        animate-slide-right ${config.bg} ${config.border}
      `.trim()}
      role="alert"
      aria-live="polite"
    >
      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-900/50 flex items-center justify-center text-sm">
        {config.icon}
      </span>
      <div className="flex-1">
        <p className="font-semibold text-white text-sm">{title}</p>
        {message && <p className="text-zinc-400 text-sm mt-1">{message}</p>}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 text-zinc-500 hover:text-white transition-colors"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

// ============================================
// Stagger Children Animation
// ============================================

interface StaggerChildrenProps {
  children: ReactNode;
  stagger?: number;
  className?: string;
  delay?: number;
}

/**
 * Wrapper that staggers animation of child elements
 */
export function StaggerChildren({
  children,
  stagger = 100,
  className = "",
  delay = 0,
}: StaggerChildrenProps) {
  const childArray = React.Children.toArray(children);

  return (
    <div className={className}>
      {childArray.map((child, index) => (
        <div
          key={index}
          className="animate-fade-in"
          style={{
            animationDelay: `${delay + index * stagger}ms`,
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

// ============================================
// Icon with Hover Animation
// ============================================

interface AnimatedIconProps {
  icon: ReactNode;
  className?: string;
  hoverScale?: number;
  rotate?: boolean;
  bounce?: boolean;
}

/**
 * Icon with configurable hover animations
 */
export function AnimatedIcon({
  icon,
  className = "",
  hoverScale = 1.1,
  rotate = false,
  bounce = false,
}: AnimatedIconProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  let animationClass = "";
  if (rotate) animationClass += isHovered ? "rotate-90" : "";
  if (bounce) animationClass += isHovered ? "animate-bounce-subtle" : "";

  return (
    <span
      className={`inline-block transition-transform duration-200 ${animationClass} ${className}`.trim()}
      style={{
        transform: isHovered ? `scale(${hoverScale})` : "scale(1)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {icon}
    </span>
  );
}

// ============================================
// Progress Ring Component
// ============================================

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  className?: string;
  showLabel?: boolean;
  color?: string;
}

/**
 * Circular progress indicator with animation
 */
export function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  className = "",
  showLabel = true,
  color = "#8b5cf6",
}: ProgressRingProps) {
  const normalizedProgress = Math.max(0, Math.min(100, progress));
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (normalizedProgress / 100) * circumference;

  return (
    <div className={`relative ${className}`.trim()}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgb(39 39 42)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-white">
            {Math.round(normalizedProgress)}%
          </span>
        </div>
      )}
    </div>
  );
}

// ============================================
// React import
// ============================================

import React from "react";
