"use client";

import { useEffect, useState } from "react";
import { AppSettings, SystemStats } from "@/types";
import { fetchAppSettings, updateAppSettings, fetchSystemStats } from "@/lib/api";
import {
  Sliders,
  Sparkles,
  Key,
  HardDrive,
  CheckCircle2,
  Save,
  ShieldCheck,
  Cpu,
  Clock,
  Eye,
  EyeOff,
} from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [showOpenAIKey, setShowOpenAIKey] = useState(false);

  useEffect(() => {
    Promise.all([fetchAppSettings(), fetchSystemStats()])
      .then(([settingsData, statsData]) => {
        setSettings(settingsData);
        setStats(statsData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const updated = await updateAppSettings(settings);
      setSettings(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      alert(`Gagal menyimpan pengaturan: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="p-8 text-center text-xs text-zinc-400">
        Memuat konfigurasi sistem...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 pb-6 dark:border-zinc-800">
        <div>
          <h1 className="font-extrabold text-2xl text-zinc-900 tracking-tight dark:text-white">
            Pengaturan Aplikasi & Diagnostik Sistem
          </h1>
          <p className="mt-1 text-xs text-zinc-500">
            Kelola konfigurasi API penerjemahan AI, standar penilaian kelulusan CBT, dan status storage.
          </p>
        </div>

        {saveSuccess && (
          <div className="flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            <CheckCircle2 className="h-4 w-4" />
            <span>Pengaturan berhasil disimpan!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: AI Translation Configuration */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-2.5 border-b border-zinc-100 pb-4 dark:border-zinc-800">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-zinc-900 dark:text-white">
                Konfigurasi AI Translation Engine
              </h3>
              <p className="text-[11px] text-zinc-500">
                Penyedia AI untuk auto-translation soal PDF ke English, Indonesia, dan Vietnam.
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300">
                Gemini API Key (Google AI):
              </label>
              <div className="relative mt-1">
                <input
                  type={showGeminiKey ? "text" : "password"}
                  value={settings.gemini_api_key || ""}
                  onChange={(e) => setSettings({ ...settings, gemini_api_key: e.target.value })}
                  placeholder="AIzaSy..."
                  className="w-full rounded-xl border border-zinc-300 bg-zinc-50 p-2.5 pr-10 font-mono text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowGeminiKey(!showGeminiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                >
                  {showGeminiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="mt-1 text-[11px] text-zinc-400">
                Jika diisi, penerjemahan akan menggunakan model Gemini 1.5 Flash untuk akurasi terminologi teknis maksimal.
              </p>
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300">
                OpenAI API Key (Opsional):
              </label>
              <div className="relative mt-1">
                <input
                  type={showOpenAIKey ? "text" : "password"}
                  value={settings.openai_api_key || ""}
                  onChange={(e) => setSettings({ ...settings, openai_api_key: e.target.value })}
                  placeholder="sk-..."
                  className="w-full rounded-xl border border-zinc-300 bg-zinc-50 p-2.5 pr-10 font-mono text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowOpenAIKey(!showOpenAIKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                >
                  {showOpenAIKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300">
                Mode Provider Penerjemahan:
              </label>
              <select
                value={settings.ai_translation_provider}
                onChange={(e) => setSettings({ ...settings, ai_translation_provider: e.target.value })}
                className="mt-1 w-full rounded-xl border border-zinc-300 bg-zinc-50 p-2.5 font-medium text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              >
                <option value="auto">Auto (Gunakan Gemini/OpenAI jika ada key, fallback ke Heuristic)</option>
                <option value="gemini">Gemini API Only</option>
                <option value="heuristic">Heuristic Domain Engine (Offline)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: CBT Exam Defaults */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-2.5 border-b border-zinc-100 pb-4 dark:border-zinc-800">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-zinc-900 dark:text-white">
                Standar Penilaian & Aturan CBT
              </h3>
              <p className="text-[11px] text-zinc-500">
                Nilai ambang batas kelulusan resmi JITEC dan alokasi waktu default.
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3 text-xs">
            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300">
                Default Passing Score (Skala 1000):
              </label>
              <input
                type="number"
                value={settings.default_passing_score}
                onChange={(e) => setSettings({ ...settings, default_passing_score: Number(e.target.value) })}
                className="mt-1 w-full rounded-xl border border-zinc-300 bg-zinc-50 p-2.5 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
              <span className="text-[10px] text-zinc-400">Standar resmi IPA: 600 Poin (60%)</span>
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300">
                Durasi Level 2 FE (Menit):
              </label>
              <input
                type="number"
                value={settings.default_fe_duration_minutes}
                onChange={(e) => setSettings({ ...settings, default_fe_duration_minutes: Number(e.target.value) })}
                className="mt-1 w-full rounded-xl border border-zinc-300 bg-zinc-50 p-2.5 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300">
                Durasi Level 3 AP (Menit):
              </label>
              <input
                type="number"
                value={settings.default_ap_duration_minutes}
                onChange={(e) => setSettings({ ...settings, default_ap_duration_minutes: Number(e.target.value) })}
                className="mt-1 w-full rounded-xl border border-zinc-300 bg-zinc-50 p-2.5 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Section 3: System Diagnostics & OCR Status */}
        {stats && (
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center gap-2.5 border-b border-zinc-100 pb-4 dark:border-zinc-800">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                <HardDrive className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-zinc-900 dark:text-white">
                  Diagnostik Sistem & Penyimpanan
                </h3>
                <p className="text-[11px] text-zinc-500">
                  Status modul OCR Tesseract, folder diagram ter-crop, dan file database JSON.
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="rounded-2xl border border-zinc-100 bg-zinc-50/70 p-3 dark:border-zinc-800 dark:bg-zinc-800/40">
                <div className="text-[11px] text-zinc-500">Tesseract OCR</div>
                <div className="mt-1 font-bold text-emerald-600 dark:text-emerald-400">
                  {stats.tesseract_ocr_available ? "Installed & Active" : "Not Found"}
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-100 bg-zinc-50/70 p-3 dark:border-zinc-800 dark:bg-zinc-800/40">
                <div className="text-[11px] text-zinc-500">Bahasa OCR Terdeteksi</div>
                <div className="mt-1 font-bold text-zinc-800 dark:text-zinc-200">
                  {stats.tesseract_languages.join(", ") || "jpn, eng"}
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-100 bg-zinc-50/70 p-3 dark:border-zinc-800 dark:bg-zinc-800/40">
                <div className="text-[11px] text-zinc-500">Diagram Gambar Ter-crop</div>
                <div className="mt-1 font-bold text-indigo-600 dark:text-indigo-400">
                  {stats.total_diagrams} Berkas
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-100 bg-zinc-50/70 p-3 dark:border-zinc-800 dark:bg-zinc-800/40">
                <div className="text-[11px] text-zinc-500">Ukuran DB & Aset</div>
                <div className="mt-1 font-bold text-zinc-800 dark:text-zinc-200">
                  {stats.storage_size_kb} KB
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 font-bold text-xs text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-500 active:scale-95 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{isSaving ? "Menyimpan Perubahan..." : "Simpan Semua Pengaturan"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
