"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { loginUser } from "@/lib/api";
import { useAuthStore } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  Sparkles,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

function UserLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/exams";

  const { setUserAuth } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Silakan isi email dan kata sandi Anda.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await loginUser(email, password);
      if (res.success) {
        setUserAuth(res.user, res.token);
        router.push(redirectUrl);
      }
    } catch (err: any) {
      setError(err.message || "Login gagal. Periksa kembali email dan password.");
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail("engineer@jitec.global");
    setPassword("candidate2025");
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25">
            <GraduationCap className="h-7 w-7" />
          </div>
          <h1 className="font-extrabold text-2xl tracking-tight text-zinc-900 dark:text-white">
            Masuk ke Portal Peserta
          </h1>
          <p className="text-xs text-zinc-500 max-w-xs mx-auto">
            Hanya peserta yang telah login yang dapat mengerjakan simulasi CBT dan latihan soal.
          </p>
        </div>

        {/* Demo Candidate Banner */}
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50/60 p-3.5 text-xs text-indigo-950 dark:border-indigo-900/50 dark:bg-indigo-950/30 dark:text-indigo-200 flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="font-bold flex items-center gap-1">
              <Zap className="h-3.5 w-3.5 text-amber-500" />
              <span>Akun Demo Candidate:</span>
            </div>
            <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
              engineer@jitec.global (PW: candidate2025)
            </div>
          </div>
          <button
            type="button"
            onClick={handleFillDemo}
            className="shrink-0 rounded-xl bg-indigo-600 px-3 py-1.5 font-bold text-[11px] text-white shadow-sm hover:bg-indigo-500 active:scale-95"
          >
            Gunakan Demo
          </button>
        </div>

        <Card gradientAccent="indigo">
          <CardHeader className="pb-4">
            <CardTitle>Login Peserta</CardTitle>
            <CardDescription>
              Masukkan kredensial akun peserta JITEC Anda.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Alamat Email:
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Kata Sandi (Password):
                  </label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-3 pt-2">
              <Button
                type="submit"
                disabled={loading}
                variant="gradient"
                className="w-full h-11"
              >
                <span>{loading ? "Memproses..." : "Masuk & Mulai Latihan"}</span>
                <ArrowRight className="h-4 w-4" />
              </Button>

              <div className="flex items-center justify-between w-full text-xs text-zinc-500 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <span>Belum punya akun?</span>
                <Link href="/register" className="font-bold text-indigo-600 hover:underline">
                  Daftar Akun Baru
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>

        {/* Link to Dedicated Admin Login */}
        <div className="text-center">
          <Link
            href="/admin/login"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-rose-500" />
            <span>Login Khusus Administrator / Staff Studio ➔</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function UserLoginPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-zinc-400">Memuat halaman login...</div>}>
      <UserLoginContent />
    </Suspense>
  );
}
