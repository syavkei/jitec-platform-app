"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Exam, Question, Option } from "@/types";
import { fetchExams, fetchExamById, saveQuestionToExam, deleteQuestionFromExam, aiTranslateQuestion } from "@/lib/api";
import { FuriganaText } from "@/components/common/FuriganaTooltip";
import {
  HelpCircle,
  Plus,
  Edit3,
  Trash2,
  Search,
  Sparkles,
  CheckCircle2,
  X,
  Languages,
  Layers,
  ArrowRight,
} from "lucide-react";

function QuestionsManagementContent() {
  const searchParams = useSearchParams();
  const initialExamId = searchParams.get("examId") || "";

  const [exams, setExams] = useState<{ id: string; title: string }[]>([]);
  const [selectedExamId, setSelectedExamId] = useState(initialExamId);
  const [currentExam, setCurrentExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  // Load all exams for the dropdown
  useEffect(() => {
    fetchExams().then((data) => {
      setExams(data.map((d) => ({ id: d.id, title: d.title })));
      if (!selectedExamId && data.length > 0) {
        setSelectedExamId(data[0].id);
      }
    });
  }, []);

  // Load current exam questions
  const loadExamQuestions = (examId: string) => {
    if (!examId) return;
    setLoading(true);
    fetchExamById(examId)
      .then((examData) => {
        setCurrentExam(examData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    if (selectedExamId) {
      loadExamQuestions(selectedExamId);
    }
  }, [selectedExamId]);

  const handleOpenCreate = () => {
    if (!currentExam) return;
    const nextQNum = (currentExam.questions.length || 0) + 1;
    setEditingQuestion({
      id: `${currentExam.id}_q${nextQNum}`,
      question_number: nextQNum,
      question_text_ja: "",
      question_text_en: "",
      question_text_id: "",
      question_text_vi: "",
      options: [
        { key: "ア", text_ja: "", text_en: "", text_id: "", text_vi: "" },
        { key: "イ", text_ja: "", text_en: "", text_id: "", text_vi: "" },
        { key: "ウ", text_ja: "", text_en: "", text_id: "", text_vi: "" },
        { key: "エ", text_ja: "", text_en: "", text_id: "", text_vi: "" },
      ],
      correct_answer: "ア",
      category: "テクノロジ系 (Technology)",
      explanation_ja: "",
      explanation_id: "",
      explanation_en: "",
      explanation_vi: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (q: Question) => {
    setEditingQuestion(JSON.parse(JSON.stringify(q)));
    setIsModalOpen(true);
  };

  const handleDelete = async (questionId: string, qNum: number) => {
    if (!selectedExamId) return;
    if (!window.confirm(`Hapus soal nomor #${qNum}?`)) return;
    try {
      await deleteQuestionFromExam(selectedExamId, questionId);
      loadExamQuestions(selectedExamId);
    } catch (err: any) {
      alert(`Gagal menghapus: ${err.message}`);
    }
  };

  const handleAITranslateCurrent = async () => {
    if (!editingQuestion) return;
    setIsTranslating(true);
    try {
      const res = await aiTranslateQuestion(editingQuestion, ["en", "id", "vi"]);
      if (res.success) {
        setEditingQuestion(res.question);
      }
    } catch (err: any) {
      alert(`AI Translation error: ${err.message}`);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExamId || !editingQuestion) return;

    try {
      await saveQuestionToExam(selectedExamId, editingQuestion);
      setIsModalOpen(false);
      loadExamQuestions(selectedExamId);
    } catch (err: any) {
      alert(`Gagal menyimpan soal: ${err.message}`);
    }
  };

  const questions = currentExam?.questions || [];
  const filteredQuestions = questions.filter((q) =>
    q.question_text_ja.toLowerCase().includes(search.toLowerCase()) ||
    (q.question_text_id && q.question_text_id.toLowerCase().includes(search.toLowerCase())) ||
    (q.question_text_en && q.question_text_en.toLowerCase().includes(search.toLowerCase())) ||
    (q.category && q.category.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 pb-6 dark:border-zinc-800">
        <div>
          <h1 className="font-extrabold text-2xl text-zinc-900 tracking-tight dark:text-white">
            Kelola Bank Soal (Questions CRUD)
          </h1>
          <p className="mt-1 text-xs text-zinc-500">
            Tambah, sunting isi soal, opsi, kunci jawaban, dan terjemahan multibahasa.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          disabled={!currentExam}
          className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 font-bold text-xs text-white shadow-md hover:bg-indigo-500 active:scale-95 disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Soal Baru</span>
        </button>
      </div>

      {/* Selector & Filter Bar */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="sm:col-span-1">
          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
            Pilih Lembar Ujian:
          </label>
          <select
            value={selectedExamId}
            onChange={(e) => setSelectedExamId(e.target.value)}
            className="w-full rounded-2xl border border-zinc-200 bg-white p-2.5 text-xs font-semibold text-zinc-900 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
          >
            {exams.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.title} ({ex.id})
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2 self-end">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari kata kunci soal (Kanji, English, Indonesia)..."
              className="w-full rounded-2xl border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-xs text-zinc-900 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {loading ? (
          <div className="rounded-3xl border border-zinc-200 bg-white p-12 text-center text-xs text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900">
            Memuat daftar soal...
          </div>
        ) : filteredQuestions.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-zinc-200 bg-white p-12 text-center text-xs text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900">
            Tidak ada soal yang ditemukan pada ujian ini.
          </div>
        ) : (
          filteredQuestions.map((q, idx) => (
            <div
              key={`qrow-${q.id || 'idx'}-${idx}`}
              className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 transition-all hover:border-indigo-300"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 pb-3 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 font-bold text-xs text-white">
                    #{q.question_number}
                  </span>
                  <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 font-semibold text-[11px] text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                    {q.category || "General"}
                  </span>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 font-bold text-[11px] text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    Kunci: {q.correct_answer || "?"}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(q)}
                    className="flex items-center gap-1 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(q.id, q.question_number)}
                    className="rounded-lg border border-red-200 p-1.5 text-red-600 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-xs leading-relaxed">
                <div className="font-semibold text-sm text-zinc-900 dark:text-white">
                  <FuriganaText text={q.question_text_ja} />
                </div>
                {q.question_text_en && (
                  <div className="text-blue-600 dark:text-blue-400">
                    🇬🇧 {q.question_text_en}
                  </div>
                )}
                {q.question_text_id && (
                  <div className="text-emerald-600 dark:text-emerald-400">
                    🇮🇩 {q.question_text_id}
                  </div>
                )}
              </div>

              {/* Options Grid */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {q.options.map((opt) => (
                  <div
                    key={opt.key}
                    className={`rounded-xl border p-2.5 text-xs ${
                      opt.key === q.correct_answer
                        ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 font-semibold"
                        : "border-zinc-200 bg-zinc-50/60 dark:border-zinc-800 dark:bg-zinc-800/40"
                    }`}
                  >
                    <span className="font-bold mr-1.5">{opt.key}.</span>
                    <span>{opt.text_ja}</span>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit / Create Question Modal */}
      {isModalOpen && editingQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-3xl my-8 rounded-3xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 sm:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4 dark:border-zinc-800">
              <div>
                <h3 className="font-extrabold text-lg text-zinc-900 dark:text-white">
                  Form Editor Soal #{editingQuestion.question_number}
                </h3>
                <p className="text-xs text-zinc-500">ID: {editingQuestion.id}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAITranslateCurrent}
                  disabled={isTranslating}
                  className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:opacity-90 disabled:opacity-50"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{isTranslating ? "Menerjemahkan..." : "✨ AI Auto-Translate"}</span>
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveQuestion} className="mt-6 space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300">
                    Nomor Soal:
                  </label>
                  <input
                    type="number"
                    value={editingQuestion.question_number}
                    onChange={(e) =>
                      setEditingQuestion({ ...editingQuestion, question_number: Number(e.target.value) })
                    }
                    className="mt-1 w-full rounded-xl border border-zinc-300 bg-zinc-50 p-2.5 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300">
                    Kunci Jawaban:
                  </label>
                  <select
                    value={editingQuestion.correct_answer || "ア"}
                    onChange={(e) =>
                      setEditingQuestion({ ...editingQuestion, correct_answer: e.target.value })
                    }
                    className="mt-1 w-full rounded-xl border border-zinc-300 bg-zinc-50 p-2.5 font-bold text-indigo-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-indigo-400"
                  >
                    <option value="ア">ア</option>
                    <option value="イ">イ</option>
                    <option value="ウ">ウ</option>
                    <option value="エ">エ</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300">
                    Kategori:
                  </label>
                  <input
                    type="text"
                    value={editingQuestion.category || ""}
                    onChange={(e) =>
                      setEditingQuestion({ ...editingQuestion, category: e.target.value })
                    }
                    placeholder="e.g. データベース"
                    className="mt-1 w-full rounded-xl border border-zinc-300 bg-zinc-50 p-2.5 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                  />
                </div>
              </div>

              {/* Japanese Question */}
              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300">
                  Teks Soal (🇯🇵 Bahasa Jepang):
                </label>
                <textarea
                  rows={3}
                  value={editingQuestion.question_text_ja}
                  onChange={(e) =>
                    setEditingQuestion({ ...editingQuestion, question_text_ja: e.target.value })
                  }
                  className="mt-1 w-full rounded-xl border border-zinc-300 bg-zinc-50 p-3 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                />
              </div>

              {/* English Question */}
              <div>
                <label className="block font-semibold text-blue-600 dark:text-blue-400">
                  Teks Soal (🇬🇧 English):
                </label>
                <textarea
                  rows={2}
                  value={editingQuestion.question_text_en || ""}
                  onChange={(e) =>
                    setEditingQuestion({ ...editingQuestion, question_text_en: e.target.value })
                  }
                  placeholder="English translation..."
                  className="mt-1 w-full rounded-xl border border-zinc-300 bg-zinc-50 p-2.5 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                />
              </div>

              {/* Indonesian Question */}
              <div>
                <label className="block font-semibold text-emerald-600 dark:text-emerald-400">
                  Teks Soal (🇮🇩 Bahasa Indonesia):
                </label>
                <textarea
                  rows={2}
                  value={editingQuestion.question_text_id || ""}
                  onChange={(e) =>
                    setEditingQuestion({ ...editingQuestion, question_text_id: e.target.value })
                  }
                  placeholder="Terjemahan bahasa Indonesia..."
                  className="mt-1 w-full rounded-xl border border-zinc-300 bg-zinc-50 p-2.5 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                />
              </div>

              {/* Options */}
              <div className="space-y-3 pt-2">
                <label className="block font-bold text-zinc-700 dark:text-zinc-300">
                  Pilihan Jawaban (Options):
                </label>
                {editingQuestion.options.map((opt, idx) => (
                  <div
                    key={`edit-opt-${opt.key || 'key'}-${idx}`}
                    className="rounded-2xl border border-zinc-200 bg-zinc-50/70 p-3 dark:border-zinc-700 dark:bg-zinc-800/50 space-y-2"
                  >
                    <div className="font-bold text-indigo-600">Opsi {opt.key}:</div>
                    <input
                      type="text"
                      value={opt.text_ja}
                      onChange={(e) => {
                        const copy = [...editingQuestion.options];
                        copy[idx].text_ja = e.target.value;
                        setEditingQuestion({ ...editingQuestion, options: copy });
                      }}
                      placeholder={`🇯🇵 Teks Jepang Opsi ${opt.key}`}
                      className="w-full rounded-lg border border-zinc-300 bg-white p-2 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={opt.text_en || ""}
                        onChange={(e) => {
                          const copy = [...editingQuestion.options];
                          copy[idx].text_en = e.target.value;
                          setEditingQuestion({ ...editingQuestion, options: copy });
                        }}
                        placeholder={`🇬🇧 English Opsi ${opt.key}`}
                        className="w-full rounded-lg border border-zinc-200 bg-white p-1.5 text-[11px] text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
                      />
                      <input
                        type="text"
                        value={opt.text_id || ""}
                        onChange={(e) => {
                          const copy = [...editingQuestion.options];
                          copy[idx].text_id = e.target.value;
                          setEditingQuestion({ ...editingQuestion, options: copy });
                        }}
                        placeholder={`🇮🇩 Indonesia Opsi ${opt.key}`}
                        className="w-full rounded-lg border border-zinc-200 bg-white p-1.5 text-[11px] text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Explanation */}
              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300">
                  Pembahasan / Penjelasan:
                </label>
                <textarea
                  rows={3}
                  value={editingQuestion.explanation_id || editingQuestion.explanation_ja || ""}
                  onChange={(e) =>
                    setEditingQuestion({ ...editingQuestion, explanation_id: e.target.value })
                  }
                  placeholder="Penjelasan teknis mengapa opsi tersebut benar..."
                  className="mt-1 w-full rounded-xl border border-zinc-300 bg-zinc-50 p-2.5 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-zinc-100 pt-4 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-zinc-200 px-4 py-2 font-semibold text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-5 py-2 font-bold text-white hover:bg-indigo-500"
                >
                  Simpan Soal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminQuestionsManagementPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-zinc-400">Memuat modul soal...</div>}>
      <QuestionsManagementContent />
    </Suspense>
  );
}
