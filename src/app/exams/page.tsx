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
} from "lucide-react";

export default function ExamsCatalogPage() {
  const [exams, setExams] = useState<ExamMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState<string>("all");

  useEffect(() => {
    fetchExams()
      .then((data) => {
        setExams(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredExams = selectedLevel === "all"
    ? exams
    : exams.filter((e) => e.level === selectedLevel);

  const levels = [
    { id: "all", label: "Semua Level", badge: "all" },
    { id: "level1", label: "Level 1 (IT Passport)", badge: "level1" },
    { id: "level2", label: "Level 2 (FE / SG)", badge: "level2" },
    { id: "level3", label: "Level 3 (Applied IT)", badge: "level3" },
    { id: "level4", label: "Level 4 (Database Specialist)", badge: "level4" },
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
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-950 p-8 sm:p-10 text-white shadow-xl dark:border-zinc-800">
        <div className="relative z-10 max-w-2xl space-y-3">
          <Badge variant="ai" className="px-3 py-1">
            <Sparkles className="h-3 w-3" />
            <span>Katalog Bank Soal Resmi JITEC</span>
          </Badge>
          <h1 className="font-black text-3xl sm:text-4xl tracking-tight text-white">
            Pilih Lembar Ujian & Mode Belajar
          </h1>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            Dapatkan pengalaman ujian CBT persis seperti kondisi sebenarnya dengan timer resmi atau pelajari konsep soal secara santai dengan pembahasan instan.
          </p>
        </div>
      </div>

      {/* Level Filters */}
      <div className="flex flex-wrap items-center gap-2 border-b border-zinc-200 pb-4 dark:border-zinc-800">
        {levels.map((lvl) => (
          <button
            key={lvl.id}
            onClick={() => setSelectedLevel(lvl.id)}
            className={`rounded-2xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
              selectedLevel === lvl.id
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25"
                : "bg-white text-zinc-600 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
            }`}
          >
            {lvl.label}
          </button>
        ))}
      </div>

      {/* Exam Cards Grid */}
      <div>
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 animate-pulse rounded-3xl bg-zinc-200 dark:bg-zinc-800" />
            ))}
          </div>
        ) : filteredExams.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-200 p-12 text-center dark:border-zinc-800">
            <Layers className="h-12 w-12 text-zinc-400" />
            <h3 className="mt-4 font-bold text-base text-zinc-800 dark:text-white">
              Belum Ada Ujian Terpublikasi pada Level Ini
            </h3>
            <p className="mt-1 max-w-sm text-xs text-zinc-500">
              Gunakan fitur PDF Extractor di halaman Admin Studio untuk mengekstrak dan mempublikasikan bank soal dari berkas PDF.
            </p>
            <Button asChild className="mt-5" variant="gradient">
              <Link href="/admin/extractor">
                Buka Admin PDF Extractor
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredExams.map((exam) => (
              <Card
                key={exam.id}
                gradientAccent={getLevelAccent(exam.level)}
                className="flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant={getLevelVariant(exam.level)}>
                      {exam.exam_code} • {exam.year}
                    </Badge>
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                      {exam.section.replace("_", " ")}
                    </span>
                  </div>

                  <CardTitle className="mt-4 text-lg">
                    {exam.title}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {exam.level_name}
                  </CardDescription>

                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                    <div className="flex items-center gap-1.5 font-medium">
                      <HelpCircle className="h-4 w-4 text-indigo-500" />
                      <span>{exam.total_questions} Soal</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-medium">
                      <Clock className="h-4 w-4 text-purple-500" />
                      <span>{exam.duration_minutes} Menit</span>
                    </div>
                  </div>
                </CardHeader>

                <CardFooter className="flex-col gap-2 pt-4">
                  <Button asChild variant="gradient" className="w-full">
                    <Link href={`/exams/${exam.id}?mode=cbt`}>
                      <Play className="h-3.5 w-3.5" />
                      <span>Mulai Simulasi CBT</span>
                    </Link>
                  </Button>

                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/exams/${exam.id}?mode=practice`}>
                      <BookOpen className="h-3.5 w-3.5" />
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
