import Link from "next/link";
import { ShieldCheck, BookOpen, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white text-sm">
                J
              </div>
              <span className="font-bold text-base text-zinc-900 dark:text-white">JITEC Exam Hub</span>
            </div>
            <p className="max-w-md text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
              Platform persiapan mandiri ujian Information Technology Engineers Examination (情報処理技術者試験) standar IPA Jepang. Dirancang untuk engineer Indonesia dengan dukungan bilingual dan kamus kanji IT.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-xs uppercase tracking-wider text-zinc-900 dark:text-white">Level Ujian</h4>
            <ul className="mt-3 space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
              <li><Link href="/exams?level=level1" className="hover:text-indigo-600">Level 1: IT Passport (IP)</Link></li>
              <li><Link href="/exams?level=level2" className="hover:text-indigo-600">Level 2: Fundamental IT (FE)</Link></li>
              <li><Link href="/exams?level=level2" className="hover:text-indigo-600">Level 2: Security Mgmt (SG)</Link></li>
              <li><Link href="/exams?level=level3" className="hover:text-indigo-600">Level 3: Applied IT (AP)</Link></li>
              <li><Link href="/exams?level=level4" className="hover:text-indigo-600">Level 4: Database Specialist (DB)</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-xs uppercase tracking-wider text-zinc-900 dark:text-white">Fitur Studio</h4>
            <ul className="mt-3 space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
              <li><Link href="/admin/extractor" className="hover:text-rose-600">PDF Ingestion & Extractor</Link></li>
              <li><Link href="/glossary" className="hover:text-indigo-600">Glosarium Kanji IT Jepang</Link></li>
              <li><Link href="/exams" className="hover:text-indigo-600">Simulasi CBT Timed</Link></li>
              <li><a href="https://www.ipa.go.jp/shiken/" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-indigo-600">IPA Official Site <ExternalLink className="h-3 w-3" /></a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-zinc-200 pt-6 text-center text-xs text-zinc-400 dark:border-zinc-800">
          © {new Date().getFullYear()} JITEC Exam Hub Platform. Materi soal hak cipta milik IPA (Information-technology Promotion Agency Japan).
        </div>
      </div>
    </footer>
  );
}
