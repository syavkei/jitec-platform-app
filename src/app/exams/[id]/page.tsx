"use client";

import { useEffect, useState, use } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Exam, ExamSubmitResponse } from "@/types";
import { fetchExamById, submitExamAttempt } from "@/lib/api";
import { ExamTimer } from "@/components/exam/ExamTimer";
import { QuestionCard } from "@/components/exam/QuestionCard";
import { QuestionPalette } from "@/components/exam/QuestionPalette";
import { CBTResultModal } from "@/components/exam/CBTResultModal";
import {
  ChevronLeft,
  ChevronRight,
  Send,
  ArrowLeft,
  GraduationCap,
  Sparkles,
  Layers,
} from "lucide-react";

export default function ExamRunnerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const examId = resolvedParams.id;
  const searchParams = useSearchParams();
  const router = useRouter();

  const mode = (searchParams.get("mode") as "cbt" | "practice") || "cbt";

  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<Record<number, boolean>>({});
  const [startTime] = useState<number>(Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<ExamSubmitResponse | null>(null);

  useEffect(() => {
    fetchExamById(examId)
      .then((data) => {
        setExam(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [examId]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          <p className="text-xs text-zinc-500 font-medium">Memuat lembar ujian...</p>
        </div>
      </div>
    );
  }

  if (!exam || exam.questions.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <Layers className="mx-auto h-12 w-12 text-zinc-400" />
        <h2 className="mt-4 font-bold text-lg text-zinc-900 dark:text-white">
          Lembar Ujian Tidak Ditemukan
        </h2>
        <p className="mt-1 text-xs text-zinc-500">
          Ujian ini belum memiliki daftar soal atau belum dipublikasikan dari Admin Studio.
        </p>
        <Link
          href="/exams"
          className="mt-6 inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Katalog</span>
        </Link>
      </div>
    );
  }

  const currentQ = exam.questions[currentIndex];
  const totalQ = exam.questions.length;

  const handleSelectAnswer = (key: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: key,
    }));
  };

  const handleToggleFlag = () => {
    setFlagged((prev) => ({
      ...prev,
      [currentQ.question_number]: !prev[currentQ.question_number],
    }));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    const unansweredCount = totalQ - Object.keys(answers).length;
    if (mode === "cbt" && unansweredCount > 0) {
      const confirmSubmit = window.confirm(
        `Masih ada ${unansweredCount} soal yang belum Anda jawab. Yakin ingin mengakhiri dan mengirim ujian?`
      );
      if (!confirmSubmit) return;
    }

    setIsSubmitting(true);
    const timeSpent = Math.max(1, Math.round((Date.now() - startTime) / 1000));

    try {
      const res = await submitExamAttempt(exam.id, answers, timeSpent);
      setResult(res);
    } catch (err) {
      alert("Gagal mengirim jawaban ujian. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-100/70 pb-20 dark:bg-zinc-950">
      {/* Top Floating Action Bar */}
      <div className="sticky top-16 z-40 border-b border-zinc-200 bg-white/95 px-4 py-3 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/95 sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/exams"
              className="rounded-lg border border-zinc-200 p-2 text-zinc-500 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-zinc-900 dark:text-white">
                  {exam.title}
                </span>
                <span className={`rounded px-2 py-0.5 font-bold text-[10px] uppercase ${
                  mode === "cbt"
                    ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                    : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                }`}>
                  {mode === "cbt" ? "Simulasi CBT" : "Latihan Santai"}
                </span>
              </div>
              <p className="text-[11px] text-zinc-500">
                Soal {currentIndex + 1} dari {totalQ} ({Object.keys(answers).length} Terjawab)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {mode === "cbt" && (
              <ExamTimer
                initialSeconds={exam.duration_minutes * 60}
                onTimeUp={handleSubmit}
                isRunning={!result}
              />
            )}

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 font-bold text-xs text-white shadow-sm hover:bg-indigo-500 active:scale-95 disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Selesai & Kumpulkan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Runner Layout */}
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Main Question Area (3 Cols) */}
          <div className="space-y-6 lg:col-span-3">
            <QuestionCard
              question={currentQ}
              selectedAnswer={answers[currentQ.id]}
              isFlagged={!!flagged[currentQ.question_number]}
              onSelectAnswer={handleSelectAnswer}
              onToggleFlag={handleToggleFlag}
              mode={mode}
            />

            {/* Bottom Navigation Buttons */}
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
                {currentIndex + 1} / {totalQ}
              </span>

              <button
                disabled={currentIndex === totalQ - 1}
                onClick={() => setCurrentIndex(Math.min(totalQ - 1, currentIndex + 1))}
                className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-40"
              >
                <span>Selanjutnya</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Right Palette Column (1 Col) */}
          <div className="lg:col-span-1">
            <div className="sticky top-36">
              <QuestionPalette
                questions={exam.questions}
                currentIndex={currentIndex}
                answers={answers}
                flagged={flagged}
                onSelect={(idx) => setCurrentIndex(idx)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Result Modal */}
      {result && (
        <CBTResultModal
          result={result}
          examTitle={exam.title}
          onRetry={() => {
            setResult(null);
            setAnswers({});
            setFlagged({});
            setCurrentIndex(0);
          }}
        />
      )}
    </div>
  );
}
