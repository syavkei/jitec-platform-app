"use client";

import React, { useState } from "react";

interface KanjiTermDef {
  term: string;
  furigana: string;
  en: string;
  id: string;
  vi: string;
}

const KANJI_DICTIONARY: Record<string, KanjiTermDef> = {
  "稼働率": {
    term: "稼働率",
    furigana: "かどうりつ",
    en: "Availability / Operating Ratio (MTBF / (MTBF + MTTR))",
    id: "Tingkat ketersediaan sistem tanpa henti (MTBF/(MTBF+MTTR))",
    vi: "Tỷ lệ sẵn sàng hoạt động của hệ thống (MTBF / (MTBF + MTTR))"
  },
  "脆弱性": {
    term: "脆弱性",
    furigana: "ぜいじゃくせい",
    en: "Vulnerability / Security flaw",
    id: "Celah atau kerentanan keamanan sistem yang dapat dieksploitasi",
    vi: "Lỗ hổng bảo mật trong hệ thống"
  },
  "排他制御": {
    term: "排他制御",
    furigana: "はいたいせいぎょ",
    en: "Concurrency Control / Locking",
    id: "Kontrol penguncian untuk mencegah tabrakan data saat diakses bersamaan",
    vi: "Kiểm soát đồng thời / Khóa dữ liệu để tránh xung đột"
  },
  "正規化": {
    term: "正規化",
    furigana: "せいきか",
    en: "Database Normalization (1NF, 2NF, 3NF)",
    id: "Proses memecah tabel relasional untuk menghilangkan redundansi data",
    vi: "Chuẩn hóa cơ sở dữ liệu để loại bỏ dư thừa"
  },
  "主キー": {
    term: "主キー",
    furigana: "しゅきー",
    en: "Primary Key (Unique & NOT NULL)",
    id: "Kunci utama pengidentifikasi unik baris record (Unique & NOT NULL)",
    vi: "Khóa chính dùng để định danh duy nhất mỗi bản ghi"
  },
  "外部キー": {
    term: "外部キー",
    furigana: "がいぶきー",
    en: "Foreign Key (Referential Integrity)",
    id: "Kunci tamu yang merujuk primary key tabel lain",
    vi: "Khóa ngoại tham chiếu đến khóa chính của bảng khác"
  },
  "二分探索木": {
    term: "二分探索木",
    furigana: "にぶんたんさくぎ",
    en: "Binary Search Tree (BST: Left < Root < Right)",
    id: "Pohon biner di mana anak kiri < induk < anak kanan",
    vi: "Cây tìm kiếm nhị phân (Nút trái < Nút cha < Nút phải)"
  },
  "公開鍵暗号": {
    term: "公開鍵暗号",
    furigana: "こうかいかぎあんごう",
    en: "Public Key Cryptography (Asymmetric Encryption)",
    id: "Enkripsi asimetris menggunakan pasangan public key & private key",
    vi: "Mật mã khóa công khai (Mã hóa bất đối xứng)"
  },
  "丸め誤差": {
    term: "丸め誤差",
    furigana: "まるめごさ",
    en: "Rounding Error (Floating Point precision)",
    id: "Galat akibat pembulatan digit desimal floating point",
    vi: "Lỗi làm tròn trong biểu diễn số dấu phẩy động"
  },
  "要件定義": {
    term: "要件定義",
    furigana: "ようけんていぎ",
    en: "Requirements Definition / Engineering",
    id: "Definisi kebutuhan sistem fungsional dan operasional",
    vi: "Định nghĩa yêu cầu hệ thống"
  },
  "自然言語処理": {
    term: "自然言語処理",
    furigana: "しぜんげんごしょり",
    en: "Natural Language Processing (NLP)",
    id: "Pemrosesan bahasa alami oleh komputer",
    vi: "Xử lý ngôn ngữ tự nhiên (NLP)"
  },
  "強化学習": {
    term: "強化学習",
    furigana: "きょうかがくしゅう",
    en: "Reinforcement Learning (RL)",
    id: "Pembelajaran mesin berbasis reward & penalty",
    vi: "Học tăng cường trong AI"
  },
  "浮動小数点": {
    term: "浮動小数点",
    furigana: "ふどうしょうすうてん",
    en: "Floating Point number format",
    id: "Representasi angka pecahan berbasis mantissa & eksponen",
    vi: "Định dạng số dấu phẩy động"
  },
};

interface FuriganaTextProps {
  text: string;
  className?: string;
}

export function FuriganaText({ text, className = "" }: FuriganaTextProps) {
  const [activeTooltip, setActiveTooltip] = useState<KanjiTermDef | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  if (!text) return null;

  const terms = Object.keys(KANJI_DICTIONARY);
  const regex = new RegExp(`(${terms.join("|")})`, "g");
  const parts = text.split(regex);

  const handleMouseEnter = (term: string, e: React.MouseEvent) => {
    const def = KANJI_DICTIONARY[term];
    if (def) {
      const rect = e.currentTarget.getBoundingClientRect();
      setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top });
      setActiveTooltip(def);
    }
  };

  return (
    <span className={`relative leading-relaxed ${className}`}>
      {parts.map((part, idx) => {
        const def = KANJI_DICTIONARY[part];
        if (def) {
          return (
            <span
              key={idx}
              onMouseEnter={(e) => handleMouseEnter(part, e)}
              onMouseLeave={() => setActiveTooltip(null)}
              className="group relative inline-block cursor-help border-b-2 border-indigo-400/80 bg-indigo-50/70 px-1 py-0.5 font-medium text-indigo-950 transition-colors hover:bg-indigo-100 dark:border-indigo-500 dark:bg-indigo-950/40 dark:text-indigo-200"
            >
              <ruby>
                {part}
                <rt className="text-[10px] font-normal text-indigo-600 select-none dark:text-indigo-400">
                  {def.furigana}
                </rt>
              </ruby>
            </span>
          );
        }
        return <React.Fragment key={idx}>{part}</React.Fragment>;
      })}

      {/* Floating Multilingual Tooltip */}
      {activeTooltip && (
        <div
          className="fixed z-50 -translate-x-1/2 -translate-y-full pb-2"
          style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}
        >
          <div className="w-72 rounded-2xl border border-zinc-200 bg-zinc-900 p-3.5 text-white shadow-2xl shadow-black/40 dark:border-zinc-700">
            <div className="flex items-baseline justify-between border-b border-zinc-700 pb-2">
              <span className="font-extrabold text-sm text-indigo-400">
                {activeTooltip.term} ({activeTooltip.furigana})
              </span>
              <span className="rounded bg-indigo-950 px-1.5 py-0.5 text-[9px] font-bold text-indigo-300">
                IT KANJI
              </span>
            </div>
            <div className="mt-2 space-y-1.5 text-xs text-zinc-300">
              <div><strong className="text-zinc-400 font-normal">🇬🇧 EN:</strong> {activeTooltip.en}</div>
              <div><strong className="text-zinc-400 font-normal">🇮🇩 ID:</strong> {activeTooltip.id}</div>
              <div><strong className="text-zinc-400 font-normal">🇻🇳 VI:</strong> {activeTooltip.vi}</div>
            </div>
          </div>
        </div>
      )}
    </span>
  );
}
