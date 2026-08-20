"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth";
import {
  LayoutDashboard,
  GraduationCap,
  HelpCircle,
  BookOpen,
  Settings,
  FileText,
  ArrowLeft,
  Sliders,
  ShieldCheck,
  LogOut,
  User,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { admin, initAuthFromStorage, logoutAdmin } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    initAuthFromStorage();
    setMounted(true);
  }, [initAuthFromStorage]);

  // Bypass layout auth guard for admin login page
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (mounted && !isLoginPage && !admin) {
      router.push("/admin/login");
    }
  }, [mounted, isLoginPage, admin, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!mounted || !admin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white text-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 animate-pulse text-rose-500" />
          <span>Memverifikasi izin akses Administrator...</span>
        </div>
      </div>
    );
  }

  const navItems = [
    { href: "/admin", label: "Dashboard Overview", icon: LayoutDashboard, exact: true },
    { href: "/admin/exams", label: "Kelola Ujian (Exams)", icon: GraduationCap },
    { href: "/admin/questions", label: "Kelola Soal (Questions)", icon: HelpCircle },
    { href: "/admin/glossary", label: "Kelola Glosarium Kanji", icon: BookOpen },
    { href: "/admin/extractor", label: "PDF & AI Extractor Studio", icon: FileText, highlight: true },
    { href: "/admin/settings", label: "Pengaturan & Sistem", icon: Sliders },
  ];

  return (
    <div className="flex min-h-screen bg-zinc-100/70 dark:bg-zinc-950">
      {/* Admin Sidebar */}
      <aside className="w-64 shrink-0 border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 hidden md:flex flex-col justify-between">
        <div>
          {/* Sidebar Header */}
          <div className="flex h-16 items-center gap-3 border-b border-zinc-200 px-6 dark:border-zinc-800">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-600 font-bold text-white shadow-md shadow-rose-500/20">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm text-zinc-900 dark:text-white">Admin Studio</span>
                <span className="rounded bg-rose-100 px-1.5 py-0.2 text-[9px] font-bold text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                  PRO
                </span>
              </div>
              <p className="text-[10px] text-zinc-400">JITEC Exam Management</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? pathname === item.href
                : pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                    isActive
                      ? item.highlight
                        ? "bg-rose-600 text-white shadow-sm"
                        : "bg-indigo-600 text-white shadow-sm"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.highlight && !isActive && (
                    <span className="rounded-full bg-rose-500/10 px-1.5 py-0.5 text-[9px] font-bold text-rose-600 dark:text-rose-400">
                      AI PDF
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer with Admin Info & Logout */}
        <div className="border-t border-zinc-200 p-4 dark:border-zinc-800 space-y-2">
          <div className="flex items-center justify-between px-2 py-1">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                <User className="h-4 w-4" />
              </div>
              <div className="text-[11px]">
                <div className="font-bold text-zinc-900 dark:text-white truncate max-w-[100px]">
                  {admin.name}
                </div>
                <div className="text-[10px] text-zinc-400">Admin Active</div>
              </div>
            </div>
            <button
              onClick={() => {
                logoutAdmin();
                router.push("/admin/login");
              }}
              title="Logout Admin"
              className="rounded-lg p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Kembali ke Portal User</span>
          </Link>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between border-b border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-zinc-900 dark:text-white">Admin Panel</span>
          </div>
          <button
            onClick={() => {
              logoutAdmin();
              router.push("/admin/login");
            }}
            className="text-xs font-semibold text-rose-600"
          >
            Logout
          </button>
        </div>

        <div className="flex-1 p-4 sm:p-8 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
