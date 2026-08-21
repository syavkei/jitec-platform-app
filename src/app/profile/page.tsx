"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserAttemptHistory } from "@/types";
import { fetchUserHistory } from "@/lib/api";
import { useAuthStore } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  User as UserIcon,
  GraduationCap,
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  Layers,
  ArrowRight,
  Sparkles,
  TrendingUp,
  LogOut,
  Globe,
} from "lucide-react";

export default function UserProfilePage() {
  const router = useRouter();
  const { user, initAuthFromStorage, logoutUser } = useAuthStore();
  const [history, setHistory] = useState<UserAttemptHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    initAuthFromStorage();
    setMounted(true);
  }, [initAuthFromStorage]);

  useEffect(() => {
    if (mounted && !user) {
      router.push("/login");
      return;
    }

    if (user?.id) {
      fetchUserHistory(user.id)
        .then((data) => {
          setHistory(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [mounted, user, router]);

  if (!mounted || !user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-xs text-zinc-400">
        Memuat profil peserta...
      </div>
    );
  }

  const totalAttempts = history.length;
  const passedCount = history.filter((h) => h.is_passed).length;
  const passRate = totalAttempts > 0 ? Math.round((passedCount / totalAttempts) * 100) : 0;
  const avgScore = totalAttempts > 0
    ? Math.round(history.reduce((acc, curr) => acc + curr.scaled_score, 0) / totalAttempts)
    : 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      {/* Profile Header Card */}
      <Card gradientAccent="indigo" className="p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-black text-2xl shadow-lg shadow-indigo-500/25">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-2xl text-zinc-900 dark:text-white">
                  {user.name}
                </h1>
                <Badge variant="level2">Target: {user.target_exam || "FE"}</Badge>
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">{user.email}</p>
              <div className="mt-2 flex items-center gap-3 text-[11px] text-zinc-400">
                <span className="flex items-center gap-1">
                  <Globe className="h-3.5 w-3.5" />
                  <span>Asal: {user.country || "Indonesia"}</span>
                </span>
                <span>•</span>
                <span>Role: Kandidat Peserta</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild variant="gradient">
              <Link href="/exams">
                <GraduationCap className="h-4 w-4" />
                <span>Mulai Simulasi Baru</span>
              </Link>
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                logoutUser();
                router.push("/login");
              }}
            >
              <LogOut className="h-3.5 w-3.5 text-rose-500" />
              <span>Keluar</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Progress & KPI Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500">Total Simulasi Diikuti</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              <Layers className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 font-extrabold text-3xl text-zinc-900 dark:text-white">
            {totalAttempts}
          </div>
          <div className="mt-1 text-[11px] text-zinc-400">Sesi ujian selesai</div>
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500">Lulus Ambang Batas (600+)</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 font-extrabold text-3xl text-emerald-600 dark:text-emerald-400">
            {passedCount} <span className="text-sm font-normal text-zinc-400">/ {totalAttempts}</span>
          </div>
          <div className="mt-1 text-[11px] text-zinc-400">Tingkat kelulusan: {passRate}%</div>
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500">Rata-rata Skor</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 font-extrabold text-3xl text-purple-600 dark:text-purple-400">
            {avgScore} <span className="text-sm font-normal text-zinc-400">/ 1000</span>
          </div>
          <div className="mt-1 text-[11px] text-zinc-400">Standar lulus: 600 poin</div>
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500">Target Ujian</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
              <Award className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 font-extrabold text-2xl text-amber-600 dark:text-amber-400">
            {user.target_exam || "FE Fundamental"}
          </div>
          <div className="mt-1 text-[11px] text-zinc-400">Sertifikasi tujuan</div>
        </div>
      </div>

      {/* Attempts History Table */}
      <div className="rounded-3xl border border-zinc-200 bg-white shadow-sm overflow-hidden dark:border-zinc-800 dark:bg-zinc-900">
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-zinc-900 dark:text-white">
              Riwayat Hasil Simulasi Ujian CBT
            </h3>
            <p className="text-xs text-zinc-500">
              Rekapitulasi lengkap skor dan status kelulusan setiap kali Anda menyelesaikan latihan.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/70 text-zinc-500 dark:border-zinc-800 dark:bg-zinc-800/40">
                <th className="py-3.5 px-4 font-semibold">JUDUL UJIAN</th>
                <th className="py-3.5 px-4 font-semibold">SKOR BERSKALA</th>
                <th className="py-3.5 px-4 font-semibold">AKURASI (%)</th>
                <th className="py-3.5 px-4 font-semibold">STATUS</th>
                <th className="py-3.5 px-4 font-semibold">WAKTU PENGERJAAN</th>
                <th className="py-3.5 px-4 font-semibold">TANGGAL SELESAI</th>
                <th className="py-3.5 px-4 font-semibold text-right">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-zinc-400">
                    Memuat riwayat simulasi...
                  </td>
                </tr>
              ) : history.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-400">
                    <GraduationCap className="mx-auto h-10 w-10 text-zinc-300 dark:text-zinc-700 mb-2" />
                    <p className="font-semibold text-zinc-600 dark:text-zinc-400">
                      Anda belum pernah menyelesaikan simulasi ujian CBT.
                    </p>
                    <Button asChild variant="gradient" size="sm" className="mt-4">
                      <Link href="/exams">Pilih Soal & Mulai Simulasi Sekarang</Link>
                    </Button>
                  </td>
                </tr>
              ) : (
                history.map((att) => {
                  const minutes = Math.floor(att.time_spent_seconds / 60);
                  const seconds = att.time_spent_seconds % 60;
                  const dateStr = new Date(att.completed_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <tr key={att.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                      <td className="py-4 px-4 font-bold text-zinc-900 dark:text-white">
                        {att.exam_title}
                        <div className="text-[10px] text-zinc-400 font-normal">{att.exam_id}</div>
                      </td>
                      <td className="py-4 px-4 font-black text-sm">
                        <span className={att.is_passed ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}>
                          {att.scaled_score}
                        </span>{" "}
                        <span className="text-[10px] text-zinc-400 font-normal">/ 1000</span>
                      </td>
                      <td className="py-4 px-4 font-semibold">
                        {att.score_percentage}% ({att.correct_count}/{att.total_questions} Benar)
                      </td>
                      <td className="py-4 px-4">
                        {att.is_passed ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>LULUS (PASS)</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-[10px] font-bold text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                            <XCircle className="h-3 w-3" />
                            <span>BELUM LULUS</span>
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-zinc-600 dark:text-zinc-400">
                        {minutes}m {seconds}s
                      </td>
                      <td className="py-4 px-4 text-zinc-500">
                        {dateStr}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Button asChild size="sm" variant="ghost">
                          <Link href={`/exams/${att.exam_id}?mode=practice`}>
                            Ulangi Soal
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
