"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SystemStats, ExamMetadata } from "@/types";
import { fetchSystemStats, fetchExams } from "@/lib/api";
import {
  GraduationCap,
  HelpCircle,
  BookOpen,
  Image as ImageIcon,
  HardDrive,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Plus,
  FileText,
  Sliders,
  Sparkles,
} from "lucide-react";

export default function AdminDashboardOverview() {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [exams, setExams] = useState<ExamMetadata[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchSystemStats(), fetchExams()])
      .then(([statsData, examsData]) => {
        setStats(statsData);
        setExams(examsData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 pb-6 dark:border-zinc-800">
        <div>
          <h1 className="font-extrabold text-2xl sm:text-3xl text-zinc-900 tracking-tight dark:text-white">
            Admin Overview & App Management
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-zinc-500">
            Pusat kendali bank soal JITEC, manajemen konten multibahasa, ekstraksi PDF, dan status sistem.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/extractor"
            className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2.5 font-bold text-xs text-white shadow-md shadow-rose-500/20 hover:bg-rose-500 active:scale-95"
          >
            <Sparkles className="h-4 w-4" />
            <span>PDF AI Extractor Studio</span>
          </Link>
          <Link
            href="/admin/exams"
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 font-bold text-xs text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-500 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Ujian Baru</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500">Total Lembar Ujian</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              <GraduationCap className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 font-extrabold text-3xl text-zinc-900 dark:text-white">
            {loading ? "..." : stats?.total_exams || 0}
          </div>
          <div className="mt-1 text-[11px] text-zinc-400">Tersedia di katalog</div>
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500">Total Soal Aktif</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <HelpCircle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 font-extrabold text-3xl text-emerald-600 dark:text-emerald-400">
            {loading ? "..." : stats?.total_questions || 0}
          </div>
          <div className="mt-1 text-[11px] text-zinc-400">Di bank soal</div>
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500">Kosakata Kanji IT</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
              <BookOpen className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 font-extrabold text-3xl text-purple-600 dark:text-purple-400">
            {loading ? "..." : stats?.total_glossary_terms || 0}
          </div>
          <div className="mt-1 text-[11px] text-zinc-400">Kamus Furigana & Terjemahan</div>
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500">OCR Tesseract Engine</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
              <HardDrive className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="font-bold text-lg text-zinc-900 dark:text-white">
              {stats?.tesseract_ocr_available ? "Aktif (Ready)" : "Tidak Aktif"}
            </span>
          </div>
          <div className="mt-1 text-[11px] text-zinc-400">
            Langs: {stats?.tesseract_languages.slice(0, 3).join(", ") || "jpn, eng"}
          </div>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link
          href="/admin/extractor"
          className="group rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:border-rose-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
            <FileText className="h-5 w-5" />
          </div>
          <h3 className="mt-4 font-bold text-base text-zinc-900 group-hover:text-rose-600 dark:text-white dark:group-hover:text-rose-400">
            PDF & AI Ingestion Studio
          </h3>
          <p className="mt-1.5 text-xs text-zinc-500 leading-relaxed">
            Ekstrak soal dari berkas kakomon PDF resmi dengan split-screen editor & auto-translation AI.
          </p>
          <div className="mt-4 flex items-center gap-1 font-semibold text-xs text-rose-600">
            <span>Buka Studio</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </Link>

        <Link
          href="/admin/questions"
          className="group rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:border-indigo-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
            <HelpCircle className="h-5 w-5" />
          </div>
          <h3 className="mt-4 font-bold text-base text-zinc-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
            Kelola Bank Soal (CRUD)
          </h3>
          <p className="mt-1.5 text-xs text-zinc-500 leading-relaxed">
            Tambah, edit teks, perbarui opsi jawaban, diagram gambar, dan kunci jawaban per nomor soal.
          </p>
          <div className="mt-4 flex items-center gap-1 font-semibold text-xs text-indigo-600">
            <span>Kelola Soal</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </Link>

        <Link
          href="/admin/settings"
          className="group rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:border-purple-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
            <Sliders className="h-5 w-5" />
          </div>
          <h3 className="mt-4 font-bold text-base text-zinc-900 group-hover:text-purple-600 dark:text-white dark:group-hover:text-purple-400">
            Pengaturan & API Keys
          </h3>
          <p className="mt-1.5 text-xs text-zinc-500 leading-relaxed">
            Konfigurasi Gemini API Key untuk AI translation, default passing score, dan aturan CBT.
          </p>
          <div className="mt-4 flex items-center gap-1 font-semibold text-xs text-purple-600">
            <span>Konfigurasi</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </Link>
      </div>

      {/* Recent Published Exams Table */}
      <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4 dark:border-zinc-800">
          <div>
            <h3 className="font-bold text-base text-zinc-900 dark:text-white">
              Daftar Ujian Terpublikasi
            </h3>
            <p className="text-xs text-zinc-500">Lembar ujian aktif yang dapat diakses peserta.</p>
          </div>
          <Link
            href="/admin/exams"
            className="text-xs font-semibold text-indigo-600 hover:underline"
          >
            Lihat Semua ({exams.length})
          </Link>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-100 text-zinc-400 dark:border-zinc-800">
                <th className="py-3 px-2 font-semibold">KODE</th>
                <th className="py-3 px-2 font-semibold">JUDUL UJIAN</th>
                <th className="py-3 px-2 font-semibold">LEVEL</th>
                <th className="py-3 px-2 font-semibold">TAHUN</th>
                <th className="py-3 px-2 font-semibold">SOAL</th>
                <th className="py-3 px-2 font-semibold">DURASI</th>
                <th className="py-3 px-2 font-semibold text-right">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {exams.map((ex) => (
                <tr key={ex.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                  <td className="py-3.5 px-2 font-bold text-indigo-600">{ex.exam_code}</td>
                  <td className="py-3.5 px-2 font-semibold text-zinc-900 dark:text-white">
                    {ex.title}
                  </td>
                  <td className="py-3.5 px-2 capitalize">{ex.level}</td>
                  <td className="py-3.5 px-2">{ex.year}</td>
                  <td className="py-3.5 px-2 font-bold text-emerald-600">{ex.total_questions} Q</td>
                  <td className="py-3.5 px-2">{ex.duration_minutes} Menit</td>
                  <td className="py-3.5 px-2 text-right">
                    <Link
                      href={`/admin/questions?examId=${ex.id}`}
                      className="rounded-lg bg-indigo-50 px-2.5 py-1 font-semibold text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-300"
                    >
                      Kelola Soal
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
