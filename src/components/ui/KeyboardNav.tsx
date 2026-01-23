"use client";

import { useEffect, useRef, useCallback, ReactNode, KeyboardEvent } from "react";

// ============================================
// Types and Interfaces
// ============================================

export type KeyHandler = (event: KeyboardEvent) => void;
export type KeyboardScope = "global" | "modal" | "form" | "list" | "custom";

interface KeyboardShortcut {
  key: string;
  handler: KeyHandler;
  description?: string;
  preventDefault?: boolean;
  scope?: KeyboardScope;
}

interface UseKeyboardNavProps {
  shortcuts?: KeyboardShortcut[];
  scope?: KeyboardScope;
  enabled?: boolean;
}

interface UseKeyboardListNavProps {
  itemCount: number;
  onSelect?: (index: number) => void;
  onCancel?: () => void;
  enabled?: boolean;
  loop?: boolean;
  orientation?: "vertical" | "horizontal" | "both";
}

// ============================================
// Global Keyboard Navigation Hook
// ============================================

/**
 * Hook for handling global keyboard shortcuts
 * @param shortcuts - Array of keyboard shortcuts to register
 * @param scope - Navigation scope for isolation
 * @param enabled - Whether shortcuts are active
 */
export function useKeyboardNav({
  shortcuts = [],
  scope = "global",
  enabled = true,
}: UseKeyboardNavProps) {
  const activeScope = useRef<Set<KeyboardScope>>(new Set(["global"]));

  useEffect(() => {
    if (!enabled) return;

    // Add this scope to active scopes
    activeScope.current.add(scope);

    const handleKeyDown = (event: KeyboardEvent) => {
      // Only process if this scope is active
      if (!activeScope.current.has(scope)) return;

      for (const shortcut of shortcuts) {
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();

        // Check scope match
        if (shortcut.scope && shortcut.scope !== scope) continue;

        if (keyMatch) {
          if (shortcut.preventDefault !== false) {
            event.preventDefault();
          }
          shortcut.handler(event);
          break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown as any);

    return () => {
      document.removeEventListener("keydown", handleKeyDown as any);
      activeScope.current.delete(scope);
    };
  }, [shortcuts, scope, enabled]);
}

// ============================================
// List Navigation Hook
// ============================================

/**
 * Hook for keyboard navigation through lists (Tab, arrows, Enter, Escape)
 */
export function useKeyboardListNav({
  itemCount,
  onSelect,
  onCancel,
  enabled = true,
  loop = true,
  orientation = "vertical",
}: UseKeyboardListNavProps) {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const itemsRef = useRef<(HTMLElement | null)[]>([]);

  const navigate = useCallback((direction: "next" | "previous" | "first" | "last") => {
    if (!enabled) return;

    setSelectedIndex((current) => {
      let newIndex: number;

      switch (direction) {
        case "next":
          newIndex = loop
            ? (current + 1) % itemCount
            : Math.min(current + 1, itemCount - 1);
          break;
        case "previous":
          newIndex = loop
            ? (current - 1 + itemCount) % itemCount
            : Math.max(current - 1, 0);
          break;
        case "first":
          newIndex = 0;
          break;
        case "last":
          newIndex = itemCount - 1;
          break;
        default:
          return current;
      }

      // Focus the new item
      itemsRef.current[newIndex]?.focus();
      return newIndex;
    });
  }, [enabled, itemCount, loop]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    switch (event.key) {
      case "ArrowDown":
        if (orientation === "vertical" || orientation === "both") {
          event.preventDefault();
          navigate("next");
        }
        break;
      case "ArrowUp":
        if (orientation === "vertical" || orientation === "both") {
          event.preventDefault();
          navigate("previous");
        }
        break;
      case "ArrowRight":
        if (orientation === "horizontal" || orientation === "both") {
          event.preventDefault();
          navigate("next");
        }
        break;
      case "ArrowLeft":
        if (orientation === "horizontal" || orientation === "both") {
          event.preventDefault();
          navigate("previous");
        }
        break;
      case "Home":
        event.preventDefault();
        navigate("first");
        break;
      case "End":
        event.preventDefault();
        navigate("last");
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        onSelect?.(selectedIndex);
        break;
      case "Escape":
        event.preventDefault();
        onCancel?.();
        break;
    }
  }, [enabled, orientation, navigate, selectedIndex, onSelect, onCancel]);

  const setItemRef = useCallback((index: number, element: HTMLElement | null) => {
    itemsRef.current[index] = element;
  }, []);

  return {
    selectedIndex,
    setSelectedIndex,
    handleKeyDown,
    setItemRef,
    itemsRef,
  };
}

// ============================================
// Trap Focus Hook (for modals)
// ============================================

/**
 * Hook to trap focus within a container (for modals, dialogs)
 */
export function useFocusTrap(enabled: boolean = true) {
  const containerRef = useRef<HTMLElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const container = containerRef.current;
    if (!container) return;

    // Store the previously focused element
    previousActiveElement.current = document.activeElement as HTMLElement;

    // Get all focusable elements within the container
    const focusableElements = container.querySelectorAll<
      HTMLElement
    >(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus the first element
    firstElement?.focus();

    const handleTab = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;

      // If shift + tab on first element, move to last
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      }
      // If tab on last element, move to first
      else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        // Return focus to previous element
        previousActiveElement.current?.focus();
      }
    };

    container.addEventListener("keydown", handleTab as any);
    container.addEventListener("keydown", handleEscape as any);

    return () => {
      container.removeEventListener("keydown", handleTab as any);
      container.removeEventListener("keydown", handleEscape as any);

      // Restore focus when trap is removed
      previousActiveElement.current?.focus();
    };
  }, [enabled]);

  return containerRef;
}

