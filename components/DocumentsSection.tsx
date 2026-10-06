"use client";

import React, { useState } from "react";
import { HistoryDocument, PRESET_DOCUMENTS } from "@/lib/presets";
import { Plus, Trash2, BookOpen, CheckCircle, ArrowRight, FileText, AlertCircle, Copy, RotateCcw } from "lucide-react";

interface DocumentsSectionProps {
  documents: HistoryDocument[];
  setDocuments: React.Dispatch<React.SetStateAction<HistoryDocument[]>>;
  onProceedToInterview: () => void;
}

export default function DocumentsSection({
  documents,
  setDocuments,
  onProceedToInterview,
}: DocumentsSectionProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleUpdate = (id: string, field: "title" | "content", value: string) => {
    setDocuments((prev) =>
      prev.map((doc) => (doc.id === id ? { ...doc, [field]: value } : doc))
    );
  };

  const handleAddDocument = () => {
    const nextNumber = documents.length + 1;
    const newDoc: HistoryDocument = {
      id: `doc-${Date.now()}`,
      label: `Belge ${nextNumber}:`,
      title: `Tarihî Belge ${nextNumber}`,
      content: "",
    };
    setDocuments((prev) => [...prev, newDoc]);
  };

  const handleRemove = (id: string) => {
    if (documents.length <= 1) {
      alert("En az 1 belge bulunmalıdır.");
      return;
    }
    const filtered = documents.filter((doc) => doc.id !== id);
    // Re-index labels
    const reindexed = filtered.map((doc, idx) => ({
      ...doc,
      label: `Belge ${idx + 1}:`,
    }));
    setDocuments(reindexed);
  };

  const handleLoadPreset = (index: number) => {
    const preset = PRESET_DOCUMENTS[index];
    if (preset) {
      setDocuments(preset.docs);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const totalWords = documents.reduce(
    (acc, doc) => acc + (doc.content.trim() ? doc.content.trim().split(/\s+/).length : 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Top Banner / Teacher Info */}
      <div className="bg-amber-950/10 border border-amber-900/20 rounded-2xl p-4 sm:p-6 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <div className="p-2.5 bg-amber-700/20 border border-amber-700/30 rounded-xl text-amber-800 shrink-0 mt-0.5">
              <BookOpen className="w-5 h-5 text-amber-800" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-newspaper-headline text-stone-900">
                1. BÖLÜM: BİRİNCİL TARİHÎ BELGELER
              </h2>
              <p className="text-sm text-stone-600 mt-1 font-sans-ui">
                Öğretmen olarak 2-3 tarihî belge metnini aşağıya ekleyin veya yapıştırın. Yapay zekâ muhabir,
                soruları <strong>yalnızca</strong> bu belgelerdeki verilere dayanarak ve alıntılayarak cevaplayacaktır.
              </p>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block w-full sm:w-auto">
              Hazır Ders Seti:
            </span>
            {PRESET_DOCUMENTS.map((preset, idx) => (
              <button
                key={preset.name}
                onClick={() => handleLoadPreset(idx)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-stone-200/80 hover:bg-amber-800 hover:text-white text-stone-800 transition-colors border border-stone-300 shadow-xs flex items-center space-x-1"
                title={preset.description}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{preset.name.split(" ")[0]} & {preset.name.split(" ")[2] || "Kongresi"}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Status Bar */}
        <div className="mt-4 pt-4 border-t border-amber-900/10 flex flex-wrap items-center justify-between text-xs text-stone-600 gap-2">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1 font-medium text-amber-900">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>{documents.length} Tarihî Belge Yüklendi</span>
            </span>
            <span className="text-stone-400">•</span>
            <span>Toplam {totalWords} kelime</span>
          </div>

          <div className="flex items-center space-x-1 text-stone-500">
            <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
            <span>Muhabir kuralı: Belgede bulunmayan bilgi verilmez.</span>
          </div>
        </div>
      </div>

      {/* Document Cards */}
      <div className="space-y-5">
        {documents.map((doc, index) => {
          const wordCount = doc.content.trim() ? doc.content.trim().split(/\s+/).length : 0;
          return (
            <div
              key={doc.id}
              className="bg-white border-2 border-stone-300/80 rounded-2xl shadow-sm overflow-hidden hover:border-amber-700/60 transition-all"
            >
              {/* Card Header */}
              <div className="bg-stone-100/90 px-4 py-3 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center space-x-3 flex-1 min-w-[200px]">
                  <span className="px-2.5 py-1 rounded bg-amber-800 text-amber-50 text-xs font-bold uppercase tracking-wider font-newspaper-headline">
                    {doc.label}
                  </span>
                  <input
                    type="text"
                    value={doc.title}
                    onChange={(e) => handleUpdate(doc.id, "title", e.target.value)}
                    placeholder="Belge Başlığı (örn. Amasya Genelgesi Maddeleri)"
                    className="font-bold text-stone-800 text-sm sm:text-base bg-transparent border-b border-dashed border-stone-300 focus:border-amber-700 focus:outline-hidden w-full max-w-md font-newspaper-headline"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs text-stone-500 font-sans-ui">
                    {wordCount} kelime
                  </span>

                  <button
                    onClick={() => handleCopy(doc.id, doc.content)}
                    className="p-1.5 rounded-md hover:bg-stone-200 text-stone-600 transition-colors text-xs flex items-center space-x-1"
                    title="Metni Kopyala"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">
                      {copiedId === doc.id ? "Kopyalandı!" : "Kopyala"}
                    </span>
                  </button>

                  {documents.length > 1 && (
                    <button
                      onClick={() => handleRemove(doc.id)}
                      className="p-1.5 rounded-md hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors"
                      title="Belgeyi Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Card Body - Document Textarea */}
              <div className="p-4 sm:p-5">
                <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-2 font-sans-ui">
                  Tarihî Belge Metni (Maddeler, Kararlar veya Telgraf Metni):
                </label>
                <textarea
                  value={doc.content}
                  onChange={(e) => handleUpdate(doc.id, "content", e.target.value)}
                  placeholder={`Öğretmen buraya ${doc.label} metnini yapıştırır...`}
                  rows={8}
                  className="w-full p-4 rounded-xl border border-stone-300 bg-stone-50/50 text-stone-900 font-newspaper-body text-base leading-relaxed focus:bg-white focus:border-amber-700 focus:ring-2 focus:ring-amber-700/20 focus:outline-hidden transition-all shadow-inner"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <button
          onClick={handleAddDocument}
          className="w-full sm:w-auto px-5 py-3 rounded-xl border-2 border-dashed border-stone-400 hover:border-amber-700 hover:bg-amber-50 text-stone-700 hover:text-amber-900 font-semibold text-sm transition-all flex items-center justify-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Belge Ekle (Belge {documents.length + 1})</span>
        </button>

        <button
          onClick={onProceedToInterview}
          disabled={totalWords === 0}
          className={`w-full sm:w-auto px-7 py-3 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center space-x-2 shadow-md transition-all ${
            totalWords > 0
              ? "bg-amber-800 hover:bg-amber-900 text-amber-50 cursor-pointer shadow-amber-900/20"
              : "bg-stone-300 text-stone-500 cursor-not-allowed"
          }`}
        >
          <span>2. Bölüm: Röportaja Başla</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
