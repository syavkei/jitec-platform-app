"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ExamMetadata, Exam } from "@/types";
import { fetchExams, createExam, updateExam, deleteExam, fetchExamById } from "@/lib/api";
import {
  GraduationCap,
  Plus,
  Edit3,
  Trash2,
  HelpCircle,
  Clock,
  Award,
  Layers,
  Search,
  ExternalLink,
  CheckCircle2,
  X,
} from "lucide-react";

export default function AdminExamsManagementPage() {
  const [exams, setExams] = useState<ExamMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExamId, setEditingExamId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Exam>>({
    id: "",
    title: "",
    level: "level2",
    level_name: "基本情報技術者試験 (FE)",
    exam_code: "FE",
    year: 2025,
    session: "r07",
    section: "kamoku_a",
    duration_minutes: 90,
    passing_score: 600,
    questions: [],
  });

  const loadExams = () => {
    setLoading(true);
    fetchExams()
      .then((data) => {
        setExams(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadExams();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingExamId(null);
    setFormData({
      id: `custom_${Date.now()}`,
      title: "",
      level: "level2",
      level_name: "基本情報技術者試験 (FE)",
      exam_code: "FE",
      year: new Date().getFullYear(),
      session: "haru",
      section: "kamoku_a",
      duration_minutes: 90,
      passing_score: 600,
      questions: [],
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = async (examMeta: ExamMetadata) => {
    setEditingExamId(examMeta.id);
    const fullExam = await fetchExamById(examMeta.id);
    if (fullExam) {
      setFormData(fullExam);
    } else {
      setFormData({ ...examMeta, questions: [] });
    }
    setIsModalOpen(true);
  };

  const handleDeleteExam = async (examId: string, title: string) => {
    if (!window.confirm(`Yakin ingin menghapus ujian "${title}"? Seluruh soal di dalamnya juga akan terhapus.`)) {
      return;
    }
    try {
      await deleteExam(examId);
      loadExams();
    } catch (err: any) {
      alert(`Gagal menghapus: ${err.message}`);
    }
  };

  const handleSaveExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.id) {
      alert("Judul dan ID ujian wajib diisi");
      return;
    }

    try {
      if (editingExamId) {
        await updateExam(editingExamId, formData as Exam);
      } else {
        await createExam(formData as Exam);
      }
      setIsModalOpen(false);
      loadExams();
    } catch (err: any) {
      alert(`Gagal menyimpan ujian: ${err.message}`);
    }
  };

  const filteredExams = exams.filter((e) =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.exam_code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 pb-6 dark:border-zinc-800">
        <div>
          <h1 className="font-extrabold text-2xl text-zinc-900 tracking-tight dark:text-white">
            Kelola Bank Lembar Ujian (Exams CRUD)
          </h1>
          <p className="mt-1 text-xs text-zinc-500">
            Daftar, buat baru, edit metadata, atau hapus lembar ujian JITEC aktif.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 font-bold text-xs text-white shadow-md hover:bg-indigo-500 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>Buat Lembar Ujian Baru</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari berdasarkan judul atau kode ujian..."
            className="w-full rounded-2xl border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-xs text-zinc-900 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
          />
        </div>
      </div>

      {/* Table of Exams */}
      <div className="rounded-3xl border border-zinc-200 bg-white shadow-sm overflow-hidden dark:border-zinc-800 dark:bg-zinc-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/70 text-zinc-500 dark:border-zinc-800 dark:bg-zinc-800/40">
                <th className="py-3.5 px-4 font-semibold">ID / KODE</th>
                <th className="py-3.5 px-4 font-semibold">JUDUL UJIAN</th>
                <th className="py-3.5 px-4 font-semibold">LEVEL</th>
                <th className="py-3.5 px-4 font-semibold">TAHUN & SESI</th>
                <th className="py-3.5 px-4 font-semibold">SOAL</th>
                <th className="py-3.5 px-4 font-semibold">DURASI</th>
                <th className="py-3.5 px-4 font-semibold">PASS SCORE</th>
                <th className="py-3.5 px-4 font-semibold text-right">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-zinc-400">
                    Memuat data ujian...
                  </td>
                </tr>
              ) : filteredExams.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-zinc-400">
                    Tidak ada ujian yang ditemukan.
                  </td>
                </tr>
              ) : (
                filteredExams.map((ex) => (
                  <tr key={ex.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                    <td className="py-4 px-4 font-mono font-bold text-indigo-600">
                      {ex.exam_code}
                      <div className="text-[10px] text-zinc-400 font-normal">{ex.id}</div>
                    </td>
                    <td className="py-4 px-4 font-bold text-zinc-900 dark:text-white">
                      {ex.title}
                      <div className="text-[11px] text-zinc-500 font-normal">{ex.level_name}</div>
                    </td>
                    <td className="py-4 px-4 capitalize">
                      <span className="rounded-lg bg-zinc-100 px-2 py-0.5 font-semibold text-[11px] text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                        {ex.level}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {ex.year} ({ex.session})
                    </td>
                    <td className="py-4 px-4 font-bold text-emerald-600">
                      {ex.total_questions} Soal
                    </td>
                    <td className="py-4 px-4">{ex.duration_minutes} Mnt</td>
                    <td className="py-4 px-4 font-semibold">{ex.passing_score} / 1000</td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/questions?examId=${ex.id}`}
                          className="rounded-lg bg-indigo-50 px-2.5 py-1.5 font-bold text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-300"
                        >
                          Kelola Soal
                        </Link>
                        <button
                          onClick={() => handleOpenEditModal(ex)}
                          className="rounded-lg border border-zinc-200 p-1.5 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                          title="Edit Metadata"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteExam(ex.id, ex.title)}
                          className="rounded-lg border border-red-200 p-1.5 text-red-600 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950"
                          title="Hapus Ujian"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Exam Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4 dark:border-zinc-800">
              <h3 className="font-extrabold text-lg text-zinc-900 dark:text-white">
                {editingExamId ? "Edit Metadata Ujian" : "Buat Lembar Ujian Baru"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveExam} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300">
                  ID Ujian (Unique Identifier):
                </label>
                <input
                  type="text"
                  disabled={!!editingExamId}
                  value={formData.id || ""}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  placeholder="e.g. 2025r07_fe_kamoku_a"
                  className="mt-1 w-full rounded-xl border border-zinc-300 bg-zinc-50 p-2.5 font-mono text-zinc-900 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300">
                  Judul Ujian:
                </label>
                <input
                  type="text"
                  value={formData.title || ""}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. 令和7年度 基本情報技術者試験 科目A"
                  className="mt-1 w-full rounded-xl border border-zinc-300 bg-zinc-50 p-2.5 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300">
                    Level Sertifikasi:
                  </label>
                  <select
                    value={formData.level || "level2"}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value as any })}
                    className="mt-1 w-full rounded-xl border border-zinc-300 bg-zinc-50 p-2.5 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                  >
                    <option value="level1">Level 1 (IT Passport)</option>
                    <option value="level2">Level 2 (FE / SG)</option>
                    <option value="level3">Level 3 (Applied IT)</option>
                    <option value="level4">Level 4 (Database Specialist)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300">
                    Kode Ujian:
                  </label>
                  <input
                    type="text"
                    value={formData.exam_code || "FE"}
                    onChange={(e) => setFormData({ ...formData, exam_code: e.target.value as any })}
                    placeholder="FE, IP, AP, DB"
                    className="mt-1 w-full rounded-xl border border-zinc-300 bg-zinc-50 p-2.5 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300">
                    Tahun:
                  </label>
                  <input
                    type="number"
                    value={formData.year || 2025}
                    onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                    className="mt-1 w-full rounded-xl border border-zinc-300 bg-zinc-50 p-2.5 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300">
                    Durasi (Menit):
                  </label>
                  <input
                    type="number"
                    value={formData.duration_minutes || 90}
                    onChange={(e) => setFormData({ ...formData, duration_minutes: Number(e.target.value) })}
                    className="mt-1 w-full rounded-xl border border-zinc-300 bg-zinc-50 p-2.5 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300">
                    Passing Score:
                  </label>
                  <input
                    type="number"
                    value={formData.passing_score || 600}
                    onChange={(e) => setFormData({ ...formData, passing_score: Number(e.target.value) })}
                    className="mt-1 w-full rounded-xl border border-zinc-300 bg-zinc-50 p-2.5 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-2 border-t border-zinc-100 pt-4 dark:border-zinc-800">
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
                  Simpan Ujian
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
