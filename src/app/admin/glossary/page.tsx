"use client";

import { useEffect, useState } from "react";
import { GlossaryTerm } from "@/types";
import {
  fetchGlossary,
  searchGlossary,
  createGlossaryTerm,
  updateGlossaryTerm,
  deleteGlossaryTerm,
} from "@/lib/api";
import {
  BookOpen,
  Plus,
  Edit3,
  Trash2,
  Search,
  CheckCircle2,
  X,
  Globe,
  Sparkles,
} from "lucide-react";

export default function AdminGlossaryManagementPage() {
  const [terms, setTerms] = useState<GlossaryTerm[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTermId, setEditingTermId] = useState<string | null>(null);

  const [formData, setFormData] = useState<GlossaryTerm>({
    id: "",
    term_ja: "",
    reading_furigana: "",
    romaji: "",
    term_en: "",
    term_id: "",
    term_vi: "",
    category: "Database",
    definition_ja: "",
    definition_en: "",
    definition_id: "",
    definition_vi: "",
    example_sentence_ja: "",
    example_sentence_en: "",
    example_sentence_id: "",
    example_sentence_vi: "",
  });

  const loadGlossary = () => {
    setLoading(true);
    fetchGlossary()
      .then((data) => {
        setTerms(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadGlossary();
  }, []);

  const handleOpenCreate = () => {
    setEditingTermId(null);
    setFormData({
      id: `term_${Date.now()}`,
      term_ja: "",
      reading_furigana: "",
      romaji: "",
      term_en: "",
      term_id: "",
      term_vi: "",
      category: "Database",
      definition_ja: "",
      definition_en: "",
      definition_id: "",
      definition_vi: "",
      example_sentence_ja: "",
      example_sentence_en: "",
      example_sentence_id: "",
      example_sentence_vi: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t: GlossaryTerm) => {
    setEditingTermId(t.id);
    setFormData(JSON.parse(JSON.stringify(t)));
    setIsModalOpen(true);
  };

  const handleDelete = async (termId: string, termJa: string) => {
    if (!window.confirm(`Hapus istilah "${termJa}" dari glosarium?`)) return;
    try {
      await deleteGlossaryTerm(termId);
      loadGlossary();
    } catch (err: any) {
      alert(`Gagal menghapus: ${err.message}`);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.term_ja || !formData.term_en || !formData.term_id) {
      alert("Kanji, istilah Inggris, dan terjemahan Indonesia wajib diisi.");
      return;
    }

    try {
      if (editingTermId) {
        await updateGlossaryTerm(editingTermId, formData);
      } else {
        await createGlossaryTerm(formData);
      }
      setIsModalOpen(false);
      loadGlossary();
    } catch (err: any) {
      alert(`Gagal menyimpan istilah: ${err.message}`);
    }
  };

  const filteredTerms = terms.filter((t) =>
    t.term_ja.toLowerCase().includes(search.toLowerCase()) ||
    t.reading_furigana.toLowerCase().includes(search.toLowerCase()) ||
    t.term_en.toLowerCase().includes(search.toLowerCase()) ||
    t.term_id.toLowerCase().includes(search.toLowerCase()) ||
    (t.term_vi && t.term_vi.toLowerCase().includes(search.toLowerCase())) ||
    t.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 pb-6 dark:border-zinc-800">
        <div>
          <h1 className="font-extrabold text-2xl text-zinc-900 tracking-tight dark:text-white">
            Kelola Glosarium Kanji IT (Glossary CRUD)
          </h1>
          <p className="mt-1 text-xs text-zinc-500">
            Daftar kosakata kanji IT, furigana cara baca, dan kamus istilah multibahasa (JA, EN, ID, VI).
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 font-bold text-xs text-white shadow-md hover:bg-indigo-500 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Kosakata Baru</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari kanji, furigana, English, atau Indonesia..."
          className="w-full rounded-2xl border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-xs text-zinc-900 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
        />
      </div>

      {/* Table */}
      <div className="rounded-3xl border border-zinc-200 bg-white shadow-sm overflow-hidden dark:border-zinc-800 dark:bg-zinc-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/70 text-zinc-500 dark:border-zinc-800 dark:bg-zinc-800/40">
                <th className="py-3.5 px-4 font-semibold">KANJI & FURIGANA</th>
                <th className="py-3.5 px-4 font-semibold">🇬🇧 ENGLISH</th>
                <th className="py-3.5 px-4 font-semibold">🇮🇩 INDONESIA</th>
                <th className="py-3.5 px-4 font-semibold">🇻🇳 VIETNAMESE</th>
                <th className="py-3.5 px-4 font-semibold">KATEGORI</th>
                <th className="py-3.5 px-4 font-semibold text-right">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-zinc-400">
                    Memuat glosarium...
                  </td>
                </tr>
              ) : filteredTerms.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-400">
                    Tidak ada istilah yang cocok.
                  </td>
                </tr>
              ) : (
                filteredTerms.map((t) => (
                  <tr key={t.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                    <td className="py-4 px-4">
                      <div className="font-extrabold text-sm text-zinc-900 dark:text-white">
                        {t.term_ja}
                      </div>
                      <div className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400">
                        {t.reading_furigana} ({t.romaji})
                      </div>
                    </td>
                    <td className="py-4 px-4 font-semibold text-zinc-800 dark:text-zinc-200">
                      {t.term_en}
                    </td>
                    <td className="py-4 px-4 text-zinc-700 dark:text-zinc-300">
                      {t.term_id}
                    </td>
                    <td className="py-4 px-4 text-zinc-700 dark:text-zinc-300">
                      {t.term_vi || "-"}
                    </td>
                    <td className="py-4 px-4">
                      <span className="rounded-lg bg-zinc-100 px-2 py-0.5 font-semibold text-[11px] text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                        {t.category}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(t)}
                          className="rounded-lg border border-zinc-200 p-1.5 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(t.id, t.term_ja)}
                          className="rounded-lg border border-red-200 p-1.5 text-red-600 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl my-8 rounded-3xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 sm:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4 dark:border-zinc-800">
              <h3 className="font-extrabold text-lg text-zinc-900 dark:text-white">
                {editingTermId ? `Edit Kosakata: ${formData.term_ja}` : "Tambah Kosakata Kanji Baru"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-6 space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300">
                    Kanji Jepang:
                  </label>
                  <input
                    type="text"
                    value={formData.term_ja}
                    onChange={(e) => setFormData({ ...formData, term_ja: e.target.value })}
                    placeholder="e.g. 稼働率"
                    className="mt-1 w-full rounded-xl border border-zinc-300 bg-zinc-50 p-2.5 font-bold text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300">
                    Furigana (Hiragana):
                  </label>
                  <input
                    type="text"
                    value={formData.reading_furigana}
                    onChange={(e) => setFormData({ ...formData, reading_furigana: e.target.value })}
                    placeholder="e.g. かどうりつ"
                    className="mt-1 w-full rounded-xl border border-zinc-300 bg-zinc-50 p-2.5 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300">
                    Romaji:
                  </label>
                  <input
                    type="text"
                    value={formData.romaji}
                    onChange={(e) => setFormData({ ...formData, romaji: e.target.value })}
                    placeholder="e.g. kadouritsu"
                    className="mt-1 w-full rounded-xl border border-zinc-300 bg-zinc-50 p-2.5 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-blue-600 dark:text-blue-400">
                    🇬🇧 English Term:
                  </label>
                  <input
                    type="text"
                    value={formData.term_en}
                    onChange={(e) => setFormData({ ...formData, term_en: e.target.value })}
                    placeholder="Availability"
                    className="mt-1 w-full rounded-xl border border-zinc-300 bg-zinc-50 p-2.5 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-emerald-600 dark:text-emerald-400">
                    🇮🇩 Indonesian Term:
                  </label>
                  <input
                    type="text"
                    value={formData.term_id}
                    onChange={(e) => setFormData({ ...formData, term_id: e.target.value })}
                    placeholder="Ketersediaan Sistem"
                    className="mt-1 w-full rounded-xl border border-zinc-300 bg-zinc-50 p-2.5 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-purple-600 dark:text-purple-400">
                    🇻🇳 Vietnamese Term:
                  </label>
                  <input
                    type="text"
                    value={formData.term_vi || ""}
                    onChange={(e) => setFormData({ ...formData, term_vi: e.target.value })}
                    placeholder="Tỷ lệ sẵn sàng"
                    className="mt-1 w-full rounded-xl border border-zinc-300 bg-zinc-50 p-2.5 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300">
                  Kategori:
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g. Database / Security / Computer Systems"
                  className="mt-1 w-full rounded-xl border border-zinc-300 bg-zinc-50 p-2.5 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                />
              </div>

              {/* Definitions */}
              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300">
                  Definisi Konseptual (🇮🇩 Bahasa Indonesia):
                </label>
                <textarea
                  rows={2}
                  value={formData.definition_id}
                  onChange={(e) => setFormData({ ...formData, definition_id: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-zinc-300 bg-zinc-50 p-2.5 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300">
                  Definisi Asli (🇯🇵 Bahasa Jepang):
                </label>
                <textarea
                  rows={2}
                  value={formData.definition_ja}
                  onChange={(e) => setFormData({ ...formData, definition_ja: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-zinc-300 bg-zinc-50 p-2.5 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-zinc-100 pt-4 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-zinc-200 px-4 py-2 font-semibold text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-5 py-2 font-bold text-white hover:bg-indigo-500"
                >
                  Simpan Kosakata
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
