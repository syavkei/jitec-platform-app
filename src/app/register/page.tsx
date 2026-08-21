"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerUser } from "@/lib/api";
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
  User as UserIcon,
  Globe,
  ArrowRight,
  AlertCircle,
  Award,
} from "lucide-react";

export default function UserRegisterPage() {
  const router = useRouter();
  const { setUserAuth } = useAuthStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [country, setCountry] = useState("Indonesia");
  const [targetExam, setTargetExam] = useState("FE");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("Nama, email, dan password wajib diisi.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await registerUser(name, email, password, country, targetExam);
      if (res.success) {
        setUserAuth(res.user, res.token);
        router.push("/exams");
      }
    } catch (err: any) {
      setError(err.message || "Registrasi gagal. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25">
            <Sparkles className="h-7 w-7" />
          </div>
          <h1 className="font-extrabold text-2xl tracking-tight text-zinc-900 dark:text-white">
            Daftar Akun Peserta JITEC
          </h1>
          <p className="text-xs text-zinc-500 max-w-xs mx-auto">
            Buat akun untuk melacak progres skor kelulusan dan latihan bank soal interaktif.
          </p>
        </div>

        <Card gradientAccent="purple">
          <CardHeader className="pb-4">
            <CardTitle>Registrasi Akun Baru</CardTitle>
            <CardDescription>
              Isi data diri untuk memulai latihan soal.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleRegister}>
            <CardContent className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Nama Lengkap:
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Kenji Pratama"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

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
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Kata Sandi (Password):
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Negara Asal:
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 p-2.5 text-xs text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white font-medium"
                  >
                    <option value="Indonesia">Indonesia</option>
                    <option value="Vietnam">Vietnam</option>
                    <option value="Philippines">Philippines</option>
                    <option value="Myanmar">Myanmar</option>
                    <option value="Mongolia">Mongolia</option>
                    <option value="India">India</option>
                    <option value="Other">Lainnya / Other</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Target Sertifikasi:
                  </label>
                  <select
                    value={targetExam}
                    onChange={(e) => setTargetExam(e.target.value)}
                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 p-2.5 text-xs text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white font-medium"
                  >
                    <option value="IP">Level 1 (IT Passport)</option>
                    <option value="FE">Level 2 (FE Fundamental)</option>
                    <option value="AP">Level 3 (Applied IT)</option>
                    <option value="DB">Level 4 (Database Spec)</option>
                  </select>
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
                <span>{loading ? "Mendaftarkan..." : "Daftar & Masuk"}</span>
                <ArrowRight className="h-4 w-4" />
              </Button>

              <div className="flex items-center justify-between w-full text-xs text-zinc-500 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <span>Sudah punya akun?</span>
                <Link href="/login" className="font-bold text-indigo-600 hover:underline">
                  Masuk Sekarang
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
