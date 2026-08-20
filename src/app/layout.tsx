import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "JITEC Exam Hub - Platform Latihan Ujian Sertifikasi IT Jepang",
  description: "Platform persiapan ujian sertifikasi IT nasional Jepang (情報処理技術者試験) untuk engineer Indonesia: IT Passport, FE, SG, AP, dan DB.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="flex min-h-screen flex-col bg-zinc-50 text-zinc-900 antialiased selection:bg-indigo-500 selection:text-white dark:bg-zinc-950 dark:text-zinc-50">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
