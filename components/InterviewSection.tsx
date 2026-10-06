"use client";

import React, { useState } from "react";
import { HistoryDocument, SAMPLE_STUDENT_QUESTIONS } from "@/lib/presets";
import {
  Send,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  RotateCcw,
  User,
  Quote,
  CheckCircle2,
  HelpCircle,
  Radio,
  FileQuestion,
  Loader2,
} from "lucide-react";

export interface InterviewMessage {
  id: string;
  question: string;
  answer: string;
  timestamp: string;
  citedDocuments?: string[];
}

interface InterviewSectionProps {
  documents: HistoryDocument[];
  messages: InterviewMessage[];
  setMessages: React.Dispatch<React.SetStateAction<InterviewMessage[]>>;
  onProceedToBroadcast: () => void;
  onGoToDocuments: () => void;
}

export default function InterviewSection({
  documents,
  messages,
  setMessages,
  onProceedToBroadcast,
  onGoToDocuments,
}: InterviewSectionProps) {
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRules, setShowRules] = useState(false);

  // Combine loaded documents into a single labeled string
  const combinedDocumentsText = documents
    .map((doc) => `${doc.label} ${doc.title}\n${doc.content}`)
    .join("\n\n---\n\n");

  const handleSendQuestion = async (questionText: string) => {
    const trimmed = questionText.trim();
    if (!trimmed || isLoading) return;

    if (!combinedDocumentsText.trim()) {
      setError("Lütfen önce 1. Bölümden belgeleri ekleyin.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documents: combinedDocumentsText,
          question: trimmed,
          history: messages.map((m) => ({ question: m.question, answer: m.answer })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Röportaj cevabı alınırken bir hata oluştu.");
      }

      // Extract cited documents e.g. [Belge 1], [Belge 2]
      const matches = data.answer.match(/\[Belge\s*\d+[^\]]*\]/gi) || [];
      const citedDocuments: string[] = Array.from(new Set(matches.map((m: string) => m.trim())));

      const newId = `msg-${messages.length + 1}`;
      const timeStr = "1919 Muhabir Bülteni";

      const newMessage: InterviewMessage = {
        id: newId,
        question: trimmed,
        answer: data.answer,
        timestamp: timeStr,
        citedDocuments,
      };

      setMessages((prev) => [...prev, newMessage]);
      setCurrentQuestion("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Cevap üretilirken bir sorun oluştu.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    if (confirm("Tüm röportaj geçmişini sıfırlamak istiyor musunuz?")) {
      setMessages([]);
    }
  };

  // Helper to format text with citations and blockquotes
  const renderFormattedAnswer = (text: string) => {
    // Split lines
    const paragraphs = text.split("\n\n");
    return paragraphs.map((para, pIdx) => {
      // Highlight citations like [Belge 1] or [Belge 2]
      const parts = para.split(/(\[Belge\s*\d+[^\]]*\])/gi);

      return (
        <p key={pIdx} className="mb-2.5 last:mb-0 leading-relaxed font-newspaper-body text-stone-800 text-base">
          {parts.map((part, i) => {
            if (/^\[Belge\s*\d+[^\]]*\]$/i.test(part)) {
              return (
                <span
                  key={i}
                  className="inline-flex items-center px-2 py-0.5 mx-1 rounded-md bg-amber-100 text-amber-900 border border-amber-300 font-sans-ui text-xs font-bold tracking-wide shadow-2xs"
                >
                  {part}
                </span>
              );
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <div className="space-y-6">
      {/* Rules Banner */}
      <div className="bg-white border border-stone-300 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-800 text-amber-50 flex items-center justify-center font-newspaper-headline font-bold shrink-0">
              TM
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-newspaper-headline text-stone-900 flex items-center gap-2">
                2. BÖLÜM: TARİH MUHABİRİ RÖPORTAJI
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 font-sans-ui">
                Öğretmen ve öğrencilerin sorularını yanıtlayan tarafsız 1919 muhabiri.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowRules(!showRules)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-stone-300 hover:bg-stone-100 text-stone-700 flex items-center space-x-1.5 transition-colors"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
              <span>{showRules ? "Kuralları Gizle" : "Muhabir İlkeleri (7 Kural)"}</span>
            </button>
            {messages.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="text-xs px-2.5 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-1"
                title="Röportajı Temizle"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Temizle</span>
              </button>
            )}
          </div>
        </div>

        {/* Collapsible Rules List */}
        {showRules && (
          <div className="mt-4 pt-4 border-t border-stone-200 bg-amber-50/60 -mx-4 -mb-4 p-4 rounded-b-2xl text-xs text-stone-700 space-y-1.5 font-sans-ui animate-fadeIn">
            <div className="font-bold text-amber-950 mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Tarih Muhabiri Çalışma ve Doğrulama İlkeleri:</span>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 list-disc list-inside text-stone-700">
              <li><strong>Üçüncü Şahıs:</strong> Tarihî kişileri canlandırmaz, her zaman üçüncü şahısla anlatır.</li>
              <li><strong>Sadece Belgeler:</strong> Yalnızca yüklenen belgelerdeki bilgiyi kullanır, kendi genel bilgisini katmaz.</li>
              <li><strong>Kaynak Gösterme:</strong> Her cevabın sonuna dayandığı belgeyi ekler ([Belge 1], [Belge 2]).</li>
              <li><strong>Birebir Alıntı:</strong> Bir söz aktarırken tırnak içinde, değiştirmeden aktarır. Uydurma söz yapmaz.</li>
              <li><strong>Sınır Uyarısı:</strong> Cevap belgede yoksa &quot;Bu belgelerde bu sorunun cevabı yok...&quot; der.</li>
              <li><strong>Rol Reddi:</strong> Tarihî kişi gibi konuşması istenirse kibarca reddedip muhabir olarak kalır.</li>
              <li><strong>Öğrenci Dili:</strong> En fazla 5 cümle, 7-12. sınıf seviyesine uygun açık Türkçe.</li>
            </ul>
          </div>
        )}
      </div>

      {/* Suggested Questions */}
      <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 sm:p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-amber-800" />
            Öğrenciler İçin Örnek Sorular:
          </span>
          <span className="text-[11px] text-stone-400">Tıkla ve sor</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_STUDENT_QUESTIONS.map((sq, i) => (
            <button
              key={i}
              onClick={() => handleSendQuestion(sq)}
              disabled={isLoading}
              className="text-xs px-3 py-1.5 rounded-lg bg-white border border-stone-300 hover:border-amber-700 hover:bg-amber-50 text-stone-700 transition-all text-left shadow-2xs disabled:opacity-50"
            >
              &ldquo;{sq}&rdquo;
            </button>
          ))}
        </div>
      </div>

      {/* Interview Dialogue Stream */}
      <div className="space-y-4 min-h-[300px]">
        {messages.length === 0 ? (
          <div className="border-2 border-dashed border-stone-300 rounded-2xl p-8 sm:p-12 text-center bg-stone-50/50">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-4 border border-amber-300">
              <FileQuestion className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold font-newspaper-headline text-stone-800">
              Röportaja Henüz Başlanmadı
            </h3>
            <p className="text-sm text-stone-600 max-w-md mx-auto mt-1 font-sans-ui">
              Aşağıdaki soru kutusuna öğrencilerin merak ettiği bir soruyu yazın veya yukarıdaki hazır sorulardan birine tıklayın.
            </p>
          </div>
        ) : (
          messages.map((item, idx) => (
            <div key={item.id} className="space-y-3">
              {/* Student Question */}
              <div className="flex items-start justify-end space-x-3">
                <div className="bg-amber-900 text-amber-50 rounded-2xl rounded-tr-xs p-4 max-w-2xl shadow-sm border border-amber-950">
                  <div className="flex items-center justify-between text-xs text-amber-200 mb-1 font-sans-ui">
                    <span className="font-bold flex items-center gap-1">
                      <User className="w-3.5 h-3.5" />
                      Öğrenci / Öğretmen Sorusu (#{idx + 1})
                    </span>
                    <span>{item.timestamp}</span>
                  </div>
                  <p className="text-sm sm:text-base font-medium">{item.question}</p>
                </div>
              </div>

              {/* Reporter Answer */}
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-xl bg-amber-800 text-amber-100 flex items-center justify-center shrink-0 border border-amber-600 font-bold font-newspaper-headline shadow-xs mt-1">
                  TM
                </div>
                <div className="bg-white border-2 border-stone-300 rounded-2xl rounded-tl-xs p-4 sm:p-5 max-w-3xl shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-2 mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold uppercase tracking-wider font-newspaper-headline text-stone-900">
                        TARİH MUHABİRİ
                      </span>
                      <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded border border-stone-200">
                        Birincil Kaynak Doğrulaması
                      </span>
                    </div>
                    {item.citedDocuments && item.citedDocuments.length > 0 && (
                      <div className="flex items-center gap-1">
                        {item.citedDocuments.map((doc, dIdx) => (
                          <span
                            key={dIdx}
                            className="text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300"
                          >
                            {doc}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Body text with citation formatting */}
                  <div>{renderFormattedAnswer(item.answer)}</div>
                </div>
              </div>
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex items-center space-x-3 p-4 bg-white border border-stone-200 rounded-2xl max-w-lg shadow-xs animate-pulse">
            <div className="w-8 h-8 rounded-lg bg-amber-800 text-amber-100 flex items-center justify-center shrink-0">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
            <div>
              <p className="text-sm font-semibold text-stone-800 font-newspaper-headline">
                Muhabir belgeleri inceliyor...
              </p>
              <p className="text-xs text-stone-500 font-sans-ui">
                Sadece yüklenen tarihî metinler taranıyor, kaynaklar doğrulanıyor.
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs sm:text-sm text-red-700 flex items-center space-x-2">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Question Input Box */}
      <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-2xl border-2 border-stone-300 shadow-lg">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendQuestion(currentQuestion);
          }}
          className="flex items-center space-x-2 sm:space-x-3"
        >
          <input
            type="text"
            value={currentQuestion}
            onChange={(e) => setCurrentQuestion(e.target.value)}
            placeholder="Öğrencinin sorusunu yazın (örn: Amasya Genelgesi'nde ne denmiştir?)..."
            disabled={isLoading}
            className="flex-1 px-4 py-3 rounded-xl border border-stone-300 bg-stone-50 text-stone-900 text-sm sm:text-base focus:bg-white focus:border-amber-700 focus:ring-2 focus:ring-amber-700/20 focus:outline-hidden transition-all"
          />
          <button
            type="submit"
            disabled={!currentQuestion.trim() || isLoading}
            className={`px-5 py-3 rounded-xl font-bold text-sm flex items-center space-x-2 transition-all ${
              currentQuestion.trim() && !isLoading
                ? "bg-amber-800 hover:bg-amber-900 text-amber-50 cursor-pointer shadow-md"
                : "bg-stone-200 text-stone-400 cursor-not-allowed"
            }`}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span className="hidden sm:inline">Sor</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Transition to Broadcast Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-stone-200">
        <button
          onClick={onGoToDocuments}
          className="text-xs font-semibold text-stone-600 hover:text-stone-900 underline"
        >
          ← Belgeleri Düzenle veya Ekle
        </button>

        <button
          onClick={onProceedToBroadcast}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-800 hover:bg-amber-900 text-amber-50 font-bold text-sm sm:text-base flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transition-all"
        >
          <Radio className="w-4 h-4" />
          <span>3. Bölüm: Gazete ve Podcast Yayınını Hazırla</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
}
