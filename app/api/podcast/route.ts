import { NextRequest, NextResponse } from "next/server";
import { ai } from "@/lib/gemini";
import { Type } from "@google/genai";

interface DialogueTurn {
  speaker: "Muhabir" | "Tarihçi";
  text: string;
}

export async function POST(req: NextRequest) {
  try {
    const { newspaper, documents } = await req.json();

    if (!newspaper && !documents) {
      return NextResponse.json(
        { error: "Podcast oluşturmak için gazete haberi veya belgeler gereklidir." },
        { status: 400 }
      );
    }

    // Step 1: Script generation (~1 minute, approx 140-180 words, 6-8 dialogue turns)
    const scriptSystemInstruction = `Sen tarih dersi için podcast metni hazırlayan deneyimli bir radyo yapımcısısın.
Gazete haberini ve tarihî belgeleri 'Muhabir' ve 'Tarihçi' arasında tam 1 dakikalık dinamik ve öğretici bir radyo/podcast sohbetine çevireceksin.

KURALLAR:
1. Konuşmacılar: 'Muhabir' ve 'Tarihçi'.
2. Tarihçi de tarihî kişileri canlandırmaz, onların ağzından konuşmaz; onları üçüncü şahısla ve belgelere dayanarak anlatır.
3. Muhabir soru sorar, merak uyandırır, gazete manşetini aktarır.
4. Tarihçi belgedeki kararların ve sözlerin anlamına değinir ("Mustafa Kemal Paşa belgede açıkça ... demiştir").
5. Diyalog toplamda yaklaşık 1 dakika (140-180 kelime, 6-8 replik) uzunluğunda olmalıdır.
6. Konuşma dili doğal, akıcı Türkçe, 7-12. sınıf öğrencisine hitap eden netlikte olmalıdır.`;

    const scriptPrompt = `GAZETE HABERİ VE DETAYLAR:
Manşet: ${newspaper?.manset || "1919 Millî Mücadele Belgeleri"}
Spot: ${newspaper?.spot || ""}
Haber Metni: ${newspaper?.haberMetni || ""}
Alıntılar: ${JSON.stringify(newspaper?.alintilar || [])}

DAYANILAN BELGELER:
${documents || ""}

Lütfen bu içerikten 1 dakikalık 'Muhabir' ve 'Tarihçi' podcast diyaloğunu yapılandırılmış JSON olarak üret.`;

    const scriptResponse = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: scriptPrompt,
      config: {
        systemInstruction: scriptSystemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: "Podcast bölüm başlığı",
            },
            summary: {
              type: Type.STRING,
              description: "Kısa bölüm açıklaması",
            },
            turns: {
              type: Type.ARRAY,
              description: "Diyalog sıralı replikleri (en az 6 replik)",
              items: {
                type: Type.OBJECT,
                properties: {
                  speaker: {
                    type: Type.STRING,
                    description: "Muhabir veya Tarihçi",
                  },
                  text: {
                    type: Type.STRING,
                    description: "Konuşma metni",
                  },
                },
                required: ["speaker", "text"],
              },
            },
          },
          required: ["title", "summary", "turns"],
        },
      },
    });

    const parsedScript = JSON.parse(scriptResponse.text?.trim() || "{}");
    const turns: DialogueTurn[] = parsedScript.turns || [];

    // Step 2: Generate TTS audio using gemini-3.8-flash-tts
    let audioBase64: string | null = null;
    let ttsError: string | null = null;

    try {
      const parts = turns.map((turn) => {
        const isMuhabir = turn.speaker === "Muhabir";
        return {
          text: `${turn.speaker}: ${turn.text}`,
          speechMetadata: {
            speaker: turn.speaker,
            style: isMuhabir
              ? "Energetic, clear Turkish news reporter"
              : "Calm, thoughtful, authoritative Turkish history educator",
          },
        };
      });

      const ttsResponse = await ai.models.generateContent({
        model: "gemini-3.8-flash-tts",
        contents: [
          {
            role: "user",
            parts,
          },
        ],
        config: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            multiSpeakerVoiceConfig: {
              speakerVoiceConfigs: [
                {
                  speaker: "Muhabir",
                  voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: "Puck" },
                  },
                },
                {
                  speaker: "Tarihçi",
                  voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: "Kore" },
                  },
                },
              ],
            },
          },
        },
      });

      const partData = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (partData) {
        audioBase64 = partData;
      }
    } catch (ttsErr: unknown) {
      console.warn("TTS generation warning:", ttsErr);
      ttsError = ttsErr instanceof Error ? ttsErr.message : "TTS üretimi sırasında hata";
    }

    return NextResponse.json({
      title: parsedScript.title || "Tarih Muhabiri Özel Yayını",
      summary: parsedScript.summary || "Belgelerin ışığında 1919 atmosferi.",
      turns,
      audioBase64,
      ttsError,
      hasGeminiAudio: !!audioBase64,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Podcast hazırlanırken bir sorun oluştu.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
