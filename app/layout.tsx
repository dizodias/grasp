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
            </div>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
