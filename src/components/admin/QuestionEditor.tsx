"use client";

import { useState } from "react";
import { Question, Option } from "@/types";
import { aiTranslateQuestion } from "@/lib/api";
import { Check, Edit3, Sparkles, Image, CheckCircle, Globe, Layers } from "lucide-react";

interface QuestionEditorProps {
  question: Question;
  onUpdateQuestion: (updated: Question) => void;
  onSelectPage: (page: number) => void;
}

export function QuestionEditor({
  question,
  onUpdateQuestion,
  onSelectPage,
}: QuestionEditorProps) {
  const [activeTab, setActiveTab] = useState<"ja" | "en" | "id" | "vi" | "preview">("ja");
  const [isTranslating, setIsTranslating] = useState(false);

  const handleFieldChange = (field: keyof Question, value: any) => {
    onUpdateQuestion({
      ...question,
      [field]: value,
    });
  };

  const handleOptionChange = (idx: number, key: keyof Option, value: string) => {
    const updatedOptions = [...question.options];
    updatedOptions[idx] = {
      ...updatedOptions[idx],
      [key]: value,
    };
    handleFieldChange("options", updatedOptions);
  };

  const handleAITranslate = async () => {
    setIsTranslating(true);
    try {
      const res = await aiTranslateQuestion(question, ["en", "id", "vi"]);
      if (res.success) {
        onUpdateQuestion(res.question);
      }
    } catch (err: any) {
      alert(`AI Translation error: ${err.message}`);
    } finally {
      setIsTranslating(false);
    }
  };

  const API_STATIC_BASE = process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") || "http://127.0.0.1:8000";

  return (
    <div className="flex h-full flex-col rounded-3xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      {/* Editor Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-100 p-4 dark:border-zinc-800">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-indigo-600 font-bold text-xs text-white">
            Q{question.question_number}
          </span>
          <h3 className="font-bold text-sm text-zinc-900 dark:text-white">
            Editor Soal #{question.question_number}
          </h3>
          {question.source_page && (
            <button
              onClick={() => onSelectPage(question.source_page!)}
              className="rounded-lg bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600 hover:bg-indigo-50 hover:text-indigo-600 dark:bg-zinc-800 dark:text-zinc-300"
            >
              PDF Hal. {question.source_page}
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* AI Auto-Translate Button */}
          <button
            onClick={handleAITranslate}
            disabled={isTranslating}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm shadow-purple-500/20 hover:opacity-90 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>{isTranslating ? "Menerjemahkan AI..." : "AI Auto-Translate"}</span>
          </button>

          {/* Language / Preview Tab Switcher */}
          <div className="flex items-center rounded-xl border border-zinc-200 bg-zinc-50 p-1 dark:border-zinc-700 dark:bg-zinc-800">
            <button
              onClick={() => setActiveTab("ja")}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold cursor-pointer ${
                activeTab === "ja"
                  ? "bg-indigo-600 text-white"
                  : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }`}
            >
              JA
            </button>
            <button
              onClick={() => setActiveTab("en")}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold cursor-pointer ${
                activeTab === "en"
                  ? "bg-indigo-600 text-white"
                  : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setActiveTab("id")}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold cursor-pointer ${
                activeTab === "id"
                  ? "bg-indigo-600 text-white"
                  : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }`}
            >
              ID
            </button>
            <button
              onClick={() => setActiveTab("vi")}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold cursor-pointer ${
                activeTab === "vi"
                  ? "bg-indigo-600 text-white"
                  : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }`}
            >
              VI
            </button>
            <button
              onClick={() => setActiveTab("preview")}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold cursor-pointer ${
                activeTab === "preview"
                  ? "bg-purple-600 text-white"
                  : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }`}
            >
              Preview
            </button>
          </div>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
        {activeTab !== "preview" ? (
          <>
            {/* Meta: Kunci & Kategori */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Kunci Jawaban Resmi:
                </label>
                <select
                  value={question.correct_answer || ""}
                  onChange={(e) => handleFieldChange("correct_answer", e.target.value)}
                  className="mt-1 w-full rounded-xl border border-zinc-300 bg-zinc-50 p-2.5 font-bold text-sm text-indigo-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-indigo-300"
                >
                  <option value="">-- Pilih Kunci --</option>
                  <option value="ア">ア (A)</option>
                  <option value="イ">イ (B)</option>
                  <option value="ウ">ウ (C)</option>
                  <option value="エ">エ (D)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Kategori / Bidang:
                </label>
                <input
                  type="text"
                  value={question.category || ""}
                  onChange={(e) => handleFieldChange("category", e.target.value)}
                  placeholder="e.g. テクノロジ系 / データベース"
                  className="mt-1 w-full rounded-xl border border-zinc-300 bg-zinc-50 p-2.5 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                />
              </div>
            </div>

            {/* Question Text in Selected Language */}
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Teks Pertanyaan (
                  {activeTab === "ja" && "JA - Bahasa Jepang Asli"}
                  {activeTab === "en" && "EN - English"}
                  {activeTab === "id" && "ID - Bahasa Indonesia"}
                  {activeTab === "vi" && "VI - Tiếng Việt"}
                  ):
                </label>
              </div>
              <textarea
                rows={4}
                value={
                  activeTab === "ja"
                    ? question.question_text_ja
                    : activeTab === "en"
                    ? question.question_text_en || ""
                    : activeTab === "id"
                    ? question.question_text_id || ""
                    : question.question_text_vi || ""
                }
                onChange={(e) => {
                  const val = e.target.value;
                  if (activeTab === "ja") handleFieldChange("question_text_ja", val);
                  else if (activeTab === "en") handleFieldChange("question_text_en", val);
                  else if (activeTab === "id") handleFieldChange("question_text_id", val);
                  else if (activeTab === "vi") handleFieldChange("question_text_vi", val);
                }}
                placeholder="Masukkan teks soal..."
                className="mt-1 w-full rounded-2xl border border-zinc-300 bg-zinc-50 p-3.5 text-sm leading-relaxed text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
            </div>

            {/* Cropped Diagrams */}
            {question.diagram_urls && question.diagram_urls.length > 0 && (
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  <Image className="h-3.5 w-3.5 text-indigo-600" />
                  <span>Diagram Ter-crop Otomatis:</span>
                </label>
                <div className="mt-2 flex flex-wrap gap-3">
                  {question.diagram_urls.map((url, i) => (
                    <img
                      key={i}
                      src={`${API_STATIC_BASE}${url}`}
                      alt="Diagram"
                      className="h-32 rounded-xl border border-zinc-300 object-contain p-1 dark:border-zinc-700"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Options List Editor */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                Pilihan Jawaban (Opsi {activeTab.toUpperCase()}):
              </label>
              <div className="space-y-3">
                {question.options.map((opt, idx) => (
                  <div
                    key={`opt-${opt.key || 'key'}-${idx}`}
                    className={`rounded-2xl border p-3.5 ${
                      opt.key === question.correct_answer
                        ? "border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20"
                        : "border-zinc-200 bg-zinc-50/60 dark:border-zinc-700 dark:bg-zinc-800/40"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-xs text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5">
                        <span>Opsi {opt.key}</span>
                        {opt.key === question.correct_answer && (
                          <span className="inline-flex items-center gap-1 rounded bg-emerald-100 dark:bg-emerald-950/60 px-1.5 py-0.5 text-[10px] text-emerald-700 dark:text-emerald-300">
                            <Check className="h-3 w-3" />
                            <span>Kunci Benar</span>
                          </span>
                        )}
                      </span>
                    </div>
                    <input
                      type="text"
                      value={
                        activeTab === "ja"
                          ? opt.text_ja
                          : activeTab === "en"
                          ? opt.text_en || ""
                          : activeTab === "id"
                          ? opt.text_id || ""
                          : opt.text_vi || ""
                      }
                      onChange={(e) => {
                        const val = e.target.value;
                        if (activeTab === "ja") handleOptionChange(idx, "text_ja", val);
                        else if (activeTab === "en") handleOptionChange(idx, "text_en", val);
                        else if (activeTab === "id") handleOptionChange(idx, "text_id", val);
                        else if (activeTab === "vi") handleOptionChange(idx, "text_vi", val);
                      }}
                      placeholder={`Teks Opsi ${opt.key} (${activeTab.toUpperCase()})`}
                      className="w-full rounded-xl border border-zinc-300 bg-white p-2.5 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Explanation & Commentary */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Pembahasan / Penjelasan Teknis ({activeTab.toUpperCase()}):
              </label>
              <textarea
                rows={3}
                value={
                  activeTab === "ja"
                    ? question.explanation_ja || ""
                    : activeTab === "en"
                    ? question.explanation_en || ""
                    : activeTab === "id"
                    ? question.explanation_id || ""
                    : question.explanation_vi || ""
                }
                onChange={(e) => {
                  const val = e.target.value;
                  if (activeTab === "ja") handleFieldChange("explanation_ja", val);
                  else if (activeTab === "en") handleFieldChange("explanation_en", val);
                  else if (activeTab === "id") handleFieldChange("explanation_id", val);
                  else if (activeTab === "vi") handleFieldChange("explanation_vi", val);
                }}
                placeholder="Penjelasan teknis..."
                className="mt-1 w-full rounded-2xl border border-zinc-300 bg-zinc-50 p-3 text-xs leading-relaxed text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 space-y-4 dark:border-zinc-800 dark:bg-zinc-950/40">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                Preview Multilingual
              </span>
              <h4 className="font-bold text-sm text-zinc-900 dark:text-white mt-1">
                Q{question.question_number}. {question.question_text_ja}
              </h4>
              {question.question_text_en && (
                <p className="mt-1 text-xs text-blue-600 dark:text-blue-400">
                  <span className="font-bold mr-1 text-[10px] uppercase rounded bg-blue-50 dark:bg-blue-950 px-1 py-0.5">EN</span>
                  {question.question_text_en}
                </p>
              )}
              {question.question_text_id && (
                <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
                  <span className="font-bold mr-1 text-[10px] uppercase rounded bg-emerald-50 dark:bg-emerald-950 px-1 py-0.5">ID</span>
                  {question.question_text_id}
                </p>
              )}
            </div>

            <div className="space-y-2">
              {question.options.map((opt) => (
                <div
                  key={opt.key}
                  className={`flex items-start gap-3 rounded-xl border p-3 text-xs ${
                    opt.key === question.correct_answer
                      ? "border-emerald-500 bg-emerald-50 font-semibold text-emerald-950 dark:bg-emerald-950/40 dark:text-emerald-200"
                      : "border-zinc-200 bg-white text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
                  }`}
                >
                  <span className="font-bold">{opt.key}.</span>
                  <div className="space-y-0.5">
                    <div>{opt.text_ja}</div>
                    {opt.text_en && <div className="text-[11px] text-blue-600 dark:text-blue-400"><span className="font-bold mr-1 text-[9px] uppercase rounded bg-blue-50 dark:bg-blue-950 px-1 py-0.2">EN</span>{opt.text_en}</div>}
                    {opt.text_id && <div className="text-[11px] text-emerald-600 dark:text-emerald-400"><span className="font-bold mr-1 text-[9px] uppercase rounded bg-emerald-50 dark:bg-emerald-950 px-1 py-0.2">ID</span>{opt.text_id}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
