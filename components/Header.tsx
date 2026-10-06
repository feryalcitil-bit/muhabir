"use client";

import React from "react";
import { Scroll, Newspaper, Radio, Sparkles, Feather } from "lucide-react";

interface HeaderProps {
  activeTab: "documents" | "interview" | "broadcast";
  setActiveTab: (tab: "documents" | "interview" | "broadcast") => void;
  documentCount: number;
  questionCount: number;
  hasBroadcastReady: boolean;
}

export default function Header({
  activeTab,
  setActiveTab,
  documentCount,
  questionCount,
  hasBroadcastReady,
}: HeaderProps) {
  return (
    <header className="no-print bg-stone-900 border-b border-stone-800 text-stone-100 sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 gap-3">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-amber-700/80 border border-amber-600/50 flex items-center justify-center text-amber-100 shadow-inner">
              <Feather className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-bold font-newspaper-headline tracking-wide text-amber-100">
                  TARİH MUHABİRİ
                </h1>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-amber-900/60 text-amber-300 border border-amber-700/50">
                  1919 Arşivi & Stüdyo
                </span>
              </div>
              <p className="text-xs text-stone-400 font-sans-ui">
                Birincil Belgelere Dayalı Eğitim, Basın ve Podcast Atölyesi
              </p>
            </div>
          </div>

          {/* 3 Steps Navigation */}
          <nav className="flex items-center space-x-1 sm:space-x-2 bg-stone-800/80 p-1 rounded-xl border border-stone-700/60 overflow-x-auto">
            <button
              onClick={() => setActiveTab("documents")}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === "documents"
                  ? "bg-amber-700 text-amber-50 shadow-sm font-semibold"
                  : "text-stone-300 hover:text-white hover:bg-stone-700/50"
              }`}
            >
              <Scroll className="w-4 h-4 text-amber-300" />
              <span>1. Belgeler</span>
              <span className="ml-1 text-[11px] px-1.5 py-0.2 rounded-full bg-stone-900/60 text-amber-200 border border-amber-700/40">
                {documentCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("interview")}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === "interview"
                  ? "bg-amber-700 text-amber-50 shadow-sm font-semibold"
                  : "text-stone-300 hover:text-white hover:bg-stone-700/50"
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>2. Röportaj</span>
              {questionCount > 0 && (
                <span className="ml-1 text-[11px] px-1.5 py-0.2 rounded-full bg-stone-900/60 text-amber-200 border border-amber-700/40">
                  {questionCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("broadcast")}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === "broadcast"
                  ? "bg-amber-700 text-amber-50 shadow-sm font-semibold"
                  : "text-stone-300 hover:text-white hover:bg-stone-700/50"
              }`}
            >
              <Radio className="w-4 h-4 text-amber-300" />
              <span>3. Yayın (Gazete & Podcast)</span>
              {hasBroadcastReady && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
              )}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
