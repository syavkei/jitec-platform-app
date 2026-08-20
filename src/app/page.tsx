"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { FuriganaText } from "@/components/common/FuriganaTooltip";
import {
  GraduationCap,
  Sparkles,
  ShieldCheck,
  Cpu,
  Database,
  Layers,
  ArrowRight,
  CheckCircle2,
  Globe,
  Clock,
  Award,
  Terminal,
  Zap,
  HelpCircle,
  BarChart3,
  Check,
  ChevronRight,
  Building2,
  Users,
  Compass,
} from "lucide-react";

export default function HomePage() {
  // Interactive Live Demo State on Hero
  const [demoLang, setDemoLang] = useState<"ja" | "en" | "id" | "vi">("ja");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const demoQuestion = {
    ja: "自然言語処理において，事前学習済みのモデルに対して行うファインチューニングに関する記述として，最も適切なものはどれか。",
    en: "In natural language processing using large language models, which of the following is the most appropriate description regarding fine-tuning performed on a pre-trained model?",
    id: "Dalam pemrosesan bahasa alami menggunakan model bahasa besar, manakah pernyataan yang paling tepat mengenai fine-tuning yang dilakukan terhadap model yang telah di-pra-latih (pre-trained model)?",
    vi: "Trong xử lý ngôn ngữ tự nhiên sử dụng mô hình ngôn ngữ lớn, mô tả nào sau đây là phù hợp nhất về việc tinh chỉnh (fine-tuning) được thực hiện trên một mô hình đã qua tiền huấn luyện?",
    options: [
      { key: "ア", ja: "強化学習を行うことで目的の出力を最適化する。", en: "Optimize target outputs by applying reinforcement learning.", id: "Melakukan reinforcement learning untuk mengoptimalkan output." },
      { key: "イ", ja: "モデルの精度向上を目的に，事前学習と同じデータを用いて再学習を行う。", en: "Retrain using the exact same data as pre-training to boost model precision.", id: "Melatih ulang menggunakan data yang sama persis dengan pre-training." },
      { key: "ウ", ja: "大量の一般的なテキストデータを用いてモデル全体の精度を高める。", en: "Use massive general text data to improve overall model accuracy.", id: "Menggunakan data teks umum dalam jumlah masif." },
      { key: "エ", ja: "特定のタスクやドメインのデータを用いて，モデルを追加で学習させて適応させる。", en: "Perform additional training using task/domain-specific data to adapt the model.", id: "Melakukan training tambahan menggunakan data spesifik agar model beradaptasi pada tugas khusus." },
    ],
    correct: "エ",
    explanation: "Fine-tuning adalah teknik pembelajaran lanjutan di mana model pre-trained dilatih kembali dengan dataset domain spesifik untuk menyelesaikan tugas tertentu (downstream task)."
  };

  const pathway = [
    {
      level: "Level 1",
      code: "IP",
      name: "IT Passport (ITパスポート)",
      badge: "Fondasi Digital",
      badgeVariant: "level1" as const,
      desc: "Fondasi pemahaman sistem informasi, keamanan siber dasar, etika bisnis IT, dan manajemen proyek untuk seluruh profesional.",
      points: "Pintu masuk pemahaman istilah IT bisnis Jepang",
      link: "/exams?level=level1",
    },
    {
      level: "Level 2",
      code: "FE",
      name: "Fundamental IT Engineer (基本情報技術者)",
      badge: "Standar Utama Rekrutmen ⭐",
      badgeVariant: "level2" as const,
      desc: "Standar de-facto untuk software engineer junior & mid di Jepang. Menguji algoritma pseudocode, SQL, sistem komputer, dan arsitektur jaringan.",
      points: "+5 Poin Visa Kerja Berketerampilan Khusus (HSP)",
      link: "/exams?level=level2",
    },
    {
      level: "Level 3",
      code: "AP",
      name: "Applied IT Engineer (応用情報技術者)",
      badge: "Mid-Senior Engineer",
      badgeVariant: "level3" as const,
      desc: "Evaluasi tingkat menengah ke atas untuk perancangan arsitektur sistem berskala besar, optimasi database, strategi bisnis, dan manajemen resiko.",
      points: "+10 Poin Visa Highly Skilled Professional (HSP)",
      link: "/exams?level=level3",
    },
    {
      level: "Level 4",
      code: "DB / SC",
      name: "Specialist Examinations (高度情報処理技術者)",
      badge: "Spesialisasi Tingkat Tinggi 🔥",
      badgeVariant: "level4" as const,
      desc: "Sertifikasi spesialis murni tingkat lanjut: Database Specialist (DB), Registered Information Security Specialist (SC), dan System Architect.",
      points: "+20 Poin Visa HSP & Standar Arsitek IT Tokyo",
      link: "/exams?level=level4",
    },
  ];

  const pricingTiers = [
    {
      name: "Free Candidate",
      price: "Rp 0",
      period: "selamanya gratis",
      desc: "Untuk calon peserta yang baru mulai mempelajari format ujian JITEC.",
      features: [
        "Akses bank soal Level 1 (IT Passport)",
        "Kamus Kanji IT & Furigana Tooltip lengkap",
        "Mode Latihan Santai (Instant Review)",
        "Dukungan multibahasa (JA, EN, ID, VI)",
      ],
      cta: "Mulai Gratis",
      href: "/register",
      highlight: false,
    },
    {
      name: "Pro Candidate",
      price: "Rp 99.000",
      period: "per bulan (akses penuh)",
      desc: "Paket terlengkap untuk lulus ujian Level 2 FE atau Level 3 AP dalam sekali percobaan.",
      features: [
        "Semua fitur paket Free Candidate",
        "Akses penuh bank soal Level 2 (FE) & Level 3 (AP)",
        "Simulasi Ujian CBT Resmi skala 1000 poin & timer",
        "Pembahasan mendalam tim penguji IPA (採点講評)",
        "AI Auto-Translation untuk seluruh lembar soal",
        "Pencatatan riwayat skor & analitik kelemahan",
      ],
      cta: "Coba Pro Candidate",
      href: "/register",
      highlight: true,
      badge: "Paling Direkomendasikan",
    },
    {
      name: "Institution & LPK",
      price: "Kustom",
      period: "per institusi / lembaga",
      desc: "Dirancang khusus untuk LPK, universitas, bootcamp, dan perusahaan penyalur engineer ke Jepang.",
      features: [
        "Multi-student tracking & batch candidate accounts",
        "Admin studio khusus untuk kelola ujian institusi",
        "Laporan evaluasi kesiapan kerja kandidat ke Jepang",
        "Integrasi kurikulum & konsultasi teknis",
      ],
      cta: "Hubungi Kami",
      href: "/admin/login",
      highlight: false,
    },
  ];

  const faqs = [
    {
      q: "Apa itu sertifikasi JITEC / IPA di Jepang?",
      a: "JITEC (Information Technology Engineers Examination) adalah ujian sertifikasi IT nasional resmi dari Kementerian Ekonomi, Perdagangan, dan Industri Jepang (METI) yang diselenggarakan oleh IPA. Sertifikasi ini diakui secara luas oleh seluruh perusahaan teknologi di Jepang sebagai tolak ukur standar kompetensi teknis seorang engineer.",
    },
    {
      q: "Mengapa sertifikasi ini penting bagi engineer asing yang ingin bekerja di Jepang?",
      a: "Memiliki sertifikat FE (Level 2) atau AP (Level 3) memberikan poin tambahan signifikan (5 hingga 20 poin) pada evaluasi visa kerja 'Highly Skilled Professional' Jepang. Selain itu, sertifikat ini membuktikan Anda menguasai terminologi IT standar dalam bahasa Jepang.",
    },
    {
      q: "Bagaimana fitur kamus Furigana membantu saya yang belum mahir Kanji?",
      a: "Platform kami menyematkan sistem Furigana interaktif. Setiap kanji teknis (seperti 稼働率, 脆弱性, 排他制御) dapat diarahkan kursor (hover) untuk menampilkan cara baca hiragana serta definisi lengkap dalam Bahasa Indonesia, Inggris, dan Vietnam.",
    },
    {
      q: "Apakah format simulasi CBT di platform ini sesuai dengan ujian aslinya di Jepang?",
      a: "Ya. Simulasi CBT di platform kami mengikuti standar resmi IPA: durasi waktu 90 menit (FE Kamoku A), palet navigasi bernomor, opsi ragu-ragu (flag), dan sistem penilaian berskala 0–1000 dengan ambang kelulusan 600 poin.",
    },
  ];

  return (
    <div className="space-y-24 pb-24 overflow-hidden">
      {/* SaaS Hero Section */}
      <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-28 bg-grid-pattern border-b border-zinc-200/80 dark:border-zinc-800/80">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-indigo-500/15 via-purple-500/15 to-transparent blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header Copy */}
          <div className="mx-auto max-w-3xl text-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-indigo-50/70 px-4 py-1.5 text-xs font-semibold text-indigo-900 dark:border-indigo-900/50 dark:bg-indigo-950/40 dark:text-indigo-200 backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-ping" />
              <span className="font-bold">Edisi Terbaru 2025:</span>
              <span>Bank Soal Resmi FE & AP Siap Digunakan</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </div>

            <h1 className="font-black text-4xl sm:text-6xl tracking-tight text-zinc-900 dark:text-white leading-[1.12]">
              Kuasai Ujian IT Jepang.{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Raih Karier Impian di Tokyo.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-2xl mx-auto">
              Platform persiapan sertifikasi IT nasional Jepang (JITEC / IPA) #1 untuk engineer internasional. Latihan soal kakomon asli, simulasi CBT resmi skala 1000 poin, dan bantuan kosakata kanji multibahasa.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3.5">
              <Button asChild size="lg" variant="gradient" className="h-12 px-7 text-sm">
                <Link href="/register">
                  <span>Mulai Latihan Gratis</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-6 text-sm">
                <Link href="/exams">
                  <GraduationCap className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Katalog Bank Soal</span>
                </Link>
              </Button>
            </div>
          </div>

          {/* Interactive Live CBT Demo Widget */}
          <div className="mx-auto max-w-4xl">
            <div className="relative rounded-3xl border border-zinc-200/80 bg-white/95 p-2 sm:p-4 shadow-2xl shadow-indigo-500/10 dark:border-zinc-800 dark:bg-zinc-900/95 backdrop-blur-xl">
              {/* Demo Window Top Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 px-4 py-3 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-rose-400" />
                    <div className="h-3 w-3 rounded-full bg-amber-400" />
                    <div className="h-3 w-3 rounded-full bg-emerald-400" />
                  </div>
                  <span className="ml-2 font-mono text-[11px] font-bold text-zinc-400">
                    CBT Simulator Preview • 2025 FE Kamoku A #1
                  </span>
                </div>

                {/* Language Switcher on Demo Widget */}
                <div className="flex items-center rounded-xl border border-zinc-200 bg-zinc-50 p-1 dark:border-zinc-700 dark:bg-zinc-800">
                  {(["ja", "en", "id", "vi"] as const).map((l) => (
                    <button
                      key={l}
                      onClick={() => setDemoLang(l)}
                      className={`rounded-lg px-2.5 py-1 text-[11px] font-bold uppercase transition-all cursor-pointer ${
                        demoLang === l
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400"
                      }`}
                    >
                      {l === "ja" ? "🇯🇵 JA" : l === "en" ? "🇬🇧 EN" : l === "id" ? "🇮🇩 ID" : "🇻🇳 VI"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Demo Question Content */}
              <div className="p-4 sm:p-6 space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="level2">FE KAMOKU A</Badge>
                    <span className="text-xs text-zinc-400">Teknologi • AI / NLP</span>
                  </div>

                  <div className="font-semibold text-base sm:text-lg text-zinc-900 dark:text-white leading-relaxed">
                    {demoLang === "ja" ? (
                      <FuriganaText text={demoQuestion.ja} />
                    ) : (
                      <p>{demoQuestion[demoLang]}</p>
                    )}
                  </div>
                  {demoLang !== "ja" && (
                    <div className="text-xs text-zinc-400 italic">
                      🇯🇵 Asli: <FuriganaText text={demoQuestion.ja} />
                    </div>
                  )}
                </div>

                {/* Options */}
                <div className="space-y-2.5">
                  {demoQuestion.options.map((opt) => {
                    const isSelected = selectedOption === opt.key;
                    const isCorrect = opt.key === demoQuestion.correct;
                    const isRevealed = selectedOption !== null;

                    let optStyle = "border-zinc-200 bg-zinc-50/50 hover:bg-zinc-100/70 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800/70";
                    if (isRevealed) {
                      if (isCorrect) {
                        optStyle = "border-emerald-500 bg-emerald-50 text-emerald-950 dark:bg-emerald-950/40 dark:text-emerald-200 ring-2 ring-emerald-500/20 font-semibold";
                      } else if (isSelected && !isCorrect) {
                        optStyle = "border-rose-500 bg-rose-50 text-rose-950 dark:bg-rose-950/40 dark:text-rose-200 ring-2 ring-rose-500/20";
                      }
                    }

                    return (
                      <button
                        key={opt.key}
                        onClick={() => setSelectedOption(opt.key)}
                        className={`flex w-full items-start gap-3 rounded-2xl border p-3.5 text-left text-xs sm:text-sm transition-all cursor-pointer ${optStyle}`}
                      >
                        <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg font-bold text-xs ${
                          isSelected ? "bg-indigo-600 text-white" : "bg-zinc-200/80 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                        }`}>
                          {opt.key}
                        </span>
                        <span className="pt-0.5 leading-relaxed">
                          {demoLang === "ja" ? opt.ja : demoLang === "en" ? opt.en : opt.id}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Demo Explanation Reveal */}
                {selectedOption && (
                  <div className={`rounded-2xl border p-4 text-xs leading-relaxed ${
                    selectedOption === demoQuestion.correct
                      ? "border-emerald-200 bg-emerald-50/80 text-emerald-950 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200"
                      : "border-amber-200 bg-amber-50/80 text-amber-950 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200"
                  }`}>
                    <div className="font-bold mb-1 flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-indigo-600" />
                      <span>{selectedOption === demoQuestion.correct ? "Jawaban Anda Benar!" : "Penjelasan Jawaban (Kunci: エ)"}</span>
                    </div>
                    <p>{demoQuestion.explanation}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics & Social Proof Bar */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 rounded-3xl border border-zinc-200/80 bg-white p-6 sm:grid-cols-4 sm:p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 text-center">
          <div className="space-y-1 border-r border-zinc-100 last:border-0 dark:border-zinc-800">
            <div className="font-black text-3xl sm:text-4xl text-indigo-600 dark:text-indigo-400">
              4 Level
            </div>
            <div className="text-xs font-semibold text-zinc-500">Skill Levels 1–4 Resmi IPA</div>
          </div>
          <div className="space-y-1 border-r border-zinc-100 last:border-0 dark:border-zinc-800">
            <div className="font-black text-3xl sm:text-4xl text-purple-600 dark:text-purple-400">
              4 Bahasa
            </div>
            <div className="text-xs font-semibold text-zinc-500">🇯🇵 JA • 🇬🇧 EN • 🇮🇩 ID • 🇻🇳 VI</div>
          </div>
          <div className="space-y-1 border-r border-zinc-100 last:border-0 dark:border-zinc-800">
            <div className="font-black text-3xl sm:text-4xl text-emerald-600 dark:text-emerald-400">
              100%
            </div>
            <div className="text-xs font-semibold text-zinc-500">Standar Format CBT Skala 1000</div>
          </div>
          <div className="space-y-1">
            <div className="font-black text-3xl sm:text-4xl text-rose-600 dark:text-rose-400">
              +20 Poin
            </div>
            <div className="text-xs font-semibold text-zinc-500">Poin Tambahan Visa Kerja Jepang</div>
          </div>
        </div>
      </section>

      {/* Certification Pathway Roadmap */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2">
          <Badge variant="level2">ROADMAP KARIER</Badge>
          <h2 className="font-extrabold text-3xl text-zinc-900 dark:text-white tracking-tight">
            Jalur Sertifikasi Resmi Menuju Industri IT Jepang
          </h2>
          <p className="max-w-xl mx-auto text-xs sm:text-sm text-zinc-500">
            Pilih sertifikasi yang sesuai dengan level keahlian dan target peran profesional Anda di Tokyo.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pathway.map((p, idx) => (
            <Card
              key={p.code}
              className="flex flex-col justify-between hover:border-indigo-400 hover:shadow-xl transition-all"
            >
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant={p.badgeVariant}>{p.level}</Badge>
                  <span className="font-mono font-bold text-xs text-zinc-400">{p.code}</span>
                </div>

                <div>
                  <CardTitle className="text-base">{p.name}</CardTitle>
                  <span className="mt-1 inline-block text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                    {p.badge}
                  </span>
                </div>

                <CardDescription className="text-xs">
                  {p.desc}
                </CardDescription>
              </CardHeader>

              <CardFooter className="flex-col items-start gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 shrink-0" />
                  <span>{p.points}</span>
                </div>

                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link href={p.link} className="flex items-center justify-center gap-1 font-bold">
                    <span>Latihan Soal {p.code}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Bento Grid Product Features */}
      <section className="border-y border-zinc-200/80 bg-zinc-50/60 py-20 dark:border-zinc-800/80 dark:bg-zinc-900/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2">
            <Badge variant="secondary">KEUNGGULAN PRODUK</Badge>
            <h2 className="font-extrabold text-3xl text-zinc-900 dark:text-white tracking-tight">
              Fitur Lengkap untuk Memastikan Kelulusan Anda
            </h2>
            <p className="max-w-md mx-auto text-xs sm:text-sm text-zinc-500">
              Dirancang dari nol untuk mengatasi kendala bahasa dan adaptasi format ujian nasional Jepang.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Bento Card 1: CBT Simulator */}
            <div className="rounded-3xl border border-zinc-200/80 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-4 md:col-span-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-xl text-zinc-900 dark:text-white">
                Simulasi CBT Resmi dengan Timer & Skala 1000 Poin
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                Uji kemampuan Anda dalam kondisi ujian sesungguhnya. Dilengkapi hitung mundur alokasi waktu per soal, palet navigasi, penandaan nomor ragu-ragu, dan kalkulasi skor kelulusan berskala (ambang batas 600 poin) secara instan.
              </p>
            </div>

            {/* Bento Card 2: Furigana Tooltip */}
            <div className="rounded-3xl border border-zinc-200/80 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
                <Globe className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-xl text-zinc-900 dark:text-white">
                Kamus Kanji IT & Furigana Tooltip
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                Hilangkan ketakutan terhadap huruf kanji. Cukup arahkan kursor ke istilah kanji teknis untuk melihat furigana dan arti dalam 4 bahasa.
              </p>
            </div>

            {/* Bento Card 3: AI Translation Engine */}
            <div className="rounded-3xl border border-zinc-200/80 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-xl text-zinc-900 dark:text-white">
                AI Ingestion & Auto-Translate
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                Admin Studio dilengkapi ekstraktor PDF dan kecerdasan buatan untuk menerjemahkan soal-soal kakomon terbaru ke EN, ID, dan VI secara instan.
              </p>
            </div>

            {/* Bento Card 4: Saiten Kouhyou */}
            <div className="rounded-3xl border border-zinc-200/80 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-4 md:col-span-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-xl text-zinc-900 dark:text-white">
                Pembahasan Resmi & Komentar Penguji IPA (採点講評)
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                Tidak hanya kunci jawaban, pelajari juga mengapa opsi lain salah melalui catatan evaluasi resmi dari tim penguji nasional Jepang agar tidak mengulangi kesalahan fatal saat ujian sesungguhnya.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SaaS Pricing / Plans Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2">
          <Badge variant="level2">PILIHAN AKSES</Badge>
          <h2 className="font-extrabold text-3xl text-zinc-900 dark:text-white tracking-tight">
            Paket Akses Belajar yang Fleksibel
          </h2>
          <p className="max-w-md mx-auto text-xs sm:text-sm text-zinc-500">
            Mulai dari latihan dasar gratis hingga simulasi ujian komprehensif tingkat lanjut.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 items-stretch">
          {pricingTiers.map((tier) => (
            <Card
              key={tier.name}
              className={`flex flex-col justify-between relative ${
                tier.highlight
                  ? "border-2 border-indigo-600 shadow-2xl shadow-indigo-500/15"
                  : "border-zinc-200 dark:border-zinc-800"
              }`}
            >
              {tier.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <Badge variant="ai" className="px-3 py-1">
                    {tier.badge}
                  </Badge>
                </div>
              )}

              <CardHeader className="space-y-3 pt-6">
                <div>
                  <CardTitle className="text-lg">{tier.name}</CardTitle>
                  <CardDescription className="text-xs mt-1">{tier.desc}</CardDescription>
                </div>

                <div className="pt-2">
                  <div className="font-black text-3xl text-zinc-900 dark:text-white">
                    {tier.price}
                  </div>
                  <div className="text-[11px] text-zinc-400">{tier.period}</div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 flex-1">
                <div className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  Termasuk:
                </div>
                <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-300">
                  {tier.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <Button
                  asChild
                  variant={tier.highlight ? "gradient" : "outline"}
                  className="w-full h-11"
                >
                  <Link href={tier.href}>{tier.cta}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <Badge variant="secondary">FAQ</Badge>
          <h2 className="font-extrabold text-3xl text-zinc-900 dark:text-white tracking-tight">
            Pertanyaan yang Sering Diajukan
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-2"
            >
              <h3 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-indigo-600 shrink-0" />
                <span>{faq.q}</span>
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed pl-6">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* High-Converting Bottom CTA Banner */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 p-8 sm:p-14 text-white shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-6">
            <Badge variant="ai" className="px-3.5 py-1">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Karier IT di Jepang Menanti Anda</span>
            </Badge>

            <h2 className="font-black text-3xl sm:text-5xl tracking-tight text-white leading-tight">
              Siap Menembus Ujian JITEC Pertama Anda?
            </h2>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Bergabunglah dengan ribuan software engineer internasional yang mempersiapkan diri menuju pasar kerja teknologi Jepang dengan platform latihan nomor satu.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" variant="gradient" className="h-12 px-8 text-sm">
                <Link href="/register">
                  <span>Daftar Akun Peserta Gratis</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-6 text-sm text-zinc-900 bg-white hover:bg-zinc-100">
                <Link href="/glossary">
                  <Globe className="h-4 w-4 text-indigo-600" />
                  <span>Jelajahi Kamus Kanji IT</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
