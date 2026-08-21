"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { AvailableFile, Exam, Question } from "@/types";
import {
  fetchAvailableFiles,
  parsePdf,
  uploadAndParsePdf,
  publishExam,
  batchAiTranslateExam,
} from "@/lib/api";
import { PdfViewer } from "@/components/admin/PdfViewer";
import { QuestionEditor } from "@/components/admin/QuestionEditor";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  Upload,
  FolderOpen,
  CloudUpload,
  Layers,
  Clock,
  ShieldCheck,
  Loader2,
  Check,
  Wand2,
} from "lucide-react";

/**
 * Intelligent helper to extract exam metadata from official JITEC / IPA PDF filenames.
 * Supports patterns like:
 * - 2025r07_fe_kamoku_a_qs.pdf
 * - 2024r06_ap_am_qs.pdf
 * - 2023r05_ip_qs.pdf
 * - 2021_ip_qs.pdf
 * - 2024_db_am2_qs.pdf
 * - 2022_haru_fe_am_qs.pdf
 */
function autofillExamMetadataFromFilename(filename: string) {
  const clean = filename.toLowerCase().replace(".pdf", "");

  // 1. Year Extraction
  let year = 2025;
  const yearMatch = clean.match(/(20\d\d)/);
  if (yearMatch) {
    year = parseInt(yearMatch[1], 10);
  }

  // 2. Session Extraction (e.g. r07, r06, r05, haru, aki)
  let session = "r07";
  const sessionMatch = clean.match(/(r0\d|r\d\d|haru|aki|h\d\d)/i);
  if (sessionMatch) {
    session = sessionMatch[1].toLowerCase();
  } else if (year >= 2019) {
    const reiwaYear = year - 2018;
    session = `r0${reiwaYear}`;
  }

  // 3. Exam Code & Level Extraction
  let examCode = "FE";
  let level = "level2";
  let levelName = "基本情報技術者試験";

  if (clean.includes("ip") || clean.includes("passport") || clean.includes("it_passport") || clean.includes("level1")) {
    examCode = "IP";
    level = "level1";
    levelName = "ITパスポート試験";
  } else if (clean.includes("ap") || clean.includes("applied") || clean.includes("level3")) {
    examCode = "AP";
    level = "level3";
    levelName = "応用情報技術者試験";
  } else if (clean.includes("db") || clean.includes("database")) {
    examCode = "DB";
    level = "level4";
    levelName = "データベーススペシャリスト試験";
  } else if (clean.includes("sc") || clean.includes("security_specialist") || clean.includes("riss")) {
    examCode = "SC";
    level = "level4";
    levelName = "情報処理安全確保支援士 (登録セキスぺ)";
  } else if (clean.includes("sg")) {
    examCode = "SG";
    level = "level2";
    levelName = "情報セキュリティマネジメント試験";
  } else if (clean.includes("fe") || clean.includes("fundamental") || clean.includes("level2")) {
    examCode = "FE";
    level = "level2";
    levelName = "基本情報技術者試験";
  }

  // 4. Section & Duration Extraction
  let section = "kamoku_a";
  let sectionTitle = "科目A";
  let duration = 90;

  if (clean.includes("kamoku_b") || clean.includes("kamokub") || clean.includes("pm") || clean.includes("pm1")) {
    if (examCode === "FE") {
      section = "kamoku_b";
      sectionTitle = "科目B";
      duration = 100;
    } else {
      section = "pm";
      sectionTitle = "午後";
      duration = 150;
    }
  } else if (clean.includes("kamoku_a") || clean.includes("kamokua") || clean.includes("am") || clean.includes("am1") || clean.includes("am2")) {
    if (clean.includes("am2")) {
      section = "am2";
      sectionTitle = "午前II";
      duration = 40;
    } else if (clean.includes("am1")) {
      section = "am1";
      sectionTitle = "午前I";
      duration = 50;
    } else if (examCode === "FE") {
      section = "kamoku_a";
      sectionTitle = "科目A";
      duration = 90;
    } else if (examCode === "IP") {
      section = "kamoku_a";
      sectionTitle = "CBT総合";
      duration = 120;
    } else {
      section = "am";
      sectionTitle = "午前";
      duration = 150;
    }
  } else {
    if (examCode === "IP") {
      section = "kamoku_a";
      sectionTitle = "CBT総合";
      duration = 120;
    }
  }

  // 5. Japanese Reiwa Year Name
  const reiwaYear = year - 2018;
  const sessionKanji = session === "haru" ? "春期" : session === "aki" ? "秋期" : `令和${reiwaYear}年度`;
  const title = `${sessionKanji} ${levelName} (${sectionTitle})`;

  return {
    year,
    session,
    examCode,
    level,
    section,
    duration,
    passingScore: 600,
    title,
  };
}

