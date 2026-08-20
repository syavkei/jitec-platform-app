"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ExamMetadata } from "@/types";
import { fetchExams } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import {
  GraduationCap,
  Clock,
  HelpCircle,
  ArrowRight,
  Play,
  BookOpen,
  Layers,
  Sparkles,
  Award,
  Search,
  CheckCircle2,
  Filter,
} from "lucide-react";

export default function ExamsCatalogPage() {
  const [exams, setExams] = useState<ExamMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchExams()
      .then((data) => {
        setExams(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredExams = exams.filter((e) => {
    const matchesLevel = selectedLevel === "all" || e.level === selectedLevel;
    const matchesSearch =
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.exam_code.toLowerCase().includes(search.toLowerCase()) ||
      e.level_name.toLowerCase().includes(search.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  const levels = [
    { id: "all", label: "Semua Tingkatan", count: exams.length },
    { id: "level1", label: "Level 1: IT Passport", count: exams.filter((e) => e.level === "level1").length },
    { id: "level2", label: "Level 2: FE / SG", count: exams.filter((e) => e.level === "level2").length },
    { id: "level3", label: "Level 3: Applied IT", count: exams.filter((e) => e.level === "level3").length },
    { id: "level4", label: "Level 4: Specialist", count: exams.filter((e) => e.level === "level4").length },
  ];

  const getLevelVariant = (level: string) => {
    if (level === "level1") return "level1";
    if (level === "level2") return "level2";
    if (level === "level3") return "level3";
    if (level === "level4") return "level4";
    return "default";
  };

  const getLevelAccent = (level: string) => {
    if (level === "level1") return "cyan" as const;
    if (level === "level2") return "indigo" as const;
    if (level === "level3") return "purple" as const;
    if (level === "level4") return "rose" as const;
    return "indigo" as const;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      {/* SaaS Catalog Header */}
      <div className="rounded-3xl border border-zinc-200/80 bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-950 p-8 sm:p-12 text-white shadow-xl dark:border-zinc-800">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-bold text-indigo-300 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Bank Soal Kakomon Resmi IPA Jepang</span>
          </div>

          <h1 className="font-black text-3xl sm:text-4xl tracking-tight">
            Katalog Lembar Ujian CBT & Latihan
          </h1>

          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            Pilih lembar ujian resmi yang ingin Anda kerjakan. Anda dapat memilih antara <strong>Mode Simulasi CBT</strong> (dengan timer & penilaian skala 1000 poin) atau <strong>Mode Latihan Santai</strong> (dengan ulasan jawaban instan).
          </p>
        </div>
      </div>

      {/* Search & Level Filter Toolbar */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Level Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {levels.map((lvl) => (
              <button
                key={lvl.id}
                onClick={() => setSelectedLevel(lvl.id)}
                className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${
                  selectedLevel === lvl.id
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                    : "bg-white text-zinc-600 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                }`}
              >
                <span>{lvl.label}</span>
                <span className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                  selectedLevel === lvl.id ? "bg-white/20 text-white" : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800"
                }`}>
                  {lvl.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari judul atau kode ujian..."
              className="w-full rounded-2xl border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-xs text-zinc-900 placeholder:text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Exam Cards Grid */}
      <div>
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 animate-pulse rounded-3xl bg-zinc-200/80 dark:bg-zinc-800" />
            ))}
          </div>
        ) : filteredExams.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-200 p-16 text-center dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400 dark:bg-zinc-800">
              <Layers className="h-7 w-7" />
            </div>
            <h3 className="mt-4 font-bold text-base text-zinc-800 dark:text-white">
              Tidak Ada Lembar Ujian yang Sesuai
            </h3>
            <p className="mt-1 max-w-sm text-xs text-zinc-500">
              Ubah kata kunci pencarian atau gunakan menu PDF Extractor di Admin Studio untuk menambahkan berkas ujian baru.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredExams.map((exam) => (
              <Card
                key={exam.id}
                gradientAccent={getLevelAccent(exam.level)}
                className="flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                <CardHeader className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant={getLevelVariant(exam.level)}>
                      {exam.exam_code} • {exam.year}
                    </Badge>
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                      {exam.section.replace("_", " ")}
                    </span>
                  </div>

                  <div>
                    <CardTitle className="text-base">{exam.title}</CardTitle>
                    <CardDescription className="text-xs mt-1">
                      {exam.level_name}
                    </CardDescription>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 text-xs text-zinc-500 dark:text-zinc-400">
                    <div className="flex items-center gap-1.5 font-medium">
                      <HelpCircle className="h-4 w-4 text-indigo-500" />
                      <span>{exam.total_questions} Butir Soal</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-medium">
                      <Clock className="h-4 w-4 text-purple-500" />
                      <span>Durasi: {exam.duration_minutes} Menit</span>
                    </div>
                  </div>
                </CardHeader>

                <CardFooter className="flex-col gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  <Button asChild variant="gradient" className="w-full h-10">
                    <Link href={`/exams/${exam.id}?mode=cbt`}>
                      <Play className="h-3.5 w-3.5" />
                      <span>Mulai Simulasi CBT</span>
                    </Link>
                  </Button>

                  <Button asChild variant="outline" className="w-full h-10">
                    <Link href={`/exams/${exam.id}?mode=practice`}>
                      <BookOpen className="h-3.5 w-3.5 text-zinc-500" />
                      <span>Latihan Santai (Instant Review)</span>
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