// ============================================
// Shortcut Indicator Component
// ============================================

interface KeyboardShortcutProps {
  keys: string | string[];
  description?: string;
  className?: string;
}

/**
 * Visual display of keyboard shortcuts
 */
export function KeyboardShortcut({
  keys,
  description,
  className = "",
}: KeyboardShortcutProps) {
  const keyArray = Array.isArray(keys) ? keys : [keys];

  return (
    <div className={`flex items-center gap-2 ${className}`.trim()}>
      <div className="flex items-center gap-1" aria-hidden="true">
        {keyArray.map((key, i) => (
          <React.Fragment key={key}>
            {i > 0 && <span className="text-zinc-600 text-xs">+</span>}
            <kbd className="px-2 py-1 text-xs font-mono rounded bg-zinc-800 border border-zinc-700 text-zinc-300 shadow-sm">
              {key}
            </kbd>
          </React.Fragment>
        ))}
      </div>
      {description && (
        <span className="text-sm text-zinc-500">{description}</span>
      )}
    </div>
  );
}

// ============================================
// Keyboard Accessible Button Component
// ============================================

interface KeyboardButtonProps {
  children: ReactNode;
  onClick?: () => void;
  onEnter?: () => void;
  onEscape?: () => void;
  disabled?: boolean;
  className?: string;
  shortcut?: string;
  ariaLabel?: string;
}

/**
 * Button with enhanced keyboard accessibility
 */
export function KeyboardButton({
  children,
  onClick,
  onEnter,
  onEscape,
  disabled = false,
  className = "",
  shortcut,
  ariaLabel,
}: KeyboardButtonProps) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (disabled) return;

      switch (event.key) {
        case "Enter":
        case " ":
          event.preventDefault();
          onEnter?.();
          onClick?.();
          break;
        case "Escape":
          event.preventDefault();
          onEscape?.();
          break;
        default:
          if (shortcut && event.key.toLowerCase() === shortcut.toLowerCase()) {
            event.preventDefault();
            onClick?.();
          }
      }
    },
    [disabled, onClick, onEnter, onEscape, shortcut]
  );

  return (
    <button
      onClick={onClick}
      onKeyDown={handleKeyDown as any}
      disabled={disabled}
      className={className}
      aria-label={ariaLabel}
    >
      {children}
      {shortcut && (
        <span className="ml-2 text-xs text-zinc-500" aria-hidden="true">
          {shortcut}
        </span>
      )}
    </button>
  );
}

// ============================================
// Keyboard Navigation Provider
// ============================================

interface KeyboardNavContextValue {
  registerShortcut: (shortcut: KeyboardShortcut) => void;
  unregisterShortcut: (key: string) => void;
  shortcuts: KeyboardShortcut[];
}

const KeyboardNavContext = React.createContext<KeyboardNavContextValue | null>(null);

interface KeyboardNavProviderProps {
  children: ReactNode;
  shortcuts?: KeyboardShortcut[];
}

/**
 * Context provider for keyboard navigation shortcuts
 */
export function KeyboardNavProvider({
  children,
  shortcuts: initialShortcuts = [],
}: KeyboardNavProviderProps) {
  const [shortcuts, setShortcuts] = React.useState<KeyboardShortcut[]>(initialShortcuts);

  const registerShortcut = useCallback((shortcut: KeyboardShortcut) => {
    setShortcuts((prev) => [...prev, shortcut]);
  }, []);

  const unregisterShortcut = useCallback((key: string) => {
    setShortcuts((prev) => prev.filter((s) => s.key !== key));
  }, []);

  return (
    <KeyboardNavContext.Provider
      value={{ registerShortcut, unregisterShortcut, shortcuts }}
    >
      {children}
    </KeyboardNavContext.Provider>
  );
}

// ============================================
// Common Shortcuts Component
// ============================================

interface CommonShortcutsProps {
  onClose?: () => void;
  onSave?: () => void;
  onSearch?: () => void;
  onRefresh?: () => void;
  onHelp?: () => void;
  className?: string;
}

/**
 * Display common keyboard shortcuts
 */
export function CommonShortcuts({
  onClose,
  onSave,
  onSearch,
  onRefresh,
  onHelp,
  className = "",
}: CommonShortcutsProps) {
  const commonShortcuts: { keys: string[]; action: string; handler?: () => void }[] = [
    { keys: ["Esc"], action: "Close", handler: onClose },
    { keys: ["Ctrl", "S"], action: "Save", handler: onSave },
    { keys: ["/"], action: "Search", handler: onSearch },
    { keys: ["F5"], action: "Refresh", handler: onRefresh },
    { keys: ["?"], action: "Help", handler: onHelp },
  ];

  const activeShortcuts = commonShortcuts.filter((s) => s.handler);

  if (activeShortcuts.length === 0) return null;

  return (
    <div className={`p-4 rounded-lg bg-zinc-900/50 border border-zinc-800 ${className}`.trim()}>
      <h4 className="text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wide">
        Keyboard Shortcuts
      </h4>
      <div className="grid grid-cols-2 gap-2">
        {activeShortcuts.map((shortcut) => (
          <KeyboardShortcut
            key={shortcut.action}
            keys={shortcut.keys}
            description={shortcut.action}
          />
        ))}
      </div>
    </div>
  );
}

// ============================================
// React import for component internals
// ============================================

import React from "react";