export default function AdminExtractorPage() {
  const [ingestMode, setIngestMode] = useState<"upload" | "server">("upload");

  // Server file selection state
  const [files, setFiles] = useState<AvailableFile[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [selectedFile, setSelectedFile] = useState<AvailableFile | null>(null);

  // Upload file state
  const [qsFile, setQsFile] = useState<File | null>(null);
  const [ansFile, setAnsFile] = useState<File | null>(null);
  const [cmntFile, setCmntFile] = useState<File | null>(null);

  // Upload metadata form state
  const [formTitle, setFormTitle] = useState("");
  const [formLevel, setFormLevel] = useState<string>("level2");
  const [formExamCode, setFormExamCode] = useState<string>("FE");
  const [formYear, setFormYear] = useState<number>(2025);
  const [formSession, setFormSession] = useState<string>("r07");
  const [formSection, setFormSection] = useState<string>("kamoku_a");
  const [formDuration, setFormDuration] = useState<number>(90);
  const [formPassingScore, setFormPassingScore] = useState<number>(600);
  const [formAutoTranslate, setFormAutoTranslate] = useState<boolean>(true);
  const [autofillSuccessToast, setAutofillSuccessToast] = useState(false);

  // Parsing, Progress & Processing state
  const [isParsing, setIsParsing] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [progressStage, setProgressStage] = useState("Menyiapkan berkas...");
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [isBatchTranslating, setIsBatchTranslating] = useState(false);
  const [parsedExam, setParsedExam] = useState<Exam | null>(null);
  const [selectedQIndex, setSelectedQIndex] = useState(0);
  const [currentPdfPage, setCurrentPdfPage] = useState(1);
  const [pdfRelativeUrl, setPdfRelativeUrl] = useState<string | null>(null);

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

  // Autofill metadata based on filename
  const applyAutofill = (filename: string) => {
    const meta = autofillExamMetadataFromFilename(filename);
    setFormTitle(meta.title);
    setFormLevel(meta.level);
    setFormExamCode(meta.examCode);
    setFormYear(meta.year);
    setFormSession(meta.session);
    setFormSection(meta.section);
    setFormDuration(meta.duration);
    setFormPassingScore(meta.passingScore);

    setAutofillSuccessToast(true);
    setTimeout(() => setAutofillSuccessToast(false), 3500);
  };

  // Simulated progress timer for smooth visual feedback
  const startProgressSimulation = (hasAutoTranslate: boolean) => {
    setProgressPercent(10);
    setProgressStage("Mengunggah berkas PDF ke server...");

    let current = 10;
    progressIntervalRef.current = setInterval(() => {
      current += Math.floor(Math.random() * 8) + 3;

      if (current >= 95) {
        current = 95;
        setProgressStage("Menyelesaikan formatting & studio editor...");
      } else if (current >= 65 && hasAutoTranslate) {
        setProgressStage("AI Assistant menerjemahkan soal ke EN, ID, VI...");
      } else if (current >= 35) {
        setProgressStage("Mem-parsing teks soal & mengekstrak diagram...");
      }

      setProgressPercent(current);
    }, 600);
  };

  const stopProgressSimulation = (success: boolean) => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    if (success) {
      setProgressPercent(100);
      setProgressStage("Ekstraksi selesai 100%!");
      setTimeout(() => {
        setIsParsing(false);
      }, 500);
    } else {
      setIsParsing(false);
    }
  };

  // Handle upload and parse
  const handleUploadAndParse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qsFile) {
      alert("Silakan pilih berkas PDF Soal (*_qs.pdf) terlebih dahulu.");
      return;
    }

    setIsParsing(true);
    setPublishStatus(null);
    startProgressSimulation(formAutoTranslate);

    const formData = new FormData();
    formData.append("qs_file", qsFile);
    if (ansFile) formData.append("ans_file", ansFile);
    if (cmntFile) formData.append("cmnt_file", cmntFile);

    formData.append("title", formTitle || `${formYear}年度 ${formExamCode} 試験 (${formSection})`);
    formData.append("level", formLevel);
    formData.append("exam_code", formExamCode);
    formData.append("year", String(formYear));
    formData.append("session", formSession);
    formData.append("section", formSection);
    formData.append("duration_minutes", String(formDuration));
    formData.append("passing_score", String(formPassingScore));
    formData.append("auto_translate", formAutoTranslate ? "true" : "false");

    try {
      const res = await uploadAndParsePdf(formData);
      if (res.success) {
        setParsedExam(res.exam);
        setSelectedQIndex(0);
        setPdfRelativeUrl(null); // Direct preview
        if (res.exam.questions.length > 0 && res.exam.questions[0].source_page) {
          setCurrentPdfPage(res.exam.questions[0].source_page);
        }
        stopProgressSimulation(true);
      } else {
        stopProgressSimulation(false);
      }
    } catch (err: any) {
      stopProgressSimulation(false);
      alert(`Gagal mengunggah dan memproses PDF: ${err.message}`);
    }
  };

  // Handle server file parse
  const handleServerParse = async () => {
    if (!selectedFile) return;
    setIsParsing(true);
    setPublishStatus(null);
    startProgressSimulation(true);

    try {
      const res = await parsePdf(
        selectedFile.relative_path,
        selectedFile.matched_ans_file || undefined,
        selectedFile.matched_cmnt_file || undefined
      );

      if (res.success) {
        setParsedExam(res.exam);
        setSelectedQIndex(0);
        setPdfRelativeUrl(selectedFile.relative_path);
        if (res.exam.questions.length > 0 && res.exam.questions[0].source_page) {
          setCurrentPdfPage(res.exam.questions[0].source_page);
        }
        stopProgressSimulation(true);
      } else {
        stopProgressSimulation(false);
      }
    } catch (err: any) {
      stopProgressSimulation(false);
      alert(`Gagal mem-parsing PDF server: ${err.message}`);
    }
  };

  const handleBatchAITranslate = async () => {
    if (!parsedExam) return;
    setIsBatchTranslating(true);
    try {
      const translatedExam = await batchAiTranslateExam(parsedExam, ["en", "id", "vi"]);
      setParsedExam({ ...translatedExam });
      alert("Seluruh soal berhasil diterjemahkan ke EN, ID, dan VI oleh AI!");
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
    <div className="space-y-6 max-w-7xl mx-auto pb-20 relative">
      {/* SaaS Progress Overlay Modal during PDF Extraction */}
      {isParsing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 space-y-6 text-center">
            {/* Top Pulsing Icon */}
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 shadow-lg shadow-rose-500/20">
              <Sparkles className="h-8 w-8 animate-spin" />
            </div>

            <div className="space-y-2">
              <h3 className="font-extrabold text-lg sm:text-xl text-zinc-900 dark:text-white">
                Mengekstrak Soal Ujian JITEC
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 min-h-[20px] font-medium">
                {progressStage}
              </p>
            </div>

            {/* Visual Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-zinc-500">Progres Ekstraksi</span>
                <span className="text-rose-600 dark:text-rose-400">{progressPercent}%</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800 p-0.5 border border-zinc-200 dark:border-zinc-700">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-600 transition-all duration-500 shadow-md"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Checklist Steps */}
            <div className="space-y-2 text-left text-xs bg-zinc-50 dark:bg-zinc-800/40 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800">
              <div className={`flex items-center gap-2 font-medium ${progressPercent >= 25 ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-zinc-400"}`}>
                {progressPercent >= 25 ? <Check className="h-4 w-4 shrink-0" /> : <Loader2 className="h-4 w-4 shrink-0 animate-spin" />}
                <span>Unggah & Dekode Berkas PDF</span>
              </div>
              <div className={`flex items-center gap-2 font-medium ${progressPercent >= 55 ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-zinc-400"}`}>
                {progressPercent >= 55 ? <Check className="h-4 w-4 shrink-0" /> : <div className="h-4 w-4 rounded-full border border-zinc-300 dark:border-zinc-600 shrink-0" />}
                <span>Parsing Butir Soal, Opsi & Diagram</span>
              </div>
              <div className={`flex items-center gap-2 font-medium ${progressPercent >= 85 ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-zinc-400"}`}>
                {progressPercent >= 85 ? <Check className="h-4 w-4 shrink-0" /> : <div className="h-4 w-4 rounded-full border border-zinc-300 dark:border-zinc-600 shrink-0" />}
                <span>AI Auto-Translate (EN, ID, VI)</span>
              </div>
            </div>

            <div className="text-[11px] text-zinc-400 italic">
              Mohon tunggu sejenak. Jangan menutup atau merefresh halaman ini.
            </div>
          </div>
        </div>
      )}

      {/* Studio Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 pb-6 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-600 font-bold text-white shadow-md shadow-rose-500/20">
            <CloudUpload className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-2xl text-zinc-900 dark:text-white tracking-tight">
                PDF Ingestion & AI Extractor Studio
              </h1>
              <Badge variant="destructive">ONLINE READY</Badge>
            </div>
            <p className="text-xs text-zinc-500">
              Unggah berkas PDF soal kakomon resmi, kunci jawaban, ekstrak diagram, dan terjemahkan otomatis menggunakan AI.
            </p>
          </div>
        </div>

        {parsedExam && (
          <div className="flex items-center gap-2.5">
            <Button
              onClick={handleBatchAITranslate}
              disabled={isBatchTranslating}
              variant="gradient"
              size="sm"
            >
              <Sparkles className="h-4 w-4" />
              <span>{isBatchTranslating ? "Menerjemahkan Semua..." : "AI Translate All (EN/ID/VI)"}</span>
            </Button>

            <Button
              onClick={handlePublish}
              disabled={isPublishing}
              variant="success"
              size="sm"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>{isPublishing ? "Menyimpan..." : "Publikasikan ke Bank Soal"}</span>
            </Button>
          </div>
        )}
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-200 pb-3 dark:border-zinc-800">
        <button
          onClick={() => setIngestMode("upload")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
            ingestMode === "upload"
              ? "bg-rose-600 text-white shadow-sm"
              : "bg-white text-zinc-600 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          }`}
        >
          <CloudUpload className="h-4 w-4" />
          <span>Unggah Berkas PDF (Online / Upload Langsung)</span>
        </button>

        <button
          onClick={() => setIngestMode("server")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
            ingestMode === "server"
              ? "bg-rose-600 text-white shadow-sm"
              : "bg-white text-zinc-600 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          }`}
        >
          <FolderOpen className="h-4 w-4" />
          <span>Pilih Berkas Repositori Server</span>
        </button>
      </div>

      {/* Step 1: Upload Form or Server File Picker */}
      {ingestMode === "upload" ? (
        <Card gradientAccent="rose" className="p-6">
          <form onSubmit={handleUploadAndParse} className="space-y-6">
            <div>
              <h3 className="font-bold text-sm text-zinc-900 dark:text-white">
                Unggah Berkas Ujian Kakomon & Kunci Jawaban
              </h3>
              <p className="text-xs text-zinc-500">
                Pilih berkas PDF dari komputer Anda untuk diproses ke dalam platform.
              </p>
            </div>

            {/* File Upload Dropzones */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* Question PDF */}
              <div className="rounded-2xl border-2 border-dashed border-rose-300 bg-rose-50/40 p-4 text-center dark:border-rose-900/50 dark:bg-rose-950/20 space-y-2">
                <FileText className="mx-auto h-8 w-8 text-rose-600 dark:text-rose-400" />
                <div className="font-bold text-xs text-zinc-900 dark:text-white">
                  1. Berkas Soal (*_qs.pdf) <span className="text-rose-600">*</span>
                </div>
                <input
                  type="file"
                  accept=".pdf"
                  required
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      setQsFile(f);
                      applyAutofill(f.name);
                    }
                  }}
                  className="w-full text-xs text-zinc-600 file:mr-2 file:rounded-xl file:border-0 file:bg-rose-600 file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-white hover:file:bg-rose-500 cursor-pointer"
                />
                {qsFile && (
                  <div className="text-[11px] font-semibold text-emerald-600 truncate flex items-center justify-center gap-1">
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span>{qsFile.name} ({(qsFile.size / 1024).toFixed(1)} KB)</span>
                  </div>
                )}
              </div>

              {/* Answer Key PDF */}
              <div className="rounded-2xl border-2 border-dashed border-zinc-300 bg-zinc-50/70 p-4 text-center dark:border-zinc-700 dark:bg-zinc-800/40 space-y-2">
                <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                <div className="font-bold text-xs text-zinc-900 dark:text-white">
                  2. Kunci Jawaban (*_ans.pdf)
                </div>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setAnsFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-zinc-600 file:mr-2 file:rounded-xl file:border-0 file:bg-zinc-800 file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-white hover:file:bg-zinc-700 cursor-pointer dark:file:bg-zinc-700"
                />
                {ansFile && (
                  <div className="text-[11px] font-semibold text-emerald-600 truncate flex items-center justify-center gap-1">
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span>{ansFile.name} ({(ansFile.size / 1024).toFixed(1)} KB)</span>
                  </div>
                )}
              </div>

              {/* Commentary PDF */}
              <div className="rounded-2xl border-2 border-dashed border-zinc-300 bg-zinc-50/70 p-4 text-center dark:border-zinc-700 dark:bg-zinc-800/40 space-y-2">
                <ShieldCheck className="mx-auto h-8 w-8 text-purple-600 dark:text-purple-400" />
                <div className="font-bold text-xs text-zinc-900 dark:text-white">
                  3. Pembahasan IPA (*_cmnt.pdf)
                </div>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setCmntFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-zinc-600 file:mr-2 file:rounded-xl file:border-0 file:bg-zinc-800 file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-white hover:file:bg-zinc-700 cursor-pointer dark:file:bg-zinc-700"
                />
                {cmntFile && (
                  <div className="text-[11px] font-semibold text-emerald-600 truncate flex items-center justify-center gap-1">
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span>{cmntFile.name} ({(cmntFile.size / 1024).toFixed(1)} KB)</span>
                  </div>
                )}
              </div>
            </div>

            {/* Metadata Fields Grid with Autofill Trigger */}
            <div className="space-y-4 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-bold text-xs text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                  <span>Informasi & Metadata Lembar Ujian:</span>
                  {autofillSuccessToast && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 animate-in fade-in">
                      <Check className="h-3 w-3" />
                      <span>Field terisi otomatis dari nama berkas!</span>
                    </span>
                  )}
                </div>

                {qsFile && (
                  <button
                    type="button"
                    onClick={() => applyAutofill(qsFile.name)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-1 text-[11px] font-bold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-900/60 dark:bg-indigo-950/50 dark:text-indigo-300 cursor-pointer"
                  >
                    <Wand2 className="h-3.5 w-3.5" />
                    <span>Isi Ulang Otomatis dari Nama File</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Judul Ujian:
                  </label>
                  <Input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. 令和7年度 基本情報技術者試験 (科目A)"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Level Sertifikasi:
                  </label>
                  <select
                    value={formLevel}
                    onChange={(e) => setFormLevel(e.target.value)}
                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 p-2.5 text-xs text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white font-medium"
                  >
                    <option value="level1">Level 1: IT Passport (IP)</option>
                    <option value="level2">Level 2: FE / SG</option>
                    <option value="level3">Level 3: Applied IT (AP)</option>
                    <option value="level4">Level 4: Database Spec (DB)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Kode Ujian:
                  </label>
                  <Input
                    type="text"
                    value={formExamCode}
                    onChange={(e) => setFormExamCode(e.target.value)}
                    placeholder="FE, IP, AP, DB"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Tahun Ujian:
                  </label>
                  <Input
                    type="number"
                    value={formYear}
                    onChange={(e) => setFormYear(Number(e.target.value))}
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Sesi Ujian:
                  </label>
                  <Input
                    type="text"
                    value={formSession}
                    onChange={(e) => setFormSession(e.target.value)}
                    placeholder="r07, haru, aki"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Bagian / Sesi Ujian:
                  </label>
                  <Input
                    type="text"
                    value={formSection}
                    onChange={(e) => setFormSection(e.target.value)}
                    placeholder="kamoku_a, kamoku_b, am, pm"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Durasi (Menit):
                  </label>
                  <Input
                    type="number"
                    value={formDuration}
                    onChange={(e) => setFormDuration(Number(e.target.value))}
                    required
                  />
                </div>
              </div>

              {/* Auto AI Translate Toggle */}
              <div className="flex items-center gap-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-indigo-900 dark:text-indigo-300 bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 px-4 py-2.5 rounded-2xl">
                  <input
                    type="checkbox"
                    checked={formAutoTranslate}
                    onChange={(e) => setFormAutoTranslate(e.target.checked)}
                    className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <Sparkles className="h-4 w-4 text-purple-600" />
                  <span>Otomatis Terjemahkan ke EN, ID, dan VI Menggunakan AI saat ekstraksi</span>
                </label>
              </div>
            </div>

            {/* Submit Action */}
            <div className="flex items-center justify-end pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <Button
                type="submit"
                disabled={isParsing || !qsFile}
                variant="destructive"
                className="h-11 px-6 font-bold"
              >
                <CloudUpload className="h-4 w-4" />
                <span>{isParsing ? "Sedang Mengekstrak Soal..." : "Unggah & Mulai Ekstraksi Soal"}</span>
              </Button>
            </div>
          </form>
        </Card>
      ) : (
        /* Server File Mode */
        <Card className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex-1 min-w-[280px]">
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Pilih Berkas Kakomon dari Server:
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
                      [{f.code}] {f.filename} {f.matched_ans_file ? "(+Kunci Jawaban)" : ""}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <Button
              onClick={handleServerParse}
              disabled={isParsing || !selectedFile}
              variant="default"
              className="self-end h-10 px-5"
            >
              <Play className="h-4 w-4" />
              <span>{isParsing ? "Memproses PDF..." : "Jalankan Ekstraksi Server"}</span>
            </Button>
          </div>
        </Card>
      )}

      {publishStatus && (
        <div className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300 shadow-sm">
          <div className="flex items-center gap-2 font-bold">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <span>{publishStatus}</span>
          </div>
          <Link
            href="/exams"
            className="flex items-center gap-1 font-bold text-emerald-700 underline hover:text-emerald-800 dark:text-emerald-300"
          >
            <span>Lihat di Katalog Ujian</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

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
                className="rounded-lg border border-zinc-200 p-1.5 hover:bg-zinc-100 disabled:opacity-30 dark:border-zinc-700 dark:hover:bg-zinc-800 cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-1.5 overflow-x-auto max-w-md py-1">
                {parsedExam.questions.map((q, idx) => (
                  <button
                    key={`q-${q.id || 'idx'}-${idx}`}
                    onClick={() => {
                      setSelectedQIndex(idx);
                      if (q.source_page) setCurrentPdfPage(q.source_page);
                    }}
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md font-bold text-xs transition-all cursor-pointer ${
                      idx === selectedQIndex
                        ? "bg-indigo-600 text-white shadow-sm"
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
                className="rounded-lg border border-zinc-200 p-1.5 hover:bg-zinc-100 disabled:opacity-30 dark:border-zinc-700 dark:hover:bg-zinc-800 cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="text-xs font-semibold text-zinc-500">
              Total <strong className="text-zinc-900 dark:text-white">{parsedExam.questions.length}</strong> Butir Soal Terekstraksi
            </div>
          </div>

          {/* Split Screen 2 Columns */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 min-h-[650px]">
            {/* Left Pane: PDF Viewer */}
            <div className="h-[650px]">
              <PdfViewer
                pdfRelativePath={pdfRelativeUrl || (selectedFile?.relative_path ?? null)}
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
        <div className="flex min-h-[350px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
            <CloudUpload className="h-6 w-6" />
          </div>
          <h3 className="mt-4 font-bold text-base text-zinc-800 dark:text-white">
            Studio Siap Mengekstrak Berkas PDF
          </h3>
          <p className="mt-1 max-w-md text-xs text-zinc-500">
            Unggah berkas PDF soal kakomon di atas lalu klik <strong>&quot;Unggah & Mulai Ekstraksi Soal&quot;</strong> untuk mengekstrak layout pertanyaan, gambar diagram, kunci jawaban, dan terjemahan otomatis.
          </p>
        </div>
      )}
    </div>
  );
}
