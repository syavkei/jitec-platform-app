"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
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
  Zap,
  Globe,
  Award,
  Terminal,
} from "lucide-react";

export default function HomePage() {
  const levels = [
    {
      level: "Level 1",
      code: "IP",
      title: "IT Passport Examination (ITパスポート)",
      desc: "Fondasi ilmu komputer, literasi digital, keamanan informasi dasar, dan etika bisnis IT untuk seluruh pemula dan profesional.",
      variant: "level1" as const,
      accent: "cyan" as const,
      badge: "Dasar & Non-IT",
      link: "/exams?level=level1",
      icon: Terminal,
    },
    {
      level: "Level 2",
      code: "FE / SG",
      title: "Fundamental IT Engineer (基本情報技術者)",
      desc: "Standar industri untuk junior software engineer di Jepang. Menguji Kamoku A (Teori 60 soal) dan Kamoku B (Algoritma Pseudocode).",
      variant: "level2" as const,
      accent: "indigo" as const,
      badge: "Paling Populer ⭐",
      link: "/exams?level=level2",
      icon: Cpu,
    },
    {
      level: "Level 3",
      code: "AP",
      title: "Applied IT Engineer (応用情報技術者)",
      desc: "Standar industri untuk engineer level menengah ke atas di Jepang. Menguji perancangan arsitektur sistem, basis data, dan manajemen proyek.",
      variant: "level3" as const,
      accent: "purple" as const,
      badge: "Mid-Senior Standard",
      link: "/exams?level=level3",
      icon: Layers,
    },
    {
      level: "Level 4",
      code: "DB / SC / NW",
      title: "Advanced Specialist (高度情報処理技術者)",
      desc: "Sertifikasi spesialisasi murni tingkat lanjut: Database Specialist (DB), Registered Security Specialist (SC), dan Network Specialist (NW).",
      variant: "level4" as const,
      accent: "rose" as const,
      badge: "Spesialisasi Lanjut 🔥",
      link: "/exams?level=level4",
      icon: Database,
    },
  ];

  const features = [
    {
      title: "Simulasi Ujian CBT Resmi",
      desc: "Timer real-time, palet nomor soal, fitur ragu-ragu, dan kalkulasi skor kelulusan otomatis skala 1000 poin resmi JITEC.",
      icon: GraduationCap,
      color: "from-indigo-500 to-blue-600",
    },
    {
      title: "Bilingual & Kanji Furigana Hover",
      desc: "Arahkan kursor pada istilah kanji IT Jepang (稼働率, 脆弱性, 排他制御) untuk melihat Furigana dan arti dalam 4 bahasa (EN/ID/VI/JA).",
      icon: Globe,
      color: "from-purple-500 to-pink-600",
    },
    {
      title: "PDF & AI Ingestion Studio",
      desc: "Ekstraksi otomatis soal dan kunci jawaban dari berkas kakomon PDF resmi IPA dengan antarmuka split-screen verification.",
      icon: Sparkles,
      color: "from-rose-500 to-amber-500",
    },
    {
      title: "Pembahasan Saiten Kouhyou",
      desc: "Dilengkapi analisis mendalam dan poin evaluasi resmi dari tim penguji IPA Jepang (採点講評) untuk memahami ekspektasi jawaban.",
      icon: ShieldCheck,
      color: "from-emerald-500 to-teal-600",
    },
  ];

  return (
    <div className="space-y-20 pb-24">
      {/* Hero Section with Vibrant Mesh Gradient */}
      <section className="relative overflow-hidden border-b border-zinc-200 bg-gradient-to-b from-indigo-50/80 via-purple-50/30 to-white pt-20 pb-24 dark:border-zinc-800 dark:from-zinc-950 dark:via-indigo-950/20 dark:to-zinc-950">
        {/* Background Glowing Circles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center space-y-6">
            <div className="inline-flex items-center gap-2">
              <Badge variant="ai" className="px-3.5 py-1 text-xs">
                <Sparkles className="h-3.5 w-3.5" />
                <span>JITEC & IPA 過去問題 Prep Hub</span>
              </Badge>
              <Badge variant="outline" className="hidden sm:inline-flex bg-white/80 dark:bg-zinc-900/80">
                🇯🇵 日本語 • 🇬🇧 English • 🇮🇩 Indonesia • 🇻🇳 Tiếng Việt
              </Badge>
            </div>

            <h1 className="font-black text-4xl tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl dark:text-white leading-tight">
              Kuasai Ujian IT Nasional Jepang{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                (情報処理技術者試験)
              </span>
            </h1>

            <p className="text-base sm:text-lg leading-relaxed text-zinc-600 dark:text-zinc-300">
              Platform persiapan karier IT di Jepang untuk engineer internasional. Latihan bank soal kakomon resmi Level 1 (IT Passport) hingga Level 4 (Database Specialist) dengan simulasi CBT dan kamus kanji teknis interaktif.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3.5">
              <Button asChild size="lg" variant="gradient">
                <Link href="/exams">
                  <GraduationCap className="h-5 w-5" />
                  <span>Mulai Simulasi CBT</span>
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/admin/extractor">
                  <Sparkles className="h-4 w-4 text-rose-500" />
                  <span>PDF & AI Extractor Studio</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Certification Levels Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2">
          <Badge variant="level2">JITEC SKILL LEVELS 1–4</Badge>
          <h2 className="font-extrabold text-2xl sm:text-3xl text-zinc-900 dark:text-white">
            Hierarki Sertifikasi Resmi IPA Jepang
          </h2>
          <p className="max-w-xl mx-auto text-xs sm:text-sm text-zinc-500">
            Pilih jalur sertifikasi yang sesuai dengan jenjang karier dan keahlian spesialisasi teknis Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {levels.map((lvl) => {
            const Icon = lvl.icon;
            return (
              <Card
                key={lvl.code}
                gradientAccent={lvl.accent}
                className="group flex flex-col justify-between hover:-translate-y-1 hover:shadow-xl hover:border-indigo-300 dark:hover:border-zinc-700 transition-all"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white group-hover:scale-110 transition-transform">
                        <Icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div>
                        <Badge variant={lvl.variant}>{lvl.level}</Badge>
                        <div className="font-mono font-bold text-xs text-zinc-400 mt-0.5">{lvl.code}</div>
                      </div>
                    </div>
                    <Badge variant="secondary">{lvl.badge}</Badge>
                  </div>

                  <CardTitle className="mt-4 text-lg group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {lvl.title}
                  </CardTitle>
                  <CardDescription className="mt-2 text-xs sm:text-sm">
                    {lvl.desc}
                  </CardDescription>
                </CardHeader>

                <CardFooter className="pt-4">
                  <Button asChild variant="ghost" size="sm" className="group-hover:text-indigo-600">
                    <Link href={lvl.link} className="flex items-center gap-1.5 font-bold">
                      <span>Buka Bank Soal</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="border-y border-zinc-200 bg-zinc-50/60 py-20 dark:border-zinc-800 dark:bg-zinc-900/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2">
            <Badge variant="secondary">FITUR MODERN</Badge>
            <h2 className="font-extrabold text-2xl sm:text-3xl text-zinc-900 dark:text-white">
              Dirancang Khusus untuk Engineer Internasional
            </h2>
            <p className="max-w-lg mx-auto text-xs sm:text-sm text-zinc-500">
              Menghilangkan hambatan bahasa dengan kamus kanji teknis dan mode pengerjaan bilingual.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <Card key={i} className="hover:border-zinc-300 dark:hover:border-zinc-700">
                  <CardHeader>
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr ${f.color} text-white shadow-md`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="mt-4 text-base">{f.title}</CardTitle>
                    <CardDescription className="mt-2 text-xs">{f.desc}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
