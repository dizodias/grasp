"use client";

import { ArrowRight, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import type { FormEvent } from "react";
import { useState, useEffect } from "react";
import { useLanguage, type LanguageCode } from "./LanguageContext";

const localizedLoadingPhrases: Record<LanguageCode, string[]> = {
  EN: [
    "Warming up AI engines...",
    "Watching video at 100x speed...",
    "Extracting the juice of knowledge...",
    "Reading between the lines of captions...",
    "Decoding the creator's tone...",
    "Teaching the robot your language...",
    "Calculating information density...",
    "Distilling actionable insights...",
    "Separating signal from noise...",
    "Compressing hours into seconds...",
    "Injecting context into the neural net...",
    "Decoding the presenter's sarcasm...",
    "Tuning the genius parameters...",
    "Fact-checking and cross-referencing...",
    "Synthesizing the video's wisdom...",
    "Negotiating with the YouTube algorithm...",
    "Pouring digital coffee...",
    "Aligning the AI chakras...",
    "Hunting for hidden keywords...",
    "Building mental maps in a split second...",
  ],
  PT: [
    "Aquecendo os motores da IA...",
    "Assistindo ao vídeo em velocidade 100x...",
    "Extraindo o suco do conhecimento...",
    "Lendo as entrelinhas das legendas...",
    "Traduzindo o sotaque do criador...",
    "Ensinando português para o robô...",
    "Calculando a densidade de informações...",
    "Destilando insights acionáveis...",
    "Separando o sinal do ruído...",
    "Compactando horas em segundos...",
    "Injetando contexto na rede neural...",
    "Decodificando o sarcasmo do apresentador...",
    "Ajustando os parâmetros de genialidade...",
    "Verificando fatos e métricas...",
    "Sintetizando a sabedoria do vídeo...",
    "Conversando com os servidores do Google...",
    "Bebendo café digital...",
    "Alinhando os chakras da inteligência artificial...",
    "Buscando as palavras-chave ocultas...",
    "Construindo mapas mentais em frações de segundo...",
  ],
  ES: [
    "Calentando motores de IA...",
    "Viendo el vídeo a velocidad 100x...",
    "Extrayendo el jugo del conocimiento...",
    "Leyendo entre líneas de los subtítulos...",
    "Traduciendo el tono del creador...",
    "Enseñando español al robot...",
    "Calculando la densidad de información...",
    "Destilando insights accionables...",
    "Separando la señal del ruido...",
    "Comprimiendo horas en segundos...",
    "Inyectando contexto en la red neuronal...",
    "Decodificando el sarcasmo del presentador...",
    "Ajustando los parámetros de genialidad...",
    "Verificando hechos y métricas...",
    "Sintetizando la sabiduría del vídeo...",
    "Negociando con el algoritmo de YouTube...",
    "Sirviendo café digital...",
    "Alineando los chakras de la IA...",
    "Buscando las palabras clave ocultas...",
    "Construyendo mapas mentales en fracciones de segundo...",
  ],
  DE: [
    "KI-Motoren aufwärmen...",
    "Video in 100-facher Geschwindigkeit ansehen...",
    "Saft des Wissens extrahieren...",
    "Zwischen den Zeilen der Untertitel lesen...",
    "Den Ton des Creators entschlüsseln...",
    "Dem Roboter Deutsch beibringen...",
    "Informationsdichte berechnen...",
    "Umsetzbare Erkenntnisse destillieren...",
    "Signal vom Rauschen trennen...",
    "Stunden in Sekunden komprimieren...",
    "Kontext ins neuronale Netz injizieren...",
    "Die Ironie des Präsentators decodieren...",
    "Genialitäts-Parameter justieren...",
    "Fakten und Metriken prüfen...",
    "Die Weisheit des Videos synthetisieren...",
    "Mit dem YouTube-Algorithmus verhandeln...",
    "Digitalen Kaffee einschenken...",
    "Die KI-Chakren ausrichten...",
    "Versteckte Schlüsselwörter jagen...",
    "Mentale Landkarten in Sekundenbruchteilen bauen...",
  ],
};

const COPY: Record<
  LanguageCode,
  {
    tagline: string;
    title: string;
    description: string;
    placeholder: string;
    button: string;
    loading: string;
    errorEmpty: string;
    errorGeneric: string;
  }
> = {
  EN: {
    tagline: "Your private YouTube distillates.",
    title: "Grasp",
    description: "Transform complex YouTube videos into clear, structured insight instantly.",
    placeholder: "Paste YouTube URL...",
    button: "Understand Video",
    loading: "Distilling...",
    errorEmpty: "Please paste a valid YouTube URL.",
    errorGeneric: "Something went wrong while summarizing this video.",
  },
  PT: {
    tagline: "Seus destilados privados do YouTube.",
    title: "Grasp",
    description: "Transforme vídeos complexos do YouTube em insight claro e estruturado na hora.",
    placeholder: "Cole a URL do YouTube...",
    button: "Entender vídeo",
    loading: "Destilando...",
    errorEmpty: "Cole uma URL válida do YouTube.",
    errorGeneric: "Algo deu errado ao resumir este vídeo.",
  },
  ES: {
    tagline: "Tus destilados privados de YouTube.",
    title: "Grasp",
    description: "Transforma vídeos complejos de YouTube en insight claro y estructurado al instante.",
    placeholder: "Pega la URL de YouTube...",
    button: "Entender vídeo",
    loading: "Destilando...",
    errorEmpty: "Pega una URL válida de YouTube.",
    errorGeneric: "Algo salió mal al resumir este vídeo.",
  },
  DE: {
    tagline: "Deine privaten YouTube-Destillate.",
    title: "Grasp",
    description: "Verwandle komplexe YouTube-Videos sofort in klare, strukturierte Erkenntnisse.",
    placeholder: "YouTube-URL einfügen...",
    button: "Video verstehen",
    loading: "Destillieren...",
    errorEmpty: "Bitte eine gültige YouTube-URL einfügen.",
    errorGeneric: "Beim Zusammenfassen dieses Videos ist etwas schiefgelaufen.",
  },
};

type ResultData = { summary: string; title: string; thumbnail: string };

export default function HomePage() {
  const { language } = useLanguage();
  const t = COPY[language];
  const phrases = localizedLoadingPhrases[language];

  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResultData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingPhrase, setLoadingPhrase] = useState(phrases[0] ?? "");

  useEffect(() => {
    if (!loading) return;
    const pickRandom = () =>
      setLoadingPhrase(phrases[Math.floor(Math.random() * phrases.length)] ?? "");
    pickRandom();
    const id = setInterval(pickRandom, 2000);
    return () => clearInterval(id);
  }, [loading, language]);

  const handleUnderstand = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!url.trim()) {
      setError(t.errorEmpty);
      setResult(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ url: url, language: language })
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

      setResult({
        summary: summaryText,
        title: (data.title as string) ?? "",
        thumbnail: (data.thumbnail as string) ?? ""
      });
    } catch (err) {
      console.error(err);
      setResult(null);
      setError(err instanceof Error ? err.message : t.errorGeneric);
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
        className="w-full max-w-2xl p-10 rounded-[2rem] glass-panel flex flex-col items-center text-center z-10"
      >
        <p className="text-sm text-slate-500 dark:text-gray-400 mb-2">{t.tagline}</p>
        <h1 className="text-6xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
          {t.title}
        </h1>
        <p className="text-lg text-slate-600 dark:text-gray-300 mb-8">{t.description}</p>

        <div className="flex flex-col sm:flex-row w-full gap-3 relative">
          <input
            type="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            disabled={loading}
            className="flex-1 glass-input rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-sky-300 dark:focus:ring-white/20 transition-all disabled:cursor-not-allowed disabled:opacity-60"
            placeholder={t.placeholder}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-white dark:bg-white text-black font-semibold px-8 py-4 rounded-2xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed shadow-lg"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
              </>
            ) : (
              <>
                <span>{t.button}</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key={loadingPhrase}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="mt-6 min-h-[2rem] text-sm text-slate-500 dark:text-slate-400 font-medium"
            >
              {loadingPhrase}
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      {error && (
        <div className="mt-6 w-full max-w-2xl rounded-2xl border border-red-500/20 bg-red-900/20 px-4 py-3 text-sm text-red-200 backdrop-blur-xl shadow-lg z-10">
          {error}
        </div>
      )}

      <AnimatePresence>
        {result && !error && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="mt-8 w-full max-w-3xl rounded-3xl glass-panel overflow-hidden px-0 py-0 text-left z-10"
          >
            <div className="p-6 sm:p-8">
              {result.thumbnail && (
                <div className="rounded-2xl overflow-hidden shadow-xl mb-6 bg-slate-200 dark:bg-slate-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={result.thumbnail}
                    alt=""
                    className="w-full aspect-video object-cover"
                  />
                </div>
              )}
              {result.title && (
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-6">
                  {result.title}
                </h2>
              )}
              <div className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-6 mb-3 first:mt-0">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mt-5 mb-2">
                        {children}
                      </h2>
                    ),
                    p: ({ children }) => (
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                        {children}
                      </p>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 space-y-1 mb-4">
                        {children}
                      </ul>
                    ),
                    li: ({ children }) => (
                      <li className="leading-relaxed">{children}</li>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-semibold text-slate-800 dark:text-slate-100">
                        {children}
                      </strong>
                    ),
                  }}
                >
                  {result.summary}
                </ReactMarkdown>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
