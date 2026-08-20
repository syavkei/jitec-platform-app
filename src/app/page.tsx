"use client";

import Link from "next/link";
import {
  GraduationCap,
  Sparkles,
  ShieldCheck,
  Cpu,
  Database,
  Network,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Settings,
  Layers,
} from "lucide-react";

export default function HomePage() {
  const levels = [
    {
      level: "Level 1",
      code: "IP",
      title: "IT Passport Examination (ITパスポート)",
      desc: "Fondasi ilmu komputer, literasi digital, keamanan informasi dasar, dan etika bisnis IT.",
      color: "from-blue-500 to-cyan-500",
      badge: "Dasar & Non-IT",
      link: "/exams?level=level1",
    },
    {
      level: "Level 2",
      code: "FE / SG",
      title: "Fundamental IT Engineer (基本情報技術者)",
      desc: "Standar industri untuk junior software engineer di Jepang. Mencakup Kamoku A (Teori) dan Kamoku B (Algoritma Pseudocode).",
      color: "from-indigo-600 to-violet-600",
      badge: "Paling Populer",
      link: "/exams?level=level2",
    },
    {
      level: "Level 3",
      code: "AP",
      title: "Applied IT Engineer (応用情報技術者)",
      desc: "Untuk engineer menengah ke atas. Menguji arsitektur sistem komprehensif, desain basis data, dan manajemen proyek.",
      color: "from-purple-600 to-pink-600",
      badge: "Mid-Senior Standard",
      link: "/exams?level=level3",
    },
    {
      level: "Level 4",
      code: "DB / SC / NW",
      title: "Advanced Specialist (高度情報処理技術者)",
      desc: "Sertifikasi spesialisasi murni tingkat tinggi: Database Specialist (DB), Registered Security Specialist (SC), dan Network (NW).",
      color: "from-rose-600 to-amber-600",
      badge: "Spesialisasi Lanjut",
      link: "/exams?level=level4",
    },
  ];

  const features = [
    {
      title: "Simulasi Ujian CBT Resmi",
      desc: "Timer hitung mundur real-time, palet nomor soal, fitur ragu-ragu (flag), dan kalkulasi skor kelulusan otomatis skala 1000 poin.",
      icon: GraduationCap,
    },
    {
      title: "Bilingual & IT Kanji Hover Tooltip",
      desc: "Arahkan kursor pada istilah kanji IT Jepang (misal: 稼働率, 脆弱性, 排他制御) untuk melihat Furigana bacaan dan arti dalam bahasa Indonesia.",
      icon: BookOpen,
    },
    {
      title: "Admin PDF Ingestion Studio",
      desc: "Ekstraksi otomatis soal dan kunci jawaban dari berkas kakomon PDF resmi IPA dengan antarmuka split-screen verification.",
      icon: Settings,
    },
    {
      title: "Pembahasan Berbasis Saiten Kouhyou",
      desc: "Dilengkapi analisis mendalam dan poin evaluasi resmi dari tim penguji IPA Jepang (採点講評) untuk memahami ekspektasi jawaban.",
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-zinc-200 bg-gradient-to-b from-indigo-50/50 via-white to-zinc-50 pt-16 pb-20 dark:border-zinc-800 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/80 px-3.5 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Platform Latihan JITEC & IPA 過去問題 Indonesia</span>
            </div>

            <h1 className="mt-6 font-extrabold text-4xl tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl dark:text-white">
              Kuasai Ujian Sertifikasi IT Nasional Jepang{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-600 bg-clip-text text-transparent">
                (情報処理技術者試験)
              </span>
            </h1>

            <p className="mt-6 text-base sm:text-lg leading-relaxed text-zinc-600 dark:text-zinc-300">
              Persiapkan diri Anda untuk karier IT di Jepang. Latihan soal resmi dari Level 1 (IT Passport) hingga Level 4 (Database Specialist) dengan simulasi CBT interaktif dan kamus kanji teknis bilingual.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/exams"
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 font-bold text-sm text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-500 active:scale-95"
              >
                <GraduationCap className="h-5 w-5" />
                <span>Mulai Simulasi Ujian</span>
              </Link>
              <Link
                href="/admin/extractor"
                className="flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-6 py-3.5 font-semibold text-sm text-zinc-700 shadow-sm transition-all hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
              >
                <Settings className="h-4 w-4 text-rose-600" />
                <span>Buka PDF Extractor Studio</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Certification Levels Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <h2 className="font-bold text-2xl tracking-tight text-zinc-900 sm:text-3xl dark:text-white">
            Hierarki Sertifikasi JITEC (Skill Level 1–4)
          </h2>
          <p className="mt-2 max-w-xl text-xs sm:text-sm text-zinc-500">
            Pilih tingkatan ujian yang sesuai dengan target kompetensi dan jalur karier profesional Anda di industri teknologi Jepang.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          {levels.map((lvl) => (
            <Link
              key={lvl.code}
              href={lvl.link}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr ${lvl.color} font-black text-white text-base shadow-md`}>
                    {lvl.code}
                  </div>
                  <span className="rounded-full bg-zinc-100 px-3 py-1 font-semibold text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                    {lvl.badge}
                  </span>
                </div>

                <div className="mt-5">
                  <span className="font-bold text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    {lvl.level}
                  </span>
                  <h3 className="mt-1 font-bold text-lg text-zinc-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                    {lvl.title}
                  </h3>
                  <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {lvl.desc}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-1.5 font-semibold text-xs text-indigo-600 dark:text-indigo-400">
                <span>Lihat Bank Soal</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="border-t border-zinc-200 bg-zinc-100/60 py-16 dark:border-zinc-800 dark:bg-zinc-900/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-bold text-2xl tracking-tight text-zinc-900 dark:text-white">
              Fitur Lengkap Platform Latihan
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-zinc-500">
              Dirancang khusus untuk memecahkan kendala bahasa dan teknis saat mempelajari lembar ujian kakomon Jepang.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-bold text-base text-zinc-900 dark:text-white">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
