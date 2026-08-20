"use client";

import { useState } from "react";
import { FileText, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

interface PdfViewerProps {
  pdfRelativePath: string | null;
  currentPage?: number;
}

export function PdfViewer({ pdfRelativePath, currentPage = 1 }: PdfViewerProps) {
  const [page, setPage] = useState(currentPage);

  if (!pdfRelativePath) {
    return (
      <div className="flex h-full min-h-[500px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 p-8 text-center dark:border-zinc-800 dark:bg-zinc-900/50">
        <FileText className="h-12 w-12 text-zinc-400" />
        <h3 className="mt-3 font-semibold text-sm text-zinc-700 dark:text-zinc-300">
          Belum Ada PDF yang Dipilih
        </h3>
        <p className="mt-1 max-w-xs text-xs text-zinc-500">
          Pilih file soal dari daftar kakomon di atas untuk melihat dokumen PDF asli.
        </p>
      </div>
    );
  }

  // Use PDF.js embed or object viewer
  // In FastAPI static, we can serve it or preview
  const fileUrl = `/api/proxy-pdf?path=${encodeURIComponent(pdfRelativePath)}`;

  return (
    <div className="flex h-full flex-col rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      {/* Header Toolbar */}
      <div className="flex items-center justify-between border-b border-zinc-100 p-3.5 dark:border-zinc-800">
        <div className="flex items-center gap-2 truncate">
          <FileText className="h-4 w-4 text-indigo-600" />
          <span className="font-semibold text-xs text-zinc-900 truncate dark:text-white">
            {pdfRelativePath.split("/").pop()}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <span>Halaman {page}</span>
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            className="rounded border border-zinc-200 p-1 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setPage(page + 1)}
            className="rounded border border-zinc-200 p-1 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* PDF View Container */}
      <div className="flex-1 bg-zinc-100 dark:bg-zinc-950 p-2">
        <iframe
          src={`http://127.0.0.1:8000/static/diagrams/../..//${pdfRelativePath}#page=${currentPage || page}`}
          className="h-full min-h-[600px] w-full rounded-xl border border-zinc-200 bg-white dark:border-zinc-800"
          title="PDF Preview"
        />
      </div>
    </div>
  );
}
