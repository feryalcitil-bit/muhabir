"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import DocumentsSection from "@/components/DocumentsSection";
import InterviewSection, { InterviewMessage } from "@/components/InterviewSection";
import BroadcastSection from "@/components/BroadcastSection";
import { NewspaperData } from "@/components/NewspaperView";
import { PodcastData } from "@/components/PodcastPlayer";
import { PRESET_DOCUMENTS, HistoryDocument } from "@/lib/presets";
import { BookOpen, Radio, Newspaper, Sparkles, Feather, HelpCircle, CheckCircle } from "lucide-react";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"documents" | "interview" | "broadcast">("documents");
  
  // Default documents loaded from preset (Amasya & Erzurum 1919)
  const [documents, setDocuments] = useState<HistoryDocument[]>(PRESET_DOCUMENTS[0].docs);
  
  // Interview conversation history
  const [messages, setMessages] = useState<InterviewMessage[]>([]);
  
  // Broadcast artifacts
  const [newspaperData, setNewspaperData] = useState<NewspaperData | null>(null);
  const [podcastData, setPodcastData] = useState<PodcastData | null>(null);

  const totalWords = documents.reduce(
    (acc, doc) => acc + (doc.content.trim() ? doc.content.trim().split(/\s+/).length : 0),
    0
  );

  return (
    <div className="min-h-screen bg-stone-100/90 text-stone-900 flex flex-col font-sans-ui selection:bg-amber-800 selection:text-amber-50">
      {/* Top Application Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        documentCount={documents.length}
        questionCount={messages.length}
        hasBroadcastReady={!!(newspaperData || podcastData)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        
        {/* Hero Section */}
        <section className="no-print bg-gradient-to-r from-stone-900 via-stone-900 to-amber-950 text-stone-100 rounded-3xl p-6 sm:p-8 border border-stone-800 shadow-md relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-900/60 text-amber-300 border border-amber-700/50 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Millî Mücadele Basını ve Birincil Tarihî Belgeler</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-newspaper-headline tracking-wide text-amber-100">
              Tarih Muhabiri ile Geçmişe Canlı Bağlantı
            </h2>

            <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-sans-ui">
              Öğretmenler için birincil tarihî kaynakları sınıfın merkezine taşıyan interaktif eğitim aracı. 
              Belgeleri yükleyin, öğrencilerin sorularını doğrudan kaynaklara dayanarak yanıtlayın, 
              ardından <strong>1919 tarihli gazete sayfası</strong> ve <strong>çift sesli radyo podcasti</strong> üretin.
            </p>

            {/* Step Progress Pill Bar */}
            <div className="pt-2 flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
              <button
                onClick={() => setActiveTab("documents")}
                className={`px-3 py-1.5 rounded-lg border transition-all flex items-center space-x-1.5 ${
                  activeTab === "documents"
                    ? "bg-amber-700 border-amber-600 text-white font-bold"
                    : "bg-stone-800/80 border-stone-700 text-stone-300 hover:text-white"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-300" />
                <span>1. Belgeler ({documents.length})</span>
              </button>

              <span className="text-stone-600">→</span>

              <button
                onClick={() => setActiveTab("interview")}
                className={`px-3 py-1.5 rounded-lg border transition-all flex items-center space-x-1.5 ${
                  activeTab === "interview"
                    ? "bg-amber-700 border-amber-600 text-white font-bold"
                    : "bg-stone-800/80 border-stone-700 text-stone-300 hover:text-white"
                }`}
              >
                <Feather className="w-3.5 h-3.5 text-amber-300" />
                <span>2. Röportaj ({messages.length} Soru)</span>
              </button>

              <span className="text-stone-600">→</span>

              <button
                onClick={() => setActiveTab("broadcast")}
                className={`px-3 py-1.5 rounded-lg border transition-all flex items-center space-x-1.5 ${
                  activeTab === "broadcast"
                    ? "bg-amber-700 border-amber-600 text-white font-bold"
                    : "bg-stone-800/80 border-stone-700 text-stone-300 hover:text-white"
                }`}
              >
                <Radio className="w-3.5 h-3.5 text-amber-300" />
                <span>3. Gazete & Podcast Yayını</span>
              </button>
            </div>
          </div>
        </section>

        {/* Section 1: Documents */}
        {activeTab === "documents" && (
          <DocumentsSection
            documents={documents}
            setDocuments={setDocuments}
            onProceedToInterview={() => setActiveTab("interview")}
          />
        )}

        {/* Section 2: Interview */}
        {activeTab === "interview" && (
          <InterviewSection
            documents={documents}
            messages={messages}
            setMessages={setMessages}
            onProceedToBroadcast={() => setActiveTab("broadcast")}
            onGoToDocuments={() => setActiveTab("documents")}
          />
        )}

        {/* Section 3: Broadcast (Newspaper + Podcast) */}
        {activeTab === "broadcast" && (
          <BroadcastSection
            documents={documents}
            interviewHistory={messages}
            newspaperData={newspaperData}
            setNewspaperData={setNewspaperData}
            podcastData={podcastData}
            setPodcastData={setPodcastData}
            onGoBackToInterview={() => setActiveTab("interview")}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="no-print bg-stone-900 border-t border-stone-800 text-stone-400 py-6 text-xs text-center font-sans-ui mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-amber-300 font-newspaper-headline text-sm">
              TARİH MUHABİRİ
            </span>
            <span>—</span>
            <span>Tarih Dersi İçin Birincil Belgelere Dayalı Yapay Zekâ Eğitimi</span>
          </div>

          <div className="flex items-center space-x-4 text-stone-400">
            <span>Model: Gemini Flash</span>
            <span>•</span>
            <span>1919 Gazetesi & Çift Sesli Podcast</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
