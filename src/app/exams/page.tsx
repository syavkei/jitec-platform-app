"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ExamMetadata } from "@/types";
import { fetchExams } from "@/lib/api";
import { GraduationCap, Clock, HelpCircle, ArrowRight, Play, BookOpen, Layers } from "lucide-react";

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
    { id: "all", label: "Semua Level" },
    { id: "level1", label: "Level 1 (IT Passport)" },
    { id: "level2", label: "Level 2 (FE / SG)" },
    { id: "level3", label: "Level 3 (Applied IT)" },
    { id: "level4", label: "Level 4 (Database Specialist)" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <div className="rounded-3xl border border-zinc-200 bg-gradient-to-r from-indigo-900 to-slate-900 p-8 text-white shadow-xl dark:border-zinc-800">
        <div className="max-w-2xl">
          <span className="rounded-full bg-indigo-500/20 px-3 py-1 font-bold text-xs text-indigo-300">
            Katalog Bank Soal Resmi JITEC
          </span>
          <h1 className="mt-3 font-extrabold text-3xl sm:text-4xl tracking-tight">
            Pilih Lembar Ujian & Mode Belajar
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-zinc-300 leading-relaxed">
            Dapatkan pengalaman ujian CBT persis seperti kondisi sebenarnya atau pelajari konsep soal secara santai dengan pembahasan instan.
          </p>
        </div>
      </div>

      {/* Level Filters */}
      <div className="mt-8 flex flex-wrap items-center gap-2 border-b border-zinc-200 pb-4 dark:border-zinc-800">
        {levels.map((lvl) => (
          <button
            key={lvl.id}
            onClick={() => setSelectedLevel(lvl.id)}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              selectedLevel === lvl.id
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-white text-zinc-600 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
            }`}
          >
            {lvl.label}
          </button>
        ))}
      </div>

      {/* Exam Cards Grid */}
      <div className="mt-8">
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-56 animate-pulse rounded-3xl bg-zinc-200 dark:bg-zinc-800" />
            ))}
          </div>
        ) : filteredExams.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-200 p-12 text-center dark:border-zinc-800">
            <Layers className="h-12 w-12 text-zinc-400" />
            <h3 className="mt-4 font-bold text-base text-zinc-800 dark:text-white">
              Belum Ada Ujian Terpublikasi
            </h3>
            <p className="mt-1 max-w-sm text-xs text-zinc-500">
              Gunakan fitur PDF Extractor di halaman Admin Studio untuk mengekstrak dan mempublikasikan bank soal dari berkas PDF.
            </p>
            <Link
              href="/admin/extractor"
              className="mt-5 rounded-xl bg-indigo-600 px-4 py-2 font-semibold text-xs text-white hover:bg-indigo-500"
            >
              Buka Admin PDF Extractor
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredExams.map((exam) => (
              <div
                key={exam.id}
                className="flex flex-col justify-between rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:border-indigo-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-lg bg-indigo-100 px-2.5 py-1 font-bold text-xs text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                      {exam.exam_code} • {exam.year}
                    </span>
                    <span className="text-xs text-zinc-400 capitalize">
                      {exam.section.replace("_", " ")}
                    </span>
                  </div>

                  <h3 className="mt-4 font-bold text-base text-zinc-900 dark:text-white">
                    {exam.title}
                  </h3>

                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                    <div className="flex items-center gap-1.5">
                      <HelpCircle className="h-3.5 w-3.5 text-zinc-400" />
                      <span>{exam.total_questions} Soal</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-zinc-400" />
                      <span>{exam.duration_minutes} Menit</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-2 border-t border-zinc-100 pt-4 dark:border-zinc-800">
                  <Link
                    href={`/exams/${exam.id}?mode=cbt`}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 font-semibold text-xs text-white shadow-sm hover:bg-indigo-500 active:scale-95"
                  >
                    <Play className="h-3.5 w-3.5" />
                    <span>Mulai Simulasi CBT</span>
                  </Link>

                  <Link
                    href={`/exams/${exam.id}?mode=practice`}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 font-semibold text-xs text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    <span>Latihan Santai (Instant Review)</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
