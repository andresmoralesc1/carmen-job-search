"use client";

import { InputHTMLAttributes, forwardRef, ReactNode } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { useState } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  showPasswordToggle?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id,
      label,
      error,
      helperText,
      showPasswordToggle = false,
      leftIcon,
      rightIcon,
      type = "text",
      className = "",
      containerClassName = "",
      disabled = false,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    const hasError = !!error;
    const inputType = showPasswordToggle && type === "password"
      ? (showPassword ? "text" : "password")
      : type;

    const baseInputClasses = "w-full px-4 py-3 rounded-xl bg-zinc-800 border text-white placeholder-zinc-500 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
    const borderClasses = hasError
      ? "border-red-500 focus:border-red-500"
      : "border-zinc-700 focus:border-orange-500";
    const paddingClasses = leftIcon ? "pl-12" : "";
    const paddingRightClasses = (showPasswordToggle && type === "password") || rightIcon ? "pr-12" : "";
    const iconClasses = "absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none";
    const rightIconClasses = "absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors";

    return (
      <div className={`space-y-2 ${containerClassName}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-zinc-300"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className={iconClasses} aria-hidden="true">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={inputType}
            className={`${baseInputClasses} ${borderClasses} ${paddingClasses} ${paddingRightClasses} ${className}`.trim()}
            aria-invalid={hasError}
            aria-describedby={
              hasError ? errorId :
              helperText ? helperId :
              undefined
            }
            disabled={disabled}
            {...props}
          />

          {/* Password Toggle */}
          {showPasswordToggle && type === "password" && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={rightIconClasses}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          )}

          {/* Right Icon (custom) */}
          {rightIcon && !showPasswordToggle && (
            <div className={rightIconClasses} aria-hidden="true">
              {rightIcon}
            </div>
          )}

          {/* Error Icon */}
          {hasError && (
            <div className={`${rightIconClasses} text-red-500`} aria-hidden="true">
              <AlertCircle className="w-5 h-5" />
            </div>
          )}
        </div>

        {helperText && !hasError && (
          <p id={helperId} className="text-sm text-zinc-500">
            {helperText}
          </p>
        )}

        {hasError && (
          <p id={errorId} className="text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" aria-hidden="true" />
            <span>{error}</span>
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
