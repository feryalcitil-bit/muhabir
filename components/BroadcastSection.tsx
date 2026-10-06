"use client";

import React, { useState } from "react";
import { HistoryDocument } from "@/lib/presets";
import { InterviewMessage } from "./InterviewSection";
import NewspaperView, { NewspaperData } from "./NewspaperView";
import PodcastPlayer, { PodcastData } from "./PodcastPlayer";
import {
  Newspaper,
  Radio,
  Sparkles,
  Loader2,
  AlertCircle,
  ArrowLeft,
  RefreshCw,
  Printer,
  Share2,
} from "lucide-react";

interface BroadcastSectionProps {
  documents: HistoryDocument[];
  interviewHistory: InterviewMessage[];
  newspaperData: NewspaperData | null;
  setNewspaperData: React.Dispatch<React.SetStateAction<NewspaperData | null>>;
  podcastData: PodcastData | null;
  setPodcastData: React.Dispatch<React.SetStateAction<PodcastData | null>>;
  onGoBackToInterview: () => void;
}

export default function BroadcastSection({
  documents,
  interviewHistory,
  newspaperData,
  setNewspaperData,
  podcastData,
  setPodcastData,
  onGoBackToInterview,
}: BroadcastSectionProps) {
  const [activeBroadcastTab, setActiveBroadcastTab] = useState<"newspaper" | "podcast">("newspaper");
  const [isGeneratingNewspaper, setIsGeneratingNewspaper] = useState(false);
  const [isGeneratingPodcast, setIsGeneratingPodcast] = useState(false);
  const [newspaperError, setNewspaperError] = useState<string | null>(null);
  const [podcastError, setPodcastError] = useState<string | null>(null);

  const combinedDocumentsText = documents
    .map((doc) => `${doc.label} ${doc.title}\n${doc.content}`)
    .join("\n\n---\n\n");

  const handleGenerateNewspaper = async () => {
    setIsGeneratingNewspaper(true);
    setNewspaperError(null);
    setActiveBroadcastTab("newspaper");

    try {
      const response = await fetch("/api/newspaper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documents: combinedDocumentsText,
          interviewHistory: interviewHistory.map((m) => ({
            question: m.question,
            answer: m.answer,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gazete sayfası üretilemedi.");
      }

      setNewspaperData(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gazete sayfası hazırlanırken bir hata oluştu.";
      setNewspaperError(msg);
    } finally {
      setIsGeneratingNewspaper(false);
    }
  };

  const handleGeneratePodcast = async () => {
    setIsGeneratingPodcast(true);
    setPodcastError(null);
    setActiveBroadcastTab("podcast");

    try {
      const response = await fetch("/api/podcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newspaper: newspaperData,
          documents: combinedDocumentsText,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Podcast hazırlanamadı.");
      }

      setPodcastData(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Podcast hazırlanırken bir hata oluştu.";
      setPodcastError(msg);
    } finally {
      setIsGeneratingPodcast(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Publishing Banner with the TWO PRIMARY BUTTONS */}
      <div className="no-print bg-stone-900 border border-stone-800 text-stone-100 rounded-2xl p-5 sm:p-7 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>3. BÖLÜM: YAYIN VE ETKİNLİK MERKEZİ</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-newspaper-headline text-stone-100">
              GAZETE SAYFASI VE PODCAST STÜDYOSU
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 mt-1 max-w-xl font-sans-ui">
              Röportajı ve tarihî belgeleri 1919 dönemi orijinal gazetesine dönüştürün veya Muhabir ile Tarihçi
              arasında 1 dakikalık çift sesli podcast yayını başlatın.
            </p>
          </div>

          {/* TWO PRIMARY BUTTONS: "Gazete Sayfası Yap" and "Podcast Yap" */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Gazete Sayfası Yap Button */}
            <button
              onClick={handleGenerateNewspaper}
              disabled={isGeneratingNewspaper || documents.length === 0}
              className={`px-5 py-3.5 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center space-x-2.5 transition-all shadow-md ${
                isGeneratingNewspaper
                  ? "bg-stone-700 text-stone-300 cursor-wait"
                  : "bg-amber-700 hover:bg-amber-600 active:scale-95 text-amber-50 cursor-pointer shadow-amber-900/30"
              }`}
            >
              {isGeneratingNewspaper ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Gazete Diziliyor...</span>
                </>
              ) : (
                <>
                  <Newspaper className="w-5 h-5 text-amber-200" />
                  <span>Gazete Sayfası Yap</span>
                </>
              )}
            </button>

            {/* Podcast Yap Button */}
            <button
              onClick={handleGeneratePodcast}
              disabled={isGeneratingPodcast || documents.length === 0}
              className={`px-5 py-3.5 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center space-x-2.5 transition-all shadow-md ${
                isGeneratingPodcast
                  ? "bg-stone-700 text-stone-300 cursor-wait"
                  : "bg-stone-800 hover:bg-stone-700 active:scale-95 text-stone-100 border border-stone-600 cursor-pointer"
              }`}
            >
              {isGeneratingPodcast ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-amber-400" />
                  <span>Podcast Seslendiriliyor...</span>
                </>
              ) : (
                <>
                  <Radio className="w-5 h-5 text-amber-400" />
                  <span>Podcast Yap</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* View Switcher Tabs (If at least one has been generated) */}
        {(newspaperData || podcastData) && (
          <div className="mt-6 pt-5 border-t border-stone-800 flex items-center space-x-2 overflow-x-auto">
            <span className="text-xs text-stone-400 font-sans-ui mr-2">Görünüm:</span>
            <button
              onClick={() => setActiveBroadcastTab("newspaper")}
              disabled={!newspaperData}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center space-x-2 transition-all ${
                activeBroadcastTab === "newspaper"
                  ? "bg-amber-700 text-white shadow-sm"
                  : newspaperData
                  ? "bg-stone-800 text-stone-300 hover:bg-stone-700"
                  : "bg-stone-800/40 text-stone-500 cursor-not-allowed"
              }`}
            >
              <Newspaper className="w-4 h-4" />
              <span>1919 Gazete Sayfası</span>
              {newspaperData && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
            </button>

            <button
              onClick={() => setActiveBroadcastTab("podcast")}
              disabled={!podcastData}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center space-x-2 transition-all ${
                activeBroadcastTab === "podcast"
                  ? "bg-amber-700 text-white shadow-sm"
                  : podcastData
                  ? "bg-stone-800 text-stone-300 hover:bg-stone-700"
                  : "bg-stone-800/40 text-stone-500 cursor-not-allowed"
              }`}
            >
              <Radio className="w-4 h-4" />
              <span>1 Dakikalık Podcast Stüdyosu</span>
              {podcastData && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
            </button>
          </div>
        )}
      </div>

      {/* Errors display */}
      {newspaperError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{newspaperError}</span>
        </div>
      )}

      {podcastError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{podcastError}</span>
        </div>
      )}

      {/* Main Content Area */}
      {isGeneratingNewspaper ? (
        <div className="bg-white border-2 border-stone-300 rounded-2xl p-12 text-center shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto border border-amber-300">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
          <h3 className="text-xl font-bold font-newspaper-headline text-stone-900">
            1919 Gazetesi Diziliyor...
          </h3>
          <p className="text-sm text-stone-600 max-w-md mx-auto font-sans-ui">
            Manşet belirleniyor, belgelerden birebir alıntılar süzülüyor ve öğrenciler için 3 pedagojik kontrol sorusu hazırlanıyor.
          </p>
        </div>
      ) : isGeneratingPodcast ? (
        <div className="bg-stone-900 text-stone-100 rounded-2xl p-12 text-center shadow-xl space-y-4 border border-stone-800">
          <div className="w-16 h-16 rounded-full bg-amber-800 text-amber-200 flex items-center justify-center mx-auto border border-amber-600">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
          <h3 className="text-xl font-bold font-newspaper-headline text-stone-100">
            Podcast Stüdyosu Kayda Başlıyor...
          </h3>
          <p className="text-sm text-stone-400 max-w-md mx-auto font-sans-ui">
            Muhabir ve Tarihçi arasında 1 dakikalık radyo diyaloğu yazılıyor ve Gemini TTS çift ses teknolojisiyle seslendiriliyor.
          </p>
        </div>
      ) : activeBroadcastTab === "newspaper" && newspaperData ? (
        <NewspaperView newspaper={newspaperData} />
      ) : activeBroadcastTab === "podcast" && podcastData ? (
        <PodcastPlayer podcast={podcastData} />
      ) : (
        /* Empty state when neither is generated yet */
        <div className="bg-white border-2 border-dashed border-stone-300 rounded-2xl p-10 sm:p-14 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto border border-amber-300">
            <Newspaper className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold font-newspaper-headline text-stone-800">
            Yayın Üretilmeye Hazır
          </h3>
          <p className="text-sm text-stone-600 max-w-md mx-auto font-sans-ui">
            Yukarıdaki <strong>&ldquo;Gazete Sayfası Yap&rdquo;</strong> düğmesine tıklayarak 1919 tarihli basılı gazeteyi oluşturabilir,
            ya da <strong>&ldquo;Podcast Yap&rdquo;</strong> düğmesine basarak sesli radyo yayını başlatabilirsiniz.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleGenerateNewspaper}
              className="px-6 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-amber-50 text-sm font-bold flex items-center space-x-2 shadow-sm transition-all"
            >
              <Newspaper className="w-4 h-4" />
              <span>Gazete Sayfası Yap</span>
            </button>
            <button
              onClick={handleGeneratePodcast}
              className="px-6 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-sm font-bold flex items-center space-x-2 shadow-sm transition-all"
            >
              <Radio className="w-4 h-4 text-amber-400" />
              <span>Podcast Yap</span>
            </button>
          </div>
        </div>
      )}

      {/* Back button */}
      <div className="no-print pt-4 border-t border-stone-200">
        <button
          onClick={onGoBackToInterview}
          className="text-xs font-semibold text-stone-600 hover:text-stone-900 flex items-center space-x-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>← 2. Bölüm Röportaja Dön</span>
        </button>
      </div>
    </div>
  );
}
