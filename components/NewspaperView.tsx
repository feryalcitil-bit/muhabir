"use client";

import React, { useState } from "react";
import { Printer, Download, Eye, EyeOff, HelpCircle, Check, Quote, Share2, Sparkles } from "lucide-react";

export interface NewspaperData {
  manset: string;
  spot: string;
  haberMetni: string;
  alintilar: Array<{
    metin: string;
    belge: string;
  }>;
  kontrolSorulari: Array<{
    soru: string;
    ipucu: string;
  }>;
}

interface NewspaperViewProps {
  newspaper: NewspaperData;
}

export default function NewspaperView({ newspaper }: NewspaperViewProps) {
  const [revealedHints, setRevealedHints] = useState<Record<number, boolean>>({});

  const toggleHint = (idx: number) => {
    setRevealedHints((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  // Split haberMetni into paragraphs for multi-column layout
  const paragraphs = newspaper.haberMetni.split("\n\n").filter(Boolean);

  return (
    <div className="space-y-4">
      {/* Top Action Bar */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3 bg-stone-100 p-3 rounded-xl border border-stone-300">
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-amber-700" />
          <span className="text-xs sm:text-sm font-bold text-stone-800 font-newspaper-headline">
            1919 DÖNEMİ BASKI SAYFASI (ÖĞRENCİ VE SINIF ÇALIŞMASI)
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-lg bg-stone-900 hover:bg-black text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-all"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>Sayfayı Yazdır / PDF</span>
          </button>
        </div>
      </div>

      {/* The 1919 Period Newspaper Page */}
      <div className="print-newspaper-card bg-newspaper-paper text-stone-900 rounded-xl p-6 sm:p-10 shadow-2xl border-4 border-double border-stone-800 transition-all font-newspaper-body">
        
        {/* Newspaper Masthead / Header */}
        <div className="text-center border-b-4 border-double border-stone-800 pb-4 mb-6">
          {/* Top Vintage Meta Line */}
          <div className="flex items-center justify-between text-[11px] sm:text-xs font-sans-ui text-stone-700 uppercase tracking-widest border-b border-stone-800/40 pb-1 mb-3">
            <span>Sene: 1 (1335 / 1919)</span>
            <span className="font-semibold text-stone-900 hidden sm:inline">«HÂKİMİYET-İ MİLLİYE VE İSTİKLÂL MEFKÛRESİ»</span>
            <span>Nüsha: 142 — Fiyatı: 5 Kuruş</span>
          </div>

          {/* Main Title Banner */}
          <div className="py-2">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black font-newspaper-headline tracking-widest text-stone-950 uppercase">
              TARİH MUHABİRİ
            </h1>
            <p className="text-xs sm:text-sm tracking-wider uppercase text-stone-700 font-newspaper-headline mt-1 italic">
              — Anadolu ve Rumeli Vilayetleri Millî Havadis ve Resmî Vesikalar Gazetesi —
            </p>
          </div>

          {/* Slogan & Motto Line */}
          <div className="flex items-center justify-center space-x-4 border-t border-b border-stone-800/40 py-1.5 mt-2 text-xs sm:text-sm font-semibold tracking-wide">
            <span>★ VATANIN BÜTÜNLÜĞÜ VE MİLLETİN İSTİKLÂLİ İÇİN BİRİNCİL BELGELER ★</span>
          </div>
        </div>

        {/* Big Headline (Manşet) */}
        <div className="text-center my-6 pb-6 border-b-2 border-stone-800">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black font-newspaper-headline leading-tight text-stone-950 uppercase tracking-tight">
            {newspaper.manset}
          </h2>
          {newspaper.spot && (
            <p className="mt-3 text-base sm:text-xl font-bold italic text-stone-800 max-w-4xl mx-auto leading-snug">
              {newspaper.spot}
            </p>
          )}
        </div>

        {/* Newspaper Grid Layout: 2 Columns + Quotes Column */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-6">
          {/* Main Article Body (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-stone-600 border-b border-stone-400 pb-1 font-sans-ui flex items-center justify-between">
              <span>ÖZEL MUHABİR BİLDİRİYOR</span>
              <span>1919 ANADOLU KARARGÂHI</span>
            </div>

            {/* Drop cap first letter */}
            <div className="columns-1 md:columns-2 gap-6 text-stone-900 text-base leading-relaxed text-justify">
              {paragraphs.map((para, i) => (
                <p key={i} className="mb-4 indent-4">
                  {i === 0 ? (
                    <>
                      <span className="float-left text-5xl leading-none font-newspaper-headline font-bold pr-2 pt-1 text-stone-950">
                        {para.charAt(0)}
                      </span>
                      {para.slice(1)}
                    </>
                  ) : (
                    para
                  )}
                </p>
              ))}
            </div>
          </div>

          {/* Quotes Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="border-2 border-stone-800 p-4 bg-amber-50/50 shadow-inner">
              <div className="flex items-center space-x-2 border-b border-stone-800 pb-2 mb-3">
                <Quote className="w-5 h-5 text-amber-900 shrink-0" />
                <h3 className="font-bold font-newspaper-headline text-sm uppercase tracking-wider text-stone-900">
                  VESİKALARDAN BİREBİR ALINTILAR
                </h3>
              </div>

              <div className="space-y-4">
                {newspaper.alintilar.map((alinti, aIdx) => (
                  <div
                    key={aIdx}
                    className="p-3 bg-white/80 border-l-4 border-amber-900 shadow-2xs space-y-1.5"
                  >
                    <p className="italic text-sm text-stone-900 font-serif leading-relaxed">
                      &ldquo;{alinti.metin}&rdquo;
                    </p>
                    <div className="text-right">
                      <span className="inline-block text-[11px] font-bold uppercase bg-stone-200 text-stone-800 px-2 py-0.5 rounded font-sans-ui border border-stone-300">
                        {alinti.belge}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3 pt-2 border-t border-dashed border-stone-400 text-[11px] text-stone-600 font-sans-ui italic">
                * Bu alıntılar tarihî belgelerden aynen alınmış olup kelimesi değiştirilmemiştir.
              </div>
            </div>

            {/* Newspaper Seal / Emblem Box */}
            <div className="border border-stone-800/40 p-3 text-center bg-stone-100/50 text-xs font-sans-ui">
              <span className="block font-newspaper-headline font-bold text-stone-800 mb-1">
                MATBAA VE BASIM İZNİ
              </span>
              <p className="text-[11px] text-stone-600">
                Millî irade ve mefkûre gereğince bütün sancak ve kazalarda talebeler ve muallimler için tabedilmiştir.
              </p>
            </div>
          </div>
        </div>

        {/* Section: Öğrenci Kontrol Soruları (3 Soru) */}
        <div className="mt-8 pt-6 border-t-4 border-double border-stone-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs font-bold">
                ?
              </div>
              <h3 className="text-lg sm:text-xl font-bold font-newspaper-headline uppercase tracking-wide text-stone-900">
                DERS KONTROL VE DEĞERLENDİRME SORULARI (3 SORU)
              </h3>
            </div>
            <span className="text-xs font-sans-ui text-stone-600 hidden sm:inline">
              7-12. Sınıf Belge İnceleme Etkinliği
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {newspaper.kontrolSorulari.map((item, qIdx) => {
              const isRevealed = !!revealedHints[qIdx];
              return (
                <div
                  key={qIdx}
                  className="bg-white/90 border-2 border-stone-400 p-4 rounded-lg flex flex-col justify-between shadow-2xs"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider font-newspaper-headline bg-stone-800 text-stone-100 px-2 py-0.5 rounded">
                        Soru {qIdx + 1}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-stone-900 leading-snug mb-3">
                      {item.soru}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-dashed border-stone-300">
                    <button
                      onClick={() => toggleHint(qIdx)}
                      className="no-print text-xs font-bold text-amber-900 hover:text-amber-700 flex items-center space-x-1 font-sans-ui transition-colors mb-2"
                    >
                      {isRevealed ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>İpucunu / Belgeyi Gizle</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>Cevap İpucunu Göster</span>
                        </>
                      )}
                    </button>

                    {isRevealed && (
                      <div className="p-2.5 bg-amber-50 rounded border border-amber-300 text-xs text-stone-800 font-sans-ui animate-fadeIn leading-relaxed">
                        <strong className="text-amber-950 block mb-0.5">Belge Dayanağı:</strong>
                        {item.ipucu}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Newspaper Footer */}
        <div className="mt-8 pt-3 border-t border-stone-800 text-center text-[11px] font-sans-ui text-stone-600 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Tarih Muhabiri Eğitsel Yayın Atölyesi — Millî Mücadele Basını Arşivi</span>
          <span>© 1919 / 2026 Belgeye Dayalı Tarih Öğrenimi</span>
        </div>
      </div>
    </div>
  );
}
