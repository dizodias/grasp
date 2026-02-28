"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type LanguageCode = "EN" | "PT" | "ES" | "DE";

type LanguageContextValue = {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
};

const defaultContext: LanguageContextValue = {
  language: "EN",
  setLanguage: () => {},
};

const LanguageContext = createContext<LanguageContextValue>(defaultContext);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>("EN");
  const setLanguage = useCallback((lang: LanguageCode) => {
    setLanguageState(lang);
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    return defaultContext;
  }
  return ctx;
}
