"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, ShieldCheck, Globe, Heart, CheckCircle2, ArrowRight } from "lucide-react";

export function Footer() {
  const pathname = usePathname();

  // Don't show public footer on admin layout
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="border-t border-zinc-200/80 bg-zinc-50/70 dark:border-zinc-800 dark:bg-zinc-950/70 text-zinc-600 dark:text-zinc-400 text-xs">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="space-y-3 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-indigo-600 font-bold text-white shadow-md shadow-indigo-500/20">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <span className="font-extrabold text-sm text-zinc-900 dark:text-white">
                  JITEC <span className="text-indigo-600 dark:text-indigo-400">Exam Hub</span>
                </span>
                <span className="block text-[10px] text-zinc-400">情報処理技術者試験 Prep Platform</span>
              </div>
            </Link>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-sm">
              Platform persiapan sertifikasi IT nasional Jepang (IPA) untuk engineer internasional. Menyediakan simulasi CBT berskala resmi, bank soal kakomon orisinal, dan glosarium istilah teknis 4 bahasa.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Semua Sistem API Beroperasi Normal (99.9% Uptime)</span>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-2.5">
            <div className="font-bold text-xs text-zinc-900 dark:text-white uppercase tracking-wider">
              Produk & Fitur
            </div>
            <ul className="space-y-2">
              <li>
                <Link href="/exams" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  Katalog Lembar Ujian
                </Link>
              </li>
              <li>
                <Link href="/drill" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  Latihan Tematik (Drill)
                </Link>
              </li>
              <li>
                <Link href="/glossary" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  Kamus Kanji IT & Furigana
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  Riwayat Skor & Analitik
                </Link>
              </li>
            </ul>
          </div>

          {/* Certifications Pathway */}
          <div className="space-y-2.5">
            <div className="font-bold text-xs text-zinc-900 dark:text-white uppercase tracking-wider">
              Level Sertifikasi IPA
            </div>
            <ul className="space-y-2">
              <li>
                <Link href="/exams?level=level1" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  Level 1: IT Passport (IP)
                </Link>
              </li>
              <li>
                <Link href="/exams?level=level2" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  Level 2: Fundamental IT (FE)
                </Link>
              </li>
              <li>
                <Link href="/exams?level=level3" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  Level 3: Applied IT (AP)
                </Link>
              </li>
              <li>
                <Link href="/exams?level=level4" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  Level 4: Database Specialist (DB)
                </Link>
              </li>
            </ul>
          </div>

          {/* Admin & Security */}
          <div className="space-y-2.5">
            <div className="font-bold text-xs text-zinc-900 dark:text-white uppercase tracking-wider">
              Pengelola & Institusi
            </div>
            <ul className="space-y-2">
              <li>
                <Link href="/admin/login" className="flex items-center gap-1 text-rose-600 hover:underline">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Admin Studio Login</span>
                </Link>
              </li>
              <li>
                <Link href="/admin/extractor" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  PDF & AI Ingestion
                </Link>
              </li>
              <li>
                <Link href="/admin/settings" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  Pengaturan API & Sistem
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-200/80 pt-6 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-4 text-[11px] text-zinc-400">
          <div>
            © {new Date().getFullYear()} JITEC Exam Hub Platform. Seluruh materi soal adalah hak cipta Information-technology Promotion Agency (IPA) Jepang.
          </div>
          <div className="flex items-center gap-4">
            <span>Standar IPA METI Japan</span>
            <span>•</span>
            <span>Multilingual Candidate Hub</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
