"use client";

import { useEffect, useState } from "react";
import { AvailableFile, Exam, Question } from "@/types";
import { fetchAvailableFiles, parsePdf, publishExam, batchAiTranslateExam } from "@/lib/api";
import { PdfViewer } from "@/components/admin/PdfViewer";
import { QuestionEditor } from "@/components/admin/QuestionEditor";
import {
  Settings,
  FileText,
  Play,
  CheckCircle2,
  AlertTriangle,
  Send,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Database,
  ArrowRight,
  Globe,
} from "lucide-react";
import Link from "next/link";

export default function AdminExtractorPage() {
  const [files, setFiles] = useState<AvailableFile[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [selectedFile, setSelectedFile] = useState<AvailableFile | null>(null);

  const [isParsing, setIsParsing] = useState(false);
  const [isBatchTranslating, setIsBatchTranslating] = useState(false);
  const [parsedExam, setParsedExam] = useState<Exam | null>(null);
  const [selectedQIndex, setSelectedQIndex] = useState(0);
  const [currentPdfPage, setCurrentPdfPage] = useState(1);

  const [publishStatus, setPublishStatus] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    fetchAvailableFiles()
      .then((data) => {
        setFiles(data);
        if (data.length > 0) setSelectedFile(data[0]);
        setLoadingFiles(false);
      })
      .catch(() => setLoadingFiles(false));
  }, []);

  const handleParse = async () => {
    if (!selectedFile) return;
    setIsParsing(true);
    setPublishStatus(null);

    try {
      const res = await parsePdf(
        selectedFile.relative_path,
        selectedFile.matched_ans_file || undefined,
        selectedFile.matched_cmnt_file || undefined
      );

      if (res.success) {
        setParsedExam(res.exam);
        setSelectedQIndex(0);
        if (res.exam.questions.length > 0 && res.exam.questions[0].source_page) {
          setCurrentPdfPage(res.exam.questions[0].source_page);
        }
      }
    } catch (err: any) {
      alert(`Gagal mem-parsing PDF: ${err.message}`);
    } finally {
      setIsParsing(false);
    }
  };

  const handleBatchAITranslate = async () => {
    if (!parsedExam) return;
    setIsBatchTranslating(true);
    try {
      const translatedExam = await batchAiTranslateExam(parsedExam, ["en", "id", "vi"]);
      setParsedExam({ ...translatedExam });
      alert("✨ Seluruh soal berhasil diterjemahkan ke EN, ID, dan VI oleh AI!");
    } catch (err: any) {
      alert(`Batch AI Translation gagal: ${err.message}`);
    } finally {
      setIsBatchTranslating(false);
    }
  };

  const handleUpdateQuestion = (updatedQ: Question) => {
    if (!parsedExam) return;
    const updatedList = [...parsedExam.questions];
    updatedList[selectedQIndex] = updatedQ;
    setParsedExam({
      ...parsedExam,
      questions: updatedList,
    });
  };

  const handlePublish = async () => {
    if (!parsedExam) return;
    setIsPublishing(true);

    try {
      const res = await publishExam(parsedExam);
      setPublishStatus(res.message);
    } catch (err: any) {
      alert(`Gagal mempublikasikan: ${err.message}`);
    } finally {
      setIsPublishing(false);
    }
  };

  const currentQ = parsedExam?.questions[selectedQIndex];

  return (
    <div className="min-h-screen bg-zinc-100/80 pb-20 dark:bg-zinc-950">
      {/* Studio Header */}
      <div className="border-b border-zinc-200 bg-white px-4 py-4 dark:border-zinc-800 dark:bg-zinc-900 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-600 font-bold text-white shadow-md shadow-rose-500/20">
              <Settings className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-lg text-zinc-900 dark:text-white">
                  PDF Ingestion & Multilingual AI Studio
                </h1>
                <span className="rounded-full bg-rose-100 px-2 py-0.5 font-bold text-[10px] text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                  ADMIN
                </span>
              </div>
              <p className="text-xs text-zinc-500">
                Ekstraksi otomatis soal PDF, crop diagram, dan terjemahan multibahasa (JA ➔ EN, ID, VI).
              </p>
            </div>
          </div>

          {parsedExam && (
            <div className="flex items-center gap-2.5">
              <button
                onClick={handleBatchAITranslate}
                disabled={isBatchTranslating}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 font-bold text-xs text-white shadow-md shadow-purple-500/20 hover:opacity-90 active:scale-95 disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4" />
                <span>{isBatchTranslating ? "Menerjemahkan Semua..." : "✨ AI Translate All (EN/ID/VI)"}</span>
              </button>

              <button
                onClick={handlePublish}
                disabled={isPublishing}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 font-bold text-xs text-white shadow-md shadow-emerald-500/20 hover:bg-emerald-500 active:scale-95 disabled:opacity-50"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>{isPublishing ? "Menyimpan..." : "Publikasikan ke Bank Soal"}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8 space-y-6">
        {/* Step 1: File Selector Toolbar */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex-1 min-w-[280px]">
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Pilih Berkas Kakomon dari Repositori Lokal:
              </label>
              {loadingFiles ? (
                <div className="h-10 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800" />
              ) : (
                <select
                  value={selectedFile?.id || ""}
                  onChange={(e) => {
                    const found = files.find((f) => f.id === e.target.value);
                    setSelectedFile(found || null);
                  }}
                  className="w-full rounded-2xl border border-zinc-300 bg-zinc-50 p-2.5 font-medium text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                >
                  {files.map((f) => (
                    <option key={f.id} value={f.id}>
                      [{f.code}] {f.filename} {f.matched_ans_file ? "✓ +Kunci Jawaban" : ""}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="flex items-center gap-3 self-end">
              <button
                onClick={handleParse}
                disabled={isParsing || !selectedFile}
                className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-2.5 font-bold text-xs text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-500 active:scale-95 disabled:opacity-50"
              >
                <Play className="h-4 w-4" />
                <span>{isParsing ? "Memproses PDF & Diagram..." : "Jalankan Ekstraksi"}</span>
              </button>
            </div>
          </div>

          {publishStatus && (
            <div className="mt-4 flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>{publishStatus}</span>
              </div>
              <Link
                href="/exams"
                className="flex items-center gap-1 font-semibold text-emerald-700 underline hover:text-emerald-800 dark:text-emerald-300"
              >
                <span>Lihat di Katalog</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          )}
        </div>

        {/* Step 2: Split-Screen Studio */}
        {parsedExam ? (
          <div className="space-y-4">
            {/* Question Switcher Stepper */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-white p-3.5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center gap-2">
                <button
                  disabled={selectedQIndex === 0}
                  onClick={() => {
                    const newIdx = Math.max(0, selectedQIndex - 1);
                    setSelectedQIndex(newIdx);
                    if (parsedExam.questions[newIdx].source_page) {
                      setCurrentPdfPage(parsedExam.questions[newIdx].source_page!);
                    }
                  }}
                  className="rounded-lg border border-zinc-200 p-1.5 hover:bg-zinc-100 disabled:opacity-30 dark:border-zinc-700 dark:hover:bg-zinc-800"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <div className="flex items-center gap-1.5 overflow-x-auto max-w-md py-1">
                  {parsedExam.questions.map((q, idx) => (
                    <button
                      key={q.id}
                      onClick={() => {
                        setSelectedQIndex(idx);
                        if (q.source_page) setCurrentPdfPage(q.source_page);
                      }}
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md font-bold text-xs transition-all ${
                        idx === selectedQIndex
                          ? "bg-indigo-600 text-white"
                          : q.correct_answer
                          ? "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300"
                          : "border border-amber-400 bg-amber-50 text-amber-700"
                      }`}
                    >
                      {q.question_number}
                    </button>
                  ))}
                </div>

                <button
                  disabled={selectedQIndex === parsedExam.questions.length - 1}
                  onClick={() => {
                    const newIdx = Math.min(parsedExam.questions.length - 1, selectedQIndex + 1);
                    setSelectedQIndex(newIdx);
                    if (parsedExam.questions[newIdx].source_page) {
                      setCurrentPdfPage(parsedExam.questions[newIdx].source_page!);
                    }
                  }}
                  className="rounded-lg border border-zinc-200 p-1.5 hover:bg-zinc-100 disabled:opacity-30 dark:border-zinc-700 dark:hover:bg-zinc-800"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="text-xs text-zinc-500">
                Total {parsedExam.questions.length} Soal Terekstraksi
              </div>
            </div>

            {/* Split Screen 2 Columns */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 min-h-[650px]">
              {/* Left Pane: PDF Viewer */}
              <div className="h-[650px]">
                <PdfViewer
                  pdfRelativePath={selectedFile?.relative_path || null}
                  currentPage={currentPdfPage}
                />
              </div>

              {/* Right Pane: Question Editor */}
              <div className="h-[650px]">
                {currentQ && (
                  <QuestionEditor
                    question={currentQ}
                    onUpdateQuestion={handleUpdateQuestion}
                    onSelectPage={(p) => setCurrentPdfPage(p)}
                  />
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
            <Sparkles className="h-10 w-10 text-indigo-500" />
            <h3 className="mt-3 font-bold text-base text-zinc-800 dark:text-white">
              Studio Ekstraksi & Penerjemahan AI Siap
            </h3>
            <p className="mt-1 max-w-md text-xs text-zinc-500">
              Pilih salah satu berkas PDF kakomon di atas lalu klik <strong>&quot;Jalankan Ekstraksi&quot;</strong> untuk memulai pemrosesan layout teks, diagram, dan kunci jawaban secara instan.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
