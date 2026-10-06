"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Mic,
  BookOpen,
  Download,
  Copy,
  Check,
  Radio,
  Sparkles,
  Headphones,
} from "lucide-react";

export interface PodcastData {
  title: string;
  summary: string;
  turns: Array<{
    speaker: "Muhabir" | "Tarihçi";
    text: string;
  }>;
  audioBase64?: string | null;
  ttsError?: string | null;
  hasGeminiAudio?: boolean;
}

interface PodcastPlayerProps {
  podcast: PodcastData;
}

export default function PodcastPlayer({ podcast }: PodcastPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTurnIndex, setCurrentTurnIndex] = useState<number>(-1);
  const [useSpeechSynthesis, setUseSpeechSynthesis] = useState(!podcast.audioBase64);
  const [copied, setCopied] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0); // 0 to 100
  const [duration, setDuration] = useState(60); // approx 1 min
  const [currentTime, setCurrentTime] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const turnsRef = useRef(podcast.turns);

  useEffect(() => {
    turnsRef.current = podcast.turns;
  }, [podcast.turns]);

  // Audio blob url for Gemini TTS WAV
  const audioBlobUrl = useMemo(() => {
    if (!podcast.audioBase64) return null;
    try {
      const byteCharacters = atob(podcast.audioBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "audio/wav" });
      return URL.createObjectURL(blob);
    } catch (e) {
      console.error("Failed to decode audio base64:", e);
      return null;
    }
  }, [podcast.audioBase64]);

  useEffect(() => {
    return () => {
      if (audioBlobUrl) {
        URL.revokeObjectURL(audioBlobUrl);
      }
    };
  }, [audioBlobUrl]);

  // Setup Web Speech synthesis if available
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Web Speech playback logic (turn by turn)
  const speakTurnByIndex = (index: number) => {
    if (!synthRef.current || index >= turnsRef.current.length) {
      setIsPlaying(false);
      setCurrentTurnIndex(-1);
      return;
    }

    setCurrentTurnIndex(index);
    const turn = turnsRef.current[index];
    const utterance = new SpeechSynthesisUtterance(turn.text);
    utterance.lang = "tr-TR";

    // Set voice properties for distinction between Muhabir and Tarihçi
    if (turn.speaker === "Muhabir") {
      utterance.pitch = 1.15;
      utterance.rate = 1.05;
    } else {
      // Tarihçi
      utterance.pitch = 0.9;
      utterance.rate = 0.95;
    }

    // Try finding Turkish voices
    const voices = synthRef.current.getVoices();
    const turkishVoices = voices.filter((v) => v.lang.startsWith("tr"));
    if (turkishVoices.length > 0) {
      if (turn.speaker === "Muhabir" && turkishVoices.length > 1) {
        utterance.voice = turkishVoices[0];
      } else if (turkishVoices.length > 1) {
        utterance.voice = turkishVoices[1];
      } else {
        utterance.voice = turkishVoices[0];
      }
    }

    utterance.onend = () => {
      if (index + 1 < turnsRef.current.length) {
        speakTurnByIndex(index + 1);
      } else {
        setIsPlaying(false);
        setCurrentTurnIndex(-1);
      }
    };

    utterance.onerror = () => {
      setIsPlaying(false);
    };

    synthRef.current.speak(utterance);
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      // Pause
      if (audioBlobUrl && audioRef.current && !useSpeechSynthesis) {
        audioRef.current.pause();
      } else if (synthRef.current) {
        synthRef.current.cancel();
      }
      setIsPlaying(false);
    } else {
      // Play
      setIsPlaying(true);
      if (audioBlobUrl && audioRef.current && !useSpeechSynthesis) {
        audioRef.current.play().catch((err) => {
          console.warn("Audio play failed, falling back to Web Speech:", err);
          setUseSpeechSynthesis(true);
          speakTurnByIndex(0);
        });
      } else {
        speakTurnByIndex(currentTurnIndex >= 0 ? currentTurnIndex : 0);
      }
    }
  };

  const handleRestart = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
    setCurrentTurnIndex(-1);
    setCurrentTime(0);
    setAudioProgress(0);
    setIsPlaying(false);
  };

  const handleCopyTranscript = () => {
    const text = podcast.turns
      .map((t) => `${t.speaker}: ${t.text}`)
      .join("\n\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Sync turn highlight when using audio element
  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const cur = audioRef.current.currentTime;
    const dur = audioRef.current.duration || 60;
    setCurrentTime(cur);
    setAudioProgress((cur / dur) * 100);

    // Approximate which turn is active based on time fraction
    const fraction = cur / dur;
    const estimatedIndex = Math.min(
      Math.floor(fraction * podcast.turns.length),
      podcast.turns.length - 1
    );
    setCurrentTurnIndex(estimatedIndex);
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setCurrentTurnIndex(-1);
    setAudioProgress(0);
    setCurrentTime(0);
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="space-y-6">
      {/* Hidden audio element for Gemini TTS wav */}
      {audioBlobUrl && (
        <audio
          ref={audioRef}
          src={audioBlobUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={(e) => {
            const d = (e.target as HTMLAudioElement).duration;
            if (d && !isNaN(d)) setDuration(d);
          }}
          onEnded={handleAudioEnded}
        />
      )}

      {/* Podcast Studio Banner & Player Card */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-900 to-amber-950 text-stone-100 rounded-2xl p-6 sm:p-8 shadow-2xl border border-stone-800">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800/80 pb-5">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-600/30 border border-amber-500/40 flex items-center justify-center text-amber-300 shadow-inner">
              <Headphones className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  1 Dakikalık Özel Yayın
                </span>
                <span className="text-xs text-stone-400">
                  {podcast.hasGeminiAudio ? "🎙️ Gemini Çift Sesli TTS" : "🔊 Türkçe Seslendirme"}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-newspaper-headline text-stone-100 mt-1">
                {podcast.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyTranscript}
              className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium flex items-center space-x-1.5 border border-stone-700 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Kopyalandı!" : "Metni Kopyala"}</span>
            </button>

            {audioBlobUrl && (
              <a
                href={audioBlobUrl}
                download="tarih-muhabiri-podcast.wav"
                className="px-3 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-600 text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>WAV İndir</span>
              </a>
            )}
          </div>
        </div>

        {/* Summary */}
        <p className="text-sm text-stone-300 mt-4 leading-relaxed font-sans-ui max-w-3xl">
          {podcast.summary}
        </p>

        {/* Waveform / Visualizer */}
        <div className="my-6 p-4 bg-stone-950/60 rounded-xl border border-stone-800/80 flex items-center justify-center space-x-1 sm:space-x-1.5 h-16">
          {Array.from({ length: 32 }).map((_, i) => {
            const isBarActive = isPlaying;
            // Pseudo wave heights
            const baseH = [12, 24, 18, 36, 44, 28, 48, 20, 32, 40, 16, 28, 46, 32, 22, 38][i % 16];
            return (
              <div
                key={i}
                className={`w-1 sm:w-1.5 rounded-full transition-all duration-200 ${
                  isBarActive
                    ? "bg-gradient-to-t from-amber-600 to-amber-300 animate-pulse"
                    : "bg-stone-700 h-2"
                }`}
                style={{
                  height: isBarActive ? `${Math.max(8, baseH * ((i % 3) + 1) * 0.4)}px` : "6px",
                  animationDelay: `${(i % 8) * 100}ms`,
                }}
              />
            );
          })}
        </div>

        {/* Player Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          {/* Main Controls */}
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePlayPause}
              className="w-12 h-12 rounded-full bg-amber-600 hover:bg-amber-500 text-stone-950 flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95"
              title={isPlaying ? "Durdur" : "Oynat"}
            >
              {isPlaying ? <Pause className="w-6 h-6 fill-stone-950" /> : <Play className="w-6 h-6 fill-stone-950 ml-0.5" />}
            </button>

            <button
              onClick={handleRestart}
              className="w-9 h-9 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center transition-colors"
              title="Başa Sar"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <div className="text-xs font-mono text-stone-400">
              <span>{formatSeconds(currentTime)}</span> / <span>{formatSeconds(duration)}</span>
            </div>
          </div>

          {/* Speakers Indicators */}
          <div className="flex items-center space-x-3 text-xs font-sans-ui">
            <div
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full border transition-all ${
                currentTurnIndex >= 0 && podcast.turns[currentTurnIndex]?.speaker === "Muhabir"
                  ? "bg-amber-700/50 border-amber-500 text-amber-200 font-bold scale-105"
                  : "bg-stone-800/60 border-stone-700 text-stone-400"
              }`}
            >
              <Mic className="w-3.5 h-3.5 text-amber-400" />
              <span>Muhabir (Havadis)</span>
            </div>

            <div
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full border transition-all ${
                currentTurnIndex >= 0 && podcast.turns[currentTurnIndex]?.speaker === "Tarihçi"
                  ? "bg-emerald-900/50 border-emerald-500 text-emerald-200 font-bold scale-105"
                  : "bg-stone-800/60 border-stone-700 text-stone-400"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span>Tarihçi (Belge Yorumu)</span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 w-full bg-stone-800 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-amber-500 h-full transition-all duration-200"
            style={{ width: `${Math.min(100, Math.max(0, audioProgress))}%` }}
          />
        </div>
      </div>

      {/* Synchronized Script Transcript */}
      <div className="bg-white border-2 border-stone-300 rounded-2xl p-5 sm:p-7 shadow-sm">
        <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-5">
          <div className="flex items-center space-x-2">
            <Radio className="w-5 h-5 text-amber-800" />
            <h3 className="font-bold font-newspaper-headline text-base sm:text-lg text-stone-900">
              PODCAST DİYALOG METNİ VE YAYIN AKIŞI
            </h3>
          </div>
          <span className="text-xs text-stone-500 font-sans-ui">
            Toplam {podcast.turns.length} Replik (~1 Dakika)
          </span>
        </div>

        <div className="space-y-4">
          {podcast.turns.map((turn, tIdx) => {
            const isMuhabir = turn.speaker === "Muhabir";
            const isActive = currentTurnIndex === tIdx;

            return (
              <div
                key={tIdx}
                className={`p-4 rounded-xl border-2 transition-all ${
                  isActive
                    ? isMuhabir
                      ? "bg-amber-50 border-amber-600 shadow-md scale-[1.01]"
                      : "bg-emerald-50 border-emerald-600 shadow-md scale-[1.01]"
                    : "bg-stone-50/70 border-stone-200/80 hover:bg-stone-50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                        isMuhabir
                          ? "bg-amber-800 text-amber-100"
                          : "bg-emerald-800 text-emerald-100"
                      }`}
                    >
                      {isMuhabir ? <Mic className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
                    </span>
                    <span
                      className={`font-bold font-newspaper-headline text-sm uppercase tracking-wide ${
                        isMuhabir ? "text-amber-950" : "text-emerald-950"
                      }`}
                    >
                      {turn.speaker}
                    </span>
                    <span className="text-[11px] text-stone-500 font-sans-ui">
                      {isMuhabir ? "(Sorular & Manşet)" : "(Belgelere Dayalı Açıklama)"}
                    </span>
                  </div>

                  {isActive && (
                    <span className="text-[11px] font-bold text-amber-800 animate-pulse flex items-center gap-1 font-sans-ui">
                      <span className="w-2 h-2 rounded-full bg-amber-600" />
                      Konuşuyor
                    </span>
                  )}
                </div>

                <p className="text-stone-800 font-newspaper-body text-base leading-relaxed pl-9">
                  {turn.text}
                </p>
              </div>
            );
          })}
        </div>

        {/* Pedagogical Note */}
        <div className="mt-6 pt-4 border-t border-stone-200 text-xs text-stone-600 font-sans-ui flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            <strong>Pedagojik Not:</strong> Tarihçi karakteri tarihî kişileri canlandırmaz; Mustafa Kemal Paşa ve diğer tarihî aktörlerin söz ve kararlarını üçüncü şahısla ve belgelere dayanarak aktarır.
          </span>
        </div>
      </div>
    </div>
  );
}
