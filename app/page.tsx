"use client";

import { ArrowRight, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import type { FormEvent } from "react";
import { useState } from "react";

export default function HomePage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUnderstand = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!url.trim()) {
      setError("Please paste a valid YouTube URL.");
      setSummary(null);
      return;
    }

    setLoading(true);
    setError(null);

    // Choose endpoint based on environment
    const endpoint =
      process.env.NODE_ENV === "production"
        ? "/api/summarize"
        : "http://127.0.0.1:8000/api/summarize";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ url })
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const detail =
          (data && (data.detail as string | undefined)) ??
          "Unable to summarize this video. Please try another URL.";
        throw new Error(detail);
      }

      const summaryText = (data && (data.summary as string | undefined)) ?? "";
      if (!summaryText) {
        throw new Error("The backend returned an empty summary.");
      }

      setSummary(summaryText);
    } catch (err) {
      console.error(err);
      setSummary(null);
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while summarizing this video."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-60">
        <div className="mesh-gradient" />
      </div>

      <form
        onSubmit={handleUnderstand}
        className="w-full max-w-2xl p-10 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-2xl shadow-2xl flex flex-col items-center text-center z-10"
      >
        <p className="text-sm text-gray-400 mb-2">
          Your private YouTube distillates.
        </p>
        <h1 className="text-6xl font-bold tracking-tight text-white mb-4">
          Grasp
        </h1>
        <p className="text-lg text-gray-300 mb-8">
          Transform complex YouTube videos into clear, structured insight
          instantly.
        </p>

        <div className="flex flex-col sm:flex-row w-full gap-3 relative">
          <input
            type="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            disabled={loading}
            className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all disabled:cursor-not-allowed disabled:opacity-60"
            placeholder="Paste YouTube URL..."
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-white text-black font-semibold px-8 py-4 rounded-2xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <span>Distilling...</span>
                <Loader2 className="h-4 w-4 animate-spin" />
              </>
            ) : (
              <>
                <span>Understand Video</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-6 w-full max-w-2xl rounded-2xl border border-red-500/20 bg-red-900/20 px-4 py-3 text-sm text-red-200 backdrop-blur-xl shadow-lg z-10">
          {error}
        </div>
      )}

      {summary && !error && (
        <section className="mt-8 w-full max-w-3xl rounded-3xl bg-white/5 border border-white/10 backdrop-blur-2xl shadow-2xl px-6 py-6 sm:px-8 sm:py-8 text-left z-10">
          <div className="prose prose-invert max-w-none text-white/90">
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="text-2xl font-bold text-white mt-6 mb-3 first:mt-0">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-xl font-semibold text-slate-100 mt-5 mb-2">
                    {children}
                  </h2>
                ),
                p: ({ children }) => (
                  <p className="text-slate-300 leading-relaxed mb-3">{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside text-slate-300 space-y-1 mb-4">
                    {children}
                  </ul>
                ),
                li: ({ children }) => (
                  <li className="leading-relaxed">{children}</li>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-slate-100">
                    {children}
                  </strong>
                ),
              }}
            >
              {summary}
            </ReactMarkdown>
          </div>
        </section>
      )}
    </main>
  );
}
