"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useI18nStore, translations } from "@/lib/i18n";
import { useAuthStore } from "@/lib/auth";
import { SupportedLang } from "@/types";
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  Layers,
  Settings,
  Globe,
  Check,
  User as UserIcon,
  LogOut,
  LogIn,
  UserPlus,
  ShieldCheck,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { lang, setLang } = useI18nStore();
  const { user, initAuthFromStorage, logoutUser } = useAuthStore();
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    initAuthFromStorage();
  }, [initAuthFromStorage]);

  const navLinks = [
    { href: "/exams", label: "Simulasi Ujian", icon: GraduationCap },
    { href: "/drill", label: "Latihan Soal (Drill)", icon: Layers },
    { href: "/glossary", label: "Kamus Kanji IT", icon: BookOpen },
    { href: "/admin", label: "Admin Studio", icon: ShieldCheck, highlight: true },
  ];

  const languages: { code: SupportedLang; name: string; flag: string }[] = [
    { code: "id", name: "Bahasa Indonesia", flag: "🇮🇩" },
    { code: "en", name: "English (Global)", flag: "🇬🇧" },
    { code: "ja", name: "日本語 (Japanese)", flag: "🇯🇵" },
    { code: "vi", name: "Tiếng Việt (VN)", flag: "🇻🇳" },
  ];

  // Don't show public navbar on dedicated admin screens to keep workspace focused
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 font-bold text-white shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight text-zinc-900 dark:text-white">
              JITEC <span className="text-indigo-600 dark:text-indigo-400">Exam Hub</span>
            </span>
            <span className="text-[10px] text-zinc-400 -mt-1 font-medium">
              情報処理技術者試験 Prep
            </span>
          </div>
        </Link>

        {/* Center Nav Items */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                  isActive
                    ? item.highlight
                      ? "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                      : "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: Language Selector & User Auth Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setLangMenuOpen(!langMenuOpen);
                setUserMenuOpen(false);
              }}
              className="flex items-center gap-1.5 rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-semibold text-zinc-800 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 cursor-pointer"
            >
              <Globe className="h-3.5 w-3.5 text-indigo-600" />
              <span>{languages.find((l) => l.code === lang)?.flag}</span>
              <span className="uppercase text-[11px] font-bold">{lang}</span>
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-zinc-200 bg-white p-1.5 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 z-50">
                <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Pilih Bahasa UI & Soal:
                </div>
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLang(l.code);
                      setLangMenuOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-colors cursor-pointer ${
                      lang === l.code
                        ? "bg-indigo-50 font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                        : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{l.flag}</span>
                      <span>{l.name}</span>
                    </span>
                    {lang === l.code && <Check className="h-3.5 w-3.5 text-indigo-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Auth Section */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => {
                  setUserMenuOpen(!userMenuOpen);
                  setLangMenuOpen(false);
                }}
                className="flex items-center gap-2 rounded-2xl border border-indigo-200 bg-indigo-50/70 py-1.5 px-3 text-xs font-bold text-indigo-900 dark:border-indigo-900/50 dark:bg-indigo-950/40 dark:text-indigo-200 cursor-pointer"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-white font-bold text-[10px]">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[100px] truncate hidden sm:inline">{user.name}</span>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-zinc-200 bg-white p-2 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 z-50">
                  <div className="border-b border-zinc-100 px-3 py-2 dark:border-zinc-800">
                    <div className="font-bold text-xs text-zinc-900 dark:text-white truncate">
                      {user.name}
                    </div>
                    <div className="text-[11px] text-zinc-400 truncate">{user.email}</div>
                    <div className="mt-1 inline-block rounded-full bg-indigo-50 px-2 py-0.5 text-[9px] font-bold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                      Target: {user.target_exam || "FE"}
                    </div>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
                    >
                      <UserIcon className="h-4 w-4 text-indigo-600" />
                      <span>Profil & Riwayat Ujian</span>
                    </Link>
                  </div>

                  <div className="border-t border-zinc-100 pt-1 dark:border-zinc-800">
                    <button
                      onClick={() => {
                        logoutUser();
                        setUserMenuOpen(false);
                        router.push("/login");
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Keluar (Logout)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <Link
                href="/login"
                className="flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-bold text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Masuk</span>
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-1 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-500 active:scale-95"
              >
                <UserPlus className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Daftar</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
