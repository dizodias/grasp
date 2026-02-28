import type { Metadata } from "next";
import "./globals.css";
import { ReactNode } from "react";
import { LanguageProvider } from "./LanguageContext";
import { ThemeProvider } from "./ThemeContext";
import LanguageSwitcher from "./LanguageSwitcher";

export const metadata: Metadata = {
  title: "Grasp",
  description: "Grasp – ultra-premium YouTube understanding experience"
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('grasp-theme');document.documentElement.classList.toggle('dark',t!=='light');})();`
          }}
        />
      </head>
      <body className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-50 antialiased">
        <div className="mesh-gradient" aria-hidden="true" />
        <ThemeProvider>
          <LanguageProvider>
            <div className="relative flex min-h-screen flex-col">
              <LanguageSwitcher />

              <main className="relative flex min-h-screen flex-col">
                {children}
              </main>

              <footer className="relative z-10 py-4 px-4 text-center">
                <p className="text-[11px] text-slate-400 dark:text-slate-500 max-w-xl mx-auto">
                  Note: In production (Vercel), YouTube transcript scraping is simulated due to IP provider restrictions. Run locally for full live features.
                </p>
              </footer>
            </div>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
