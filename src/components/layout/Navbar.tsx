"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SupportedLang } from "@/types";
import { UI_TRANSLATIONS } from "@/lib/i18n";
import {
  GraduationCap,
  Compass,
  BookOpen,
  Settings,
  Sparkles,
  Globe,
  Check,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const [lang, setLang] = useState<SupportedLang>("id");
  const [isOpenLang, setIsOpenLang] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("jitec_lang") as SupportedLang;
    if (saved && ["id", "en", "ja", "vi"].includes(saved)) {
      setLang(saved);
    }
  }, []);

  const handleSelectLang = (newLang: SupportedLang) => {
    setLang(newLang);
    localStorage.setItem("jitec_lang", newLang);
    setIsOpenLang(false);
    // Dispatch custom event for reactive language updates
    window.dispatchEvent(new Event("jitec_lang_change"));
  };

  const t = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.id;

  const languages = [
    { code: "id", label: "Bahasa Indonesia", flag: "🇮🇩" },
    { code: "en", label: "English (Global)", flag: "🇬🇧" },
    { code: "ja", label: "日本語 (Japanese)", flag: "🇯🇵" },
    { code: "vi", label: "Tiếng Việt", flag: "🇻🇳" },
  ];

  const navItems = [
    { href: "/exams", label: t.navExams, icon: GraduationCap },
    { href: "/drill", label: t.navDrill, icon: Compass },
    { href: "/glossary", label: t.navGlossary, icon: BookOpen },
    { href: "/admin/extractor", label: t.navAdmin, icon: Settings, highlight: true },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/90 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-rose-500 text-white shadow-md shadow-indigo-500/20">
            <span className="font-bold text-lg tracking-wider">J</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight text-zinc-900 dark:text-white">JITEC</span>
              <span className="rounded bg-indigo-100 px-1.5 py-0.5 font-bold text-[10px] text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400">HUB</span>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">情報処理技術者試験 Prep</p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-all ${
                  item.highlight
                    ? isActive
                      ? "bg-rose-600 text-white shadow-sm"
                      : "bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-900/50"
                    : isActive
                    ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800/60 dark:hover:text-white"
                }`}
              >
                <Icon className={`h-4 w-4 ${item.highlight && !isActive ? "text-rose-600 dark:text-rose-400" : ""}`} />
                <span>{item.label}</span>
                {item.highlight && (
                  <span className="ml-0.5 rounded-full bg-rose-500/20 px-1.5 py-0.2 text-[9px] font-bold text-rose-600 dark:text-rose-300">
                    PDF Studio
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2.5">
          {/* Global Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsOpenLang(!isOpenLang)}
              className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 text-xs font-semibold text-zinc-700 shadow-sm transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
            >
              <Globe className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>{languages.find((l) => l.code === lang)?.flag}</span>
              <span className="hidden sm:inline uppercase">{lang}</span>
            </button>

            {isOpenLang && (
              <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-zinc-200 bg-white p-1.5 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 z-50">
                <div className="px-2.5 py-1 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  Pilih Bahasa Antarmuka
                </div>
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => handleSelectLang(l.code as SupportedLang)}
                    className={`flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-xs transition-colors ${
                      lang === l.code
                        ? "bg-indigo-50 font-bold text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300"
                        : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{l.flag}</span>
                      <span>{l.label}</span>
                    </span>
                    {lang === l.code && <Check className="h-3.5 w-3.5 text-indigo-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/exams"
            className="hidden sm:flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm shadow-indigo-500/30 transition-all hover:bg-indigo-500 active:scale-95"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>{t.startSimulation}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
