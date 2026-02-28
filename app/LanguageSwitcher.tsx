"use client";

import { useLanguage, type LanguageCode } from "./LanguageContext";
import ThemeToggle from "./ThemeToggle";

const OPTIONS: { value: LanguageCode; label: string }[] = [
  { value: "EN", label: "EN" },
  { value: "PT", label: "PT" },
  { value: "ES", label: "ES" },
  { value: "DE", label: "DE" },
];

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-end px-4 py-4 sm:px-6 sm:py-5">
      <div className="pointer-events-auto flex items-center gap-2 sm:gap-3">
        <ThemeToggle />
        <div className="flex items-center">
          <select
            aria-label="Select language"
            value={language}
            onChange={(e) => setLanguage(e.target.value as LanguageCode)}
            className="
              appearance-none
              bg-slate-900/60
              backdrop-blur-2xl
              ring-1 ring-white/10
              rounded-full
              px-4 py-1.5
              text-xs sm:text-sm
              text-slate-50
              border-none
              shadow-[0_2px_8px_0_rgba(0,0,0,0.12)]
              transition-all duration-300
              focus:outline-none focus:ring-2 focus:ring-white/20
              pr-8
            "
            style={{
              WebkitAppearance: "none",
              MozAppearance: "none",
              appearance: "none",
              backgroundImage: `url("data:image/svg+xml,%3Csvg fill='none' height='14' width='14' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath stroke='%23f1f5f9' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
              backgroundPosition: "right 1rem center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "1rem 1rem",
            }}
          >
            {OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="text-slate-900">
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
}
