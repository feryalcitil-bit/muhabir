import { NextRequest, NextResponse } from "next/server";
import { ai } from "@/lib/gemini";
import { Type } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const { documents, interviewHistory } = await req.json();

    if (!documents || typeof documents !== "string" || !documents.trim()) {
      return NextResponse.json(
        { error: "Gazete sayfası üretmek için önce belgeleri girin." },
        { status: 400 }
      );
    }

    const systemInstruction = `Sen 1919 yılı Millî Mücadele dönemi gazetesinin (İrade-i Milliye / Hâkimiyet-i Milliye üslubunda) kıdemli başyazar ve muhabirisin.
Sana verilen tarihî belgeleri ve yapılan röportajı temel alarak tarihi aydınlatan bir gazete haberi ve sayfası hazırlayacaksın.

KURALLAR:
1. "manset": Dönemin ruhuna uygun, çarpıcı, büyük gazete manşeti (örn. "MİLLETİN İSTİKLÂLİNİ YİNE MİLLETİN AZİM VE KARARI KURTARACAKTIR!").
2. "spot": Haberi özetleyen 1-2 cümlelik çarpıcı üst/alt spot.
3. "haberMetni": 3-4 paragraflık, dönemin atmosferini yansıtan, üçüncü şahıs gazeteci diliyle yazılmış, tamamen belgelere dayalı haber metni.
4. "alintilar": Belgelerden aynen, kelimesi değiştirilmeden alınmış en az 2-3 adet doğrudan alıntı. Her biri { "metin": "birebir alıntı", "belge": "Belge 1 veya Belge 2" } olmalıdır. ASLA belgede olmayan söz uydurma.
5. "kontrolSorulari": 7-12. sınıf öğrencilerinin haberi ve belgeleri okuduktan sonra yanıtlayabileceği tam 3 adet pedagojik kontrol sorusu. Her biri { "soru": "...", "ipucu": "..." } içermelidir.
6. Tarihî kişileri canlandırma; onları üçüncü şahısla anlat. Dışarıdan bilgi ekleme, yalnızca verilen belgeler ve yapılan röportaja sadık kal.`;

    const interviewContext = Array.isArray(interviewHistory) && interviewHistory.length > 0
      ? interviewHistory
          .map((item: { question: string; answer: string }, idx: number) => `Soru ${idx + 1}: ${item.question}\nCevap ${idx + 1}: ${item.answer}`)
          .join("\n\n")
      : "Henüz soru sorulmadı, doğrudan belgeleri analiz et.";

    const prompt = `YÜKLENEN TARİHÎ BELGELER:
----------------------------------------
${documents}
----------------------------------------

RÖPORTAJ SORU VE CEVAPLARI:
----------------------------------------
${interviewContext}
----------------------------------------

Lütfen yukarıdaki belgelere ve röportaja dayanarak 1919 dönemi gazete sayfasını oluştur.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            manset: {
              type: Type.STRING,
              description: "1919 dönemi gazetesinin büyük manşeti",
            },
            spot: {
              type: Type.STRING,
              description: "Haberin spotu veya alt başlığı",
            },
            haberMetni: {
              type: Type.STRING,
              description: "3-4 paragraflık detaylı haber metni",
            },
            alintilar: {
              type: Type.ARRAY,
              description: "Belgelerden birebir tırnak içi alıntılar listesi",
              items: {
                type: Type.OBJECT,
                properties: {
                  metin: {
                    type: Type.STRING,
                    description: "Belgeden birebir alınmış alıntı",
                  },
                  belge: {
                    type: Type.STRING,
                    description: "Alıntının alındığı belge (örn. Belge 1)",
                  },
                },
                required: ["metin", "belge"],
              },
            },
            kontrolSorulari: {
              type: Type.ARRAY,
              description: "Öğrenciler için tam 3 adet anlama ve kontrol sorusu",
              items: {
                type: Type.OBJECT,
                properties: {
                  soru: {
                    type: Type.STRING,
                    description: "Kontrol sorusu",
                  },
                  ipucu: {
                    type: Type.STRING,
                    description: "Belgeye dayalı cevap ipucu veya dayanağı",
                  },
                },
                required: ["soru", "ipucu"],
              },
            },
          },
          required: ["manset", "spot", "haberMetni", "alintilar", "kontrolSorulari"],
        },
      },
    });

    const jsonText = response.text?.trim() || "{}";
    const parsedData = JSON.parse(jsonText);

    return NextResponse.json(parsedData);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gazete sayfası oluşturulurken hata meydana geldi.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
