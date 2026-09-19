"use client";
import { useTheme } from "@/contexts/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Sun, Moon, Zap, Waves } from "lucide-react";

const themes = [
  { id: "dark", label: "Koyu", icon: Moon, color: "#1a1a1a" },
  { id: "light", label: "Açık", icon: Sun, color: "#f0f0f0" },
  { id: "neon", label: "Neon", icon: Zap, color: "#b026ff" },
  { id: "blue", label: "Mavi", icon: Waves, color: "#4ea8ff" },
] as const;

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const current = themes.find((t) => t.id === theme) || themes[0];
  const CurrentIcon = current.icon;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-label="Tema değiştir"
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:opacity-80"
        style={{
          background: "var(--glass)",
          border: "1px solid var(--glass-border)",
          color: "var(--text-muted)",
        }}
      >
        <div
          className="w-3 h-3 rounded-full"
          style={{ background: current.color }}
        />
        <CurrentIcon size={14} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 8 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 p-1.5 rounded-xl z-40 min-w-36"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-lg)",
              }}
            >
              {themes.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => { setTheme(t.id); setOpen(false); }}
                    className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm transition-all duration-150"
                    style={{
                      background: theme === t.id ? "var(--surface-hover)" : "transparent",
                      color: theme === t.id ? "var(--text)" : "var(--text-muted)",
                    }}
                  >
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ background: t.color }}
                    />
                    <Icon size={13} />
                    <span>{t.label}</span>
                    {theme === t.id && (
                      <div
                        className="ml-auto w-1.5 h-1.5 rounded-full"
                        style={{ background: "var(--accent)" }}
                      />
                    )}
                  </button>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
