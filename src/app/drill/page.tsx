"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Exam, Question } from "@/types";
import { fetchExams, fetchExamById } from "@/lib/api";
import { QuestionCard } from "@/components/exam/QuestionCard";
import {
  Compass,
  Database,
  ShieldCheck,
  Cpu,
  Binary,
  Layers,
  Sparkles,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  BookOpen,
} from "lucide-react";

export default function DrillPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const topics = [
    { id: "all", label: "Semua Topik", icon: Compass },
    { id: "Database", label: "Basis Data (DB)", icon: Database },
    { id: "Security", label: "Keamanan (Security)", icon: ShieldCheck },
    { id: "Systems", label: "Sistem Komputer & OS", icon: Cpu },
    { id: "Algorithms", label: "Algoritma & Struktur Data", icon: Binary },
  ];

  useEffect(() => {
    // Load questions from available exams
    fetchExams().then(async (examList) => {
      const allQ: Question[] = [];
      for (const exMeta of examList) {
        const fullEx = await fetchExamById(exMeta.id);
        if (fullEx && fullEx.questions) {
          allQ.push(...fullEx.questions);
        }
      }
      setQuestions(allQ);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filteredQuestions = selectedTopic === "all"
    ? questions
    : questions.filter((q) => {
        const cat = (q.category || "").toLowerCase();
        if (selectedTopic === "Database") return cat.includes("データベース") || cat.includes("database");
        if (selectedTopic === "Security") return cat.includes("セキュリティ") || cat.includes("security");
        if (selectedTopic === "Systems") return cat.includes("テクノロジ") || cat.includes("system") || cat.includes("os");
        if (selectedTopic === "Algorithms") return cat.includes("アルゴリズム") || cat.includes("木構造") || cat.includes("algorithm");
        return true;
      });

  const currentQ = filteredQuestions[currentIndex];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      {/* Header Banner */}
      <div className="rounded-3xl border border-zinc-200 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 p-8 text-white shadow-xl dark:border-zinc-800">
        <div className="max-w-2xl">
          <span className="rounded-full bg-purple-500/20 px-3 py-1 font-bold text-xs text-purple-300">
            Latihan Mandiri Berbasis Kategori
          </span>
          <h1 className="mt-3 font-extrabold text-3xl sm:text-4xl tracking-tight">
            Drill Soal Tematik & Analisis Kelemahan
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-zinc-300 leading-relaxed">
            Fokuskan latihan Anda pada topik atau pilar teknologi spesifik untuk memperkuat pemahaman sebelum menghadapi simulasi ujian penuh.
          </p>
        </div>
      </div>

      {/* Topics Filter */}
      <div className="flex flex-wrap items-center gap-2 border-b border-zinc-200 pb-4 dark:border-zinc-800">
        {topics.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => {
                setSelectedTopic(t.id);
                setCurrentIndex(0);
              }}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                selectedTopic === t.id
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-white text-zinc-600 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Drill Runner */}
      {loading ? (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
        </div>
      ) : filteredQuestions.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <Layers className="h-12 w-12 text-zinc-400" />
          <h3 className="mt-4 font-bold text-base text-zinc-800 dark:text-white">
            Belum Ada Soal pada Kategori Ini
          </h3>
          <p className="mt-1 max-w-sm text-xs text-zinc-500">
            Publikasikan lebih banyak bank soal di Admin Studio untuk memperkaya koleksi soal drill.
          </p>
          <Link
            href="/admin/extractor"
            className="mt-5 rounded-xl bg-indigo-600 px-4 py-2 font-semibold text-xs text-white"
          >
            Buka PDF Extractor Studio
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-zinc-500 uppercase tracking-wider">
              Soal {currentIndex + 1} dari {filteredQuestions.length} ({selectedTopic})
            </span>
          </div>

          {currentQ && (
            <QuestionCard
              question={currentQ}
              selectedAnswer={answers[currentQ.id]}
              onSelectAnswer={(key) => setAnswers({ ...answers, [currentQ.id]: key })}
              onToggleFlag={() => {}}
              mode="practice"
            />
          )}

          {/* Stepper Footer */}
          <div className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <button
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
              className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 disabled:opacity-40 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Sebelumnya</span>
            </button>

            <span className="text-xs font-medium text-zinc-500">
              {currentIndex + 1} / {filteredQuestions.length}
            </span>

            <button
              disabled={currentIndex === filteredQuestions.length - 1}
              onClick={() => setCurrentIndex(Math.min(filteredQuestions.length - 1, currentIndex + 1))}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-40"
            >
              <span>Selanjutnya</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
