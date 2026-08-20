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
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 sm:p-6 text-white relative overflow-hidden">
      {/* Background Cyber Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-rose-600/15 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-600 text-white shadow-xl shadow-rose-600/30">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-3 py-0.5 text-xs font-bold text-rose-400 border border-rose-500/20">
            <Terminal className="h-3 w-3" />
            <span>RESTRICTED ACCESS • ADMIN STUDIO</span>
          </div>
          <h1 className="font-extrabold text-2xl tracking-tight text-white">
            Portal Khusus Administrator
          </h1>
          <p className="text-xs text-zinc-400 max-w-xs mx-auto">
            Akses tingkat tinggi untuk modul ingest PDF kakomon, CRUD soal, dan pengaturan sistem JITEC.
          </p>
        </div>

        {/* Quick Demo Credentials */}
        <div className="rounded-2xl border border-rose-900/40 bg-rose-950/20 p-3.5 text-xs text-rose-200 flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="font-bold flex items-center gap-1 text-rose-400">
              <Key className="h-3.5 w-3.5" />
              <span>Kredensial Admin Demo:</span>
            </div>
            <div className="text-[11px] text-zinc-400 font-mono">
              admin / jitec_admin_2025
            </div>
          </div>
          <button
            type="button"
            onClick={handleFillDemoAdmin}
            className="shrink-0 rounded-xl bg-rose-600 px-3 py-1.5 font-bold text-[11px] text-white shadow-sm hover:bg-rose-500 active:scale-95 cursor-pointer"
          >
            Gunakan Demo
          </button>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/90 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-rose-800/60 bg-rose-950/40 p-3 text-xs text-rose-300">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block font-semibold text-zinc-300">
                Username Admin:
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full rounded-2xl border border-zinc-800 bg-zinc-950/80 py-2.5 pl-10 pr-4 text-xs text-white placeholder-zinc-500 focus:border-rose-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block font-semibold text-zinc-300">
                Password Admin:
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-2xl border border-zinc-800 bg-zinc-950/80 py-2.5 pl-10 pr-4 text-xs text-white placeholder-zinc-500 focus:border-rose-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-rose-600 py-3 font-bold text-xs text-white shadow-lg shadow-rose-600/30 hover:bg-rose-500 active:scale-95 disabled:opacity-50 cursor-pointer"
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
            className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Kembali ke Portal Peserta</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
