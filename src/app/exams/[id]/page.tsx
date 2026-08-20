"use client";

import { useEffect, useState, use } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Exam, ExamSubmitResponse } from "@/types";
import { fetchExamById, submitExamAttempt } from "@/lib/api";
import { useAuthStore } from "@/lib/auth";
import { ExamTimer } from "@/components/exam/ExamTimer";
import { QuestionPalette } from "@/components/exam/QuestionPalette";
import { QuestionCard } from "@/components/exam/QuestionCard";
import { CBTResultModal } from "@/components/exam/CBTResultModal";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Lock,
  LogIn,
  GraduationCap,
  Sparkles,
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
  const { user, initAuthFromStorage } = useAuthStore();

  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [authMounted, setAuthMounted] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<Record<number, boolean>>({});
  const [timeSpent, setTimeSpent] = useState(0);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<ExamSubmitResponse | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);

  useEffect(() => {
    initAuthFromStorage();
    setAuthMounted(true);
  }, [initAuthFromStorage]);

  useEffect(() => {
    fetchExamById(examId)
      .then((data) => {
        setExam(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [examId]);

  // Auth requirement check: Only logged in users can attempt exams/practice
  if (authMounted && !user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <Card gradientAccent="indigo" className="max-w-md w-full text-center p-8 space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 shadow-md">
            <Lock className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <Badge variant="warning">Akses Terbatas Peserta</Badge>
            <CardTitle className="text-xl">Login Diperlukan</CardTitle>
            <CardDescription className="text-xs">
              Hanya peserta yang telah masuk (login) yang dapat mengerjakan simulasi CBT dan latihan soal untuk mencatat riwayat skor kelulusan Anda.
            </CardDescription>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <Button asChild variant="gradient" className="w-full h-11">
              <Link href={`/login?redirect=/exams/${examId}?mode=${mode}`}>
                <LogIn className="h-4 w-4" />
                <span>Masuk Sekarang (Login)</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/register">
                <span>Daftar Akun Peserta Baru</span>
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (loading || !exam) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center space-y-3">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          <p className="text-xs font-semibold text-zinc-500">
            Menyiapkan lembar ujian CBT...
          </p>
        </div>
      </div>
    );
  }

  const handleSelectOption = (questionId: string, optionKey: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionKey,
    }));
  };

  const handleToggleFlag = (questionNumber: number) => {
    setFlagged((prev) => ({
      ...prev,
      [questionNumber]: !prev[questionNumber],
    }));
  };

  const handleSubmit = async () => {
    if (mode === "cbt") {
      const unanswered = exam.questions.length - Object.keys(answers).length;
      if (
        unanswered > 0 &&
        !window.confirm(
          `Masih ada ${unanswered} soal yang belum dijawab. Apakah Anda yakin ingin menyelesaikan ujian sekarang?`
        )
      ) {
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const res = await submitExamAttempt(exam.id, answers, timeSpent, user?.id);
      setResult(res);
      setShowResultModal(true);
    } catch (err: any) {
      alert(`Gagal mengirim jawaban: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQuestion = exam.questions[currentIndex];

  return (
    <div className="min-h-screen bg-zinc-100/70 pb-24 dark:bg-zinc-950">
      {/* Top Session Bar */}
      <div className="sticky top-16 z-30 border-b border-zinc-200 bg-white/90 px-4 py-3 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/90 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/exams"
              className="rounded-xl border border-zinc-200 p-2 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-zinc-900 dark:text-white">
                  {exam.title}
                </span>
                <span className="rounded-full bg-indigo-100 px-2 py-0.5 font-bold text-[10px] text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  {mode === "cbt" ? "Simulasi CBT" : "Latihan Santai"}
                </span>
              </div>
              <p className="text-[11px] text-zinc-500">
                {exam.level_name} • {exam.total_questions} Soal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {mode === "cbt" && (
              <ExamTimer
                initialSeconds={exam.duration_minutes * 60}
                onTimeUp={handleSubmit}
              />
            )}

            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              variant="gradient"
              size="sm"
            >
              <Send className="h-3.5 w-3.5" />
              <span>{isSubmitting ? "Menilai..." : "Kirim Jawaban (Submit)"}</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8 space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Main Question Card Area (8 cols) */}
          <div className="space-y-6 lg:col-span-8">
            {currentQuestion && (
              <QuestionCard
                question={currentQuestion}
                selectedAnswer={answers[currentQuestion.id]}
                onSelectAnswer={(opt: string) => handleSelectOption(currentQuestion.id, opt)}
                isFlagged={!!flagged[currentQuestion.question_number]}
                onToggleFlag={() => handleToggleFlag(currentQuestion.question_number)}
                mode={mode}
              />
            )}

            {/* Stepper Navigation */}
            <div className="flex items-center justify-between rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <Button
                variant="outline"
                size="sm"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Soal Sebelumnya</span>
              </Button>

              <span className="text-xs font-semibold text-zinc-500">
                Soal {currentIndex + 1} dari {exam.questions.length}
              </span>

              <Button
                variant="outline"
                size="sm"
                disabled={currentIndex === exam.questions.length - 1}
                onClick={() =>
                  setCurrentIndex((prev) =>
                    Math.min(exam.questions.length - 1, prev + 1)
                  )
                }
              >
                <span>Soal Berikutnya</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Question Palette Sidebar (4 cols) */}
          <div className="lg:col-span-4">
            <div className="sticky top-36">
              <QuestionPalette
                questions={exam.questions}
                currentIndex={currentIndex}
                answers={answers}
                flagged={flagged}
                onSelect={(idx: number) => setCurrentIndex(idx)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Result Modal */}
      {showResultModal && result && (
        <CBTResultModal
          result={result}
          examTitle={exam.title}
          onRetry={() => {
            setAnswers({});
            setFlagged({});
            setShowResultModal(false);
          }}
        />
      )}
    </div>
  );
}
