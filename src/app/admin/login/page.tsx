"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginAdmin } from "@/lib/api";
import { useAuthStore } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  Lock,
  User as UserIcon,
  ArrowRight,
  AlertCircle,
  Key,
  Sliders,
  Terminal,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const { setAdminAuth } = useAuthStore();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Username dan password administrator wajib diisi.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await loginAdmin(username, password);
      if (res.success) {
        setAdminAuth(res.user, res.token);
        router.push("/admin");
      }
    } catch (err: any) {
      setError(err.message || "Kredensial administrator tidak valid.");
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemoAdmin = () => {
    setUsername("admin");
    setPassword("jitec_admin_2025");
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 sm:p-6 text-white relative overflow-hidden">
      {/* Background Cyber Blue Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-blue-600/20 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute -top-10 -right-10 w-80 h-80 bg-sky-500/10 blur-3xl pointer-events-none rounded-full" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-600/30">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-0.5 text-xs font-bold text-blue-400 border border-blue-500/20">
            <Terminal className="h-3 w-3" />
            <span>RESTRICTED ACCESS • ADMIN STUDIO</span>
          </div>
          <h1 className="font-extrabold text-2xl tracking-tight text-white">
            Portal Khusus Administrator
          </h1>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Akses tingkat tinggi untuk modul ingest PDF kakomon, manajemen bank soal, dan pengaturan sistem JITEC.
          </p>
        </div>

        {/* Quick Demo Credentials in Blue Theme */}
        <div className="rounded-2xl border border-blue-900/50 bg-blue-950/30 p-3.5 text-xs text-blue-200 flex items-center justify-between gap-3 shadow-inner">
          <div className="space-y-0.5">
            <div className="font-bold flex items-center gap-1.5 text-blue-400">
              <Key className="h-3.5 w-3.5" />
              <span>Kredensial Admin Demo:</span>
            </div>
            <div className="text-[11px] text-slate-300 font-mono">
              admin / jitec_admin_2025
            </div>
          </div>
          <button
            type="button"
            onClick={handleFillDemoAdmin}
            className="shrink-0 rounded-xl bg-blue-600 px-3 py-1.5 font-bold text-[11px] text-white shadow-sm hover:bg-blue-500 active:scale-95 transition-all cursor-pointer"
          >
            Gunakan Demo
          </button>
        </div>

        <div className="rounded-3xl border border-slate-800/80 bg-slate-900/90 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-rose-800/60 bg-rose-950/40 p-3 text-xs text-rose-300">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block font-semibold text-slate-300">
                Username Admin:
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full rounded-2xl border border-slate-800 bg-slate-950/80 py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block font-semibold text-slate-300">
                Password Admin:
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-2xl border border-slate-800 bg-slate-950/80 py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3 font-bold text-xs text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
              >
                <span>{loading ? "Mengotentikasi..." : "Verifikasi & Masuk ke Admin Studio"}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Back to User Portal */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Kembali ke Portal Peserta</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
