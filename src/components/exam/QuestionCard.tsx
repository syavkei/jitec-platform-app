"use client";

import { useState } from "react";
import { Question, SupportedLang } from "@/types";
import { FuriganaText } from "../common/FuriganaTooltip";
import { Flag, Languages, CheckCircle, XCircle, Info, HelpCircle, Columns, Sparkles } from "lucide-react";

interface QuestionCardProps {
  question: Question;
  selectedAnswer?: string;
  isFlagged?: boolean;
  onSelectAnswer: (key: string) => void;
  onToggleFlag: () => void;
  mode?: "cbt" | "practice";
}

export function QuestionCard({
  question,
  selectedAnswer,
  isFlagged,
  onSelectAnswer,
  onToggleFlag,
  mode = "cbt",
}: QuestionCardProps) {
  const [activeLang, setActiveLang] = useState<SupportedLang>("ja");
  const [isDualView, setIsDualView] = useState(false);
  const [hasRevealedPractice, setHasRevealedPractice] = useState(false);

  const isPractice = mode === "practice";
  const isCorrect = selectedAnswer && question.correct_answer && selectedAnswer.toUpperCase() === question.correct_answer.toUpperCase();

  const API_STATIC_BASE = process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") || "http://127.0.0.1:8000";

  const getTranslatedQuestionText = (lang: SupportedLang) => {
    if (lang === "en") return question.question_text_en;
    if (lang === "id") return question.question_text_id;
    if (lang === "vi") return question.question_text_vi;
    return null;
  };

  const getTranslatedOptionText = (opt: any, lang: SupportedLang) => {
    if (lang === "en") return opt.text_en;
    if (lang === "id") return opt.text_id;
    if (lang === "vi") return opt.text_vi;
    return null;
  };

  const getTranslatedExplanation = (lang: SupportedLang) => {
    if (lang === "en") return question.explanation_en;
    if (lang === "id") return question.explanation_id;
    if (lang === "vi") return question.explanation_vi;
    return question.explanation_ja;
  };

  const targetTranslation = getTranslatedQuestionText(activeLang === "ja" ? "en" : activeLang);

  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition-all dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 pb-4 dark:border-zinc-800">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-100 font-extrabold text-indigo-700 text-sm dark:bg-indigo-950 dark:text-indigo-400">
            {question.question_number}
          </span>
          {question.category && (
            <span className="rounded-full bg-zinc-100 px-3 py-1 font-medium text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
              {question.category}
            </span>
          )}
          {question.source_page && (
            <span className="text-[11px] text-zinc-400">
              Hal. {question.source_page}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Multilingual Switcher Pills */}
          <div className="flex items-center rounded-xl border border-zinc-200 bg-zinc-50 p-0.5 dark:border-zinc-700 dark:bg-zinc-800">
            <button
              onClick={() => { setActiveLang("ja"); setIsDualView(false); }}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                activeLang === "ja" && !isDualView
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-300"
              }`}
            >
              🇯🇵 JA
            </button>
            <button
              onClick={() => { setActiveLang("en"); setIsDualView(false); }}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                activeLang === "en" && !isDualView
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-300"
              }`}
            >
              🇬🇧 EN
            </button>
            <button
              onClick={() => { setActiveLang("id"); setIsDualView(false); }}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                activeLang === "id" && !isDualView
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-300"
              }`}
            >
              🇮🇩 ID
            </button>
            <button
              onClick={() => { setActiveLang("vi"); setIsDualView(false); }}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                activeLang === "vi" && !isDualView
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-300"
              }`}
            >
              🇻🇳 VI
            </button>
            <button
              onClick={() => setIsDualView(!isDualView)}
              title="Tampilkan Bahasa Jepang dan Terjemahan Sekaligus"
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                isDualView
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-purple-600 hover:bg-purple-50 dark:text-purple-400"
              }`}
            >
              <Columns className="h-3 w-3" />
              <span>Dual</span>
            </button>
          </div>

          {/* Flag / Review Button */}
          <button
            onClick={onToggleFlag}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors ${
              isFlagged
                ? "border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                : "border-zinc-200 bg-zinc-50 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
            }`}
          >
            <Flag className={`h-3.5 w-3.5 ${isFlagged ? "fill-amber-500 text-amber-600" : ""}`} />
            <span>{isFlagged ? "Ditandai" : "Ragu"}</span>
          </button>
        </div>
      </div>

      {/* Question Body */}
      <div className="mt-6 space-y-4">
        {/* Dual View or Single View */}
        {isDualView ? (
          <div className="space-y-4 rounded-2xl border border-purple-100 bg-purple-50/30 p-5 dark:border-purple-900/40 dark:bg-purple-950/20">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400 mb-1.5 flex items-center gap-1">
                <span>🇯🇵 Lembar Asli Jepang (Hover Kanji Furigana)</span>
              </div>
              <div className="text-base sm:text-lg font-medium text-zinc-900 leading-relaxed dark:text-white">
                <FuriganaText text={question.question_text_ja} />
              </div>
            </div>

            <div className="border-t border-purple-200/60 pt-3 dark:border-purple-900/60">
              <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 mb-1.5">
                <span>🌐 Terjemahan ({activeLang.toUpperCase()})</span>
              </div>
              <p className="text-sm sm:text-base font-normal text-zinc-700 dark:text-zinc-200 leading-relaxed">
                {getTranslatedQuestionText(activeLang) || getTranslatedQuestionText("en") || getTranslatedQuestionText("id") || (
                  <span className="italic text-zinc-400">Terjemahan bahasa ini belum tersedia. Gunakan tombol AI Translate di Admin Studio.</span>
                )}
              </p>
            </div>
          </div>
        ) : (
          <div>
            <div className="text-base sm:text-lg font-medium text-zinc-900 leading-relaxed dark:text-white">
              {activeLang === "ja" ? (
                <FuriganaText text={question.question_text_ja} />
              ) : (
                <p>
                  {getTranslatedQuestionText(activeLang) || (
                    <FuriganaText text={question.question_text_ja} />
                  )}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Diagram Images */}
        {question.diagram_urls && question.diagram_urls.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-950/40">
            {question.diagram_urls.map((url, i) => (
              <img
                key={i}
                src={`${API_STATIC_BASE}${url}`}
                alt={`Diagram Soal ${question.question_number}`}
                className="max-h-80 rounded-xl border border-zinc-300 object-contain shadow-sm dark:border-zinc-700"
              />
            ))}
          </div>
        )}
      </div>

      {/* Options List */}
      <div className="mt-6 space-y-3">
        {question.options.map((opt) => {
          const isSelected = selectedAnswer === opt.key;
          const isOfficialCorrect = question.correct_answer && opt.key.toUpperCase() === question.correct_answer.toUpperCase();

          let cardStyle = "border-zinc-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/30 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700";

          if (isSelected) {
            cardStyle = "border-indigo-600 bg-indigo-50/80 ring-2 ring-indigo-600/20 text-indigo-950 dark:bg-indigo-950/40 dark:text-indigo-200";
          }

          if (isPractice && hasRevealedPractice) {
            if (isOfficialCorrect) {
              cardStyle = "border-emerald-500 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500/20 dark:bg-emerald-950/50 dark:text-emerald-200";
            } else if (isSelected && !isOfficialCorrect) {
              cardStyle = "border-red-500 bg-red-50 text-red-950 ring-2 ring-red-500/20 dark:bg-red-950/50 dark:text-red-200";
            }
          }

          const optTranslated = getTranslatedOptionText(opt, activeLang);

          return (
            <button
              key={opt.key}
              onClick={() => {
                onSelectAnswer(opt.key);
                if (isPractice) setHasRevealedPractice(true);
              }}
              className={`flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition-all ${cardStyle}`}
            >
              <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl font-bold text-sm transition-colors ${
                isSelected
                  ? "bg-indigo-600 text-white"
                  : "border border-zinc-300 bg-zinc-100 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
              }`}>
                {opt.key}
              </div>

              <div className="flex-1 pt-0.5 text-sm sm:text-base leading-relaxed text-zinc-800 dark:text-zinc-200">
                {isDualView ? (
                  <div className="space-y-1">
                    <div><FuriganaText text={opt.text_ja} /></div>
                    {optTranslated && (
                      <div className="text-xs text-zinc-500 dark:text-zinc-400">{optTranslated}</div>
                    )}
                  </div>
                ) : activeLang === "ja" ? (
                  <FuriganaText text={opt.text_ja} />
                ) : (
                  <div>{optTranslated || <FuriganaText text={opt.text_ja} />}</div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Practice Mode: Instant Explanation Box */}
      {isPractice && hasRevealedPractice && (
        <div className={`mt-6 rounded-2xl border p-5 ${
          isCorrect
            ? "border-emerald-200 bg-emerald-50/70 dark:border-emerald-900 dark:bg-emerald-950/30"
            : "border-red-200 bg-red-50/70 dark:border-red-900 dark:bg-red-950/30"
        }`}>
          <div className="flex items-center gap-2">
            {isCorrect ? (
              <div className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400">
                <CheckCircle className="h-5 w-5" />
                <span>Jawaban Benar! (Kunci Resmi: {question.correct_answer})</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 font-bold text-red-700 dark:text-red-400">
                <XCircle className="h-5 w-5" />
                <span>Jawaban Belum Tepat. Kunci Resmi: {question.correct_answer}</span>
              </div>
            )}
          </div>

          <div className="mt-3 text-xs sm:text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
            <span className="font-bold text-zinc-900 dark:text-white">💡 Pembahasan: </span>
            {getTranslatedExplanation(activeLang) || question.explanation_id || question.explanation_ja}
          </div>

          {question.examiner_commentary && (
            <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50/80 p-3 text-xs text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300">
              <span className="font-bold">📝 Komentar Penguji IPA (採点講評): </span>
              {question.examiner_commentary}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
