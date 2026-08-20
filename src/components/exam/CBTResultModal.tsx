"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";
import { ExamSubmitResponse } from "@/types";
import { Trophy, XCircle, CheckCircle2, RotateCcw, ArrowRight, Clock, Award } from "lucide-react";
import Link from "next/link";

interface CBTResultModalProps {
  result: ExamSubmitResponse;
  examTitle: string;
  onRetry: () => void;
}

export function CBTResultModal({ result, examTitle, onRetry }: CBTResultModalProps) {
  useEffect(() => {
    if (result.is_passed) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [result.is_passed]);

  const minutes = Math.floor(result.time_spent_seconds / 60);
  const seconds = result.time_spent_seconds % 60;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-3xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
        {/* Header Status */}
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr shadow-lg">
            {result.is_passed ? (
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-emerald-500/30">
                <Trophy className="h-8 w-8" />
              </div>
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white shadow-rose-500/30">
                <Award className="h-8 w-8" />
              </div>
            )}
          </div>

          <h2 className="mt-4 font-extrabold text-2xl text-zinc-900 dark:text-white">
            {result.is_passed ? "Selamat! Anda LULUS (合格)" : "Hasil Simulasi Ujian (不合格)"}
          </h2>
          <p className="mt-1 text-xs text-zinc-500">{examTitle}</p>
        </div>

        {/* Scaled Score Box */}
        <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50/70 p-5 text-center dark:border-zinc-800 dark:bg-zinc-950/50">
          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Skor Resmi JITEC (Skala 1000 Poin)
          </div>
          <div className="mt-1 flex items-baseline justify-center gap-2">
            <span className={`font-black text-5xl tracking-tight ${
              result.is_passed ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
            }`}>
              {result.scaled_score}
            </span>
            <span className="font-bold text-lg text-zinc-400">/ 1000</span>
          </div>
          <div className="mt-2 text-xs text-zinc-500">
            Standar Kelulusan: <span className="font-semibold text-zinc-800 dark:text-zinc-200">≥ 600 Poin ({result.score_percentage}%)</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3 text-center dark:border-emerald-950 dark:bg-emerald-950/20">
            <div className="text-[11px] text-emerald-700 dark:text-emerald-400">Jawaban Benar</div>
            <div className="mt-1 font-bold text-xl text-emerald-800 dark:text-emerald-300">
              {result.correct_count}
            </div>
          </div>
          <div className="rounded-xl border border-rose-100 bg-rose-50/50 p-3 text-center dark:border-rose-950 dark:bg-rose-950/20">
            <div className="text-[11px] text-rose-700 dark:text-rose-400">Jawaban Salah</div>
            <div className="mt-1 font-bold text-xl text-rose-800 dark:text-rose-300">
              {result.incorrect_count}
            </div>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-center dark:border-zinc-800 dark:bg-zinc-800/40">
            <div className="text-[11px] text-zinc-500">Kosong</div>
            <div className="mt-1 font-bold text-xl text-zinc-700 dark:text-zinc-300">
              {result.unanswered_count}
            </div>
          </div>
          <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-3 text-center dark:border-indigo-950 dark:bg-indigo-950/20">
            <div className="text-[11px] text-indigo-700 dark:text-indigo-400">Waktu Tempuh</div>
            <div className="mt-1 font-bold text-base text-indigo-800 dark:text-indigo-300">
              {minutes}m {seconds}s
            </div>
          </div>
        </div>

        {/* Detailed Breakdown List */}
        <div className="mt-6">
          <h4 className="font-semibold text-xs text-zinc-700 dark:text-zinc-300">
            Review Jawaban Nomor Soal:
          </h4>
          <div className="mt-2.5 max-h-44 overflow-y-auto space-y-1.5 pr-1">
            {result.results.map((r) => (
              <div
                key={r.question_number}
                className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs ${
                  r.is_correct
                    ? "bg-emerald-50 text-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200"
                    : "bg-rose-50 text-rose-900 dark:bg-rose-950/30 dark:text-rose-200"
                }`}
              >
                <span className="font-bold">Soal {r.question_number}</span>
                <div className="flex items-center gap-3">
                  <span>Pilihan Anda: <strong className="uppercase">{r.selected_answer || "Kosong"}</strong></span>
                  <span>Kunci: <strong className="uppercase text-indigo-600 dark:text-indigo-400">{r.correct_answer}</strong></span>
                  {r.is_correct ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-rose-600" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-end gap-3 border-t border-zinc-100 pt-4 dark:border-zinc-800">
          <button
            onClick={onRetry}
            className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Ulangi Ujian</span>
          </button>
          <Link
            href="/exams"
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500"
          >
            <span>Katalog Ujian Lain</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
