"use client";

import { Question } from "@/types";
import { Flag, CheckCircle2, Circle } from "lucide-react";

interface QuestionPaletteProps {
  questions: Question[];
  currentIndex: number;
  answers: Record<string, string>;
  flagged: Record<number, boolean>;
  onSelect: (index: number) => void;
}

export function QuestionPalette({
  questions,
  currentIndex,
  answers,
  flagged,
  onSelect,
}: QuestionPaletteProps) {
  const answeredCount = Object.keys(answers).length;
  const flaggedCount = Object.values(flagged).filter(Boolean).length;
  const total = questions.length;

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
        <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Palet Soal ({total})</h3>
        <span className="text-xs text-zinc-500">
          {answeredCount}/{total} Selesai
        </span>
      </div>

      {/* Status Legends */}
      <div className="mt-3 grid grid-cols-3 gap-2 text-[11px] text-zinc-500 dark:text-zinc-400">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded bg-emerald-500"></div>
          <span>Dijawab ({answeredCount})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded bg-amber-500"></div>
          <span>Ragu ({flaggedCount})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded border border-zinc-300 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800"></div>
          <span>Belum ({total - answeredCount})</span>
        </div>
      </div>

      {/* Grid of Question Numbers */}
      <div className="mt-4 grid grid-cols-5 gap-2 max-h-64 overflow-y-auto pr-1">
        {questions.map((q, idx) => {
          const isCurrent = idx === currentIndex;
          const isAnswered = !!answers[q.id];
          const isFlagged = !!flagged[q.question_number];

          let btnStyle = "border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800/60 dark:text-zinc-300";

          if (isAnswered) {
            btnStyle = "border-emerald-500 bg-emerald-50 text-emerald-700 font-semibold dark:bg-emerald-950/50 dark:text-emerald-300";
          }
          if (isFlagged) {
            btnStyle = "border-amber-500 bg-amber-50 text-amber-700 font-semibold dark:bg-amber-950/50 dark:text-amber-300";
          }
          if (isCurrent) {
            btnStyle = "border-indigo-600 bg-indigo-600 text-white font-bold shadow-sm shadow-indigo-500/30 scale-105";
          }

          return (
            <button
              key={q.id}
              onClick={() => onSelect(idx)}
              className={`relative flex h-9 w-full items-center justify-center rounded-lg border text-xs transition-all ${btnStyle}`}
            >
              {q.question_number}
              {isFlagged && !isCurrent && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-amber-500 text-[8px] text-white">
                  ★
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
