"use client";

import { useEffect, useState } from "react";
import { GlossaryTerm, SupportedLang } from "@/types";
import { fetchGlossary, searchGlossary } from "@/lib/api";
import { BookOpen, Search, Sparkles, Filter, Bookmark, Layers, Globe } from "lucide-react";

export default function GlossaryPage() {
  const [terms, setTerms] = useState<GlossaryTerm[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [targetLang, setTargetLang] = useState<SupportedLang>("id");

  useEffect(() => {
    fetchGlossary()
      .then((data) => {
        setTerms(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      const data = await fetchGlossary();
      setTerms(data);
      return;
    }
    setLoading(true);
    const results = await searchGlossary(query);
    setTerms(results);
    setLoading(false);
  };

  const categories = [
    { id: "all", label: "Semua Kategori" },
    { id: "Database", label: "Database" },
    { id: "Security", label: "Keamanan (Security)" },
    { id: "Computer Systems", label: "Sistem & Hardware" },
    { id: "Algorithms", label: "Algoritma & Struktur Data" },
    { id: "Management", label: "Manajemen & Rekayasa" },
  ];

  const filteredTerms = selectedCategory === "all"
    ? terms
    : terms.filter((t) => t.category.toLowerCase().includes(selectedCategory.toLowerCase()));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      {/* Header Banner */}
      <div className="rounded-3xl border border-zinc-200 bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 p-8 text-white shadow-xl dark:border-zinc-800">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-indigo-500/20 px-3 py-1 font-bold text-xs text-indigo-300">
              Kamus Kanji IT & Glosarium Multibahasa
            </span>
          </div>
          <h1 className="mt-3 font-extrabold text-3xl sm:text-4xl tracking-tight">
            Glosarium Kanji & Kosakata JITEC
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-zinc-300 leading-relaxed">
            Daftar istilah teknis esensial yang sering muncul pada lembar ujian IPA JITEC. Dilengkapi cara baca Furigana, padanan istilah internasional (English), serta terjemahan Bahasa Indonesia dan Tiếng Việt.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mt-6 flex max-w-xl items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari kanji (稼働率), furigana (かどうりつ), atau istilah (Availability)..."
              className="w-full rounded-2xl border border-white/20 bg-white/10 py-3 pl-10 pr-4 text-xs text-white placeholder-zinc-400 backdrop-blur-md focus:border-indigo-400 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="rounded-2xl bg-indigo-600 px-5 py-3 font-semibold text-xs text-white shadow-md hover:bg-indigo-500 active:scale-95"
          >
            Cari
          </button>
        </form>
      </div>

      {/* Category and Language Filter Pills */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 pb-4 dark:border-zinc-800">
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                selectedCategory === cat.id
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-white text-zinc-600 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 p-1 dark:border-zinc-700 dark:bg-zinc-800">
          <span className="px-2 text-[11px] font-bold text-zinc-400 uppercase">Bahasa Definisi:</span>
          <button
            onClick={() => setTargetLang("id")}
            className={`rounded-lg px-2.5 py-1 text-xs font-bold cursor-pointer ${
              targetLang === "id" ? "bg-indigo-600 text-white" : "text-zinc-600 hover:bg-zinc-200 dark:text-zinc-300"
            }`}
          >
            ID
          </button>
          <button
            onClick={() => setTargetLang("en")}
            className={`rounded-lg px-2.5 py-1 text-xs font-bold cursor-pointer ${
              targetLang === "en" ? "bg-indigo-600 text-white" : "text-zinc-600 hover:bg-zinc-200 dark:text-zinc-300"
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setTargetLang("vi")}
            className={`rounded-lg px-2.5 py-1 text-xs font-bold cursor-pointer ${
              targetLang === "vi" ? "bg-indigo-600 text-white" : "text-zinc-600 hover:bg-zinc-200 dark:text-zinc-300"
            }`}
          >
            VI
          </button>
        </div>
      </div>

      {/* Glossary Cards Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          [1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-60 animate-pulse rounded-3xl bg-zinc-200 dark:bg-zinc-800" />
          ))
        ) : filteredTerms.length === 0 ? (
          <div className="col-span-full py-16 text-center text-zinc-500">
            <BookOpen className="mx-auto h-12 w-12 text-zinc-400" />
            <p className="mt-3 font-semibold text-sm">Tidak ada kosakata yang cocok dengan pencarian.</p>
          </div>
        ) : (
          filteredTerms.map((term) => {
            const defText = targetLang === "en"
              ? term.definition_en || term.definition_id
              : targetLang === "vi"
              ? term.definition_vi || term.definition_id
              : term.definition_id;

            const termTranslated = targetLang === "en"
              ? term.term_en
              : targetLang === "vi"
              ? term.term_vi || term.term_en
              : term.term_id;

            return (
              <div
                key={term.id}
                className="flex flex-col justify-between rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:border-indigo-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-indigo-50 px-3 py-1 font-bold text-[11px] text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                      {term.category}
                    </span>
                    <span className="font-mono text-xs text-zinc-400">
                      {term.romaji}
                    </span>
                  </div>

                  {/* Main Kanji & Furigana */}
                  <div className="mt-4">
                    <ruby className="font-black text-2xl tracking-wide text-zinc-900 dark:text-white">
                      {term.term_ja}
                      <rt className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                        {term.reading_furigana}
                      </rt>
                    </ruby>
                    <div className="mt-1 font-bold text-sm text-indigo-600 dark:text-indigo-400">
                      {term.term_en}
                    </div>
                    <div className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                      {termTranslated}
                    </div>
                  </div>

                  {/* Definition */}
                  <div className="mt-4 space-y-2 border-t border-zinc-100 pt-3 dark:border-zinc-800">
                    <p className="text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                      {defText}
                    </p>
                    <p className="rounded-xl bg-zinc-50 p-2.5 text-[11px] text-zinc-500 leading-relaxed italic dark:bg-zinc-800/50">
                      <span className="font-bold not-italic mr-1 text-[10px] text-zinc-400">JA:</span>&quot;{term.definition_ja}&quot;
                    </p>
                  </div>
                </div>

                {/* Context sentence */}
                {term.example_sentence_ja && (
                  <div className="mt-4 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-3 text-[11px] text-indigo-950 dark:border-indigo-950 dark:bg-indigo-950/20 dark:text-indigo-300">
                    <div className="font-bold">Contoh Konteks Soal:</div>
                    <div className="mt-1">{term.example_sentence_ja}</div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
