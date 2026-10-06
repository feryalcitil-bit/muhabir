import { NextRequest, NextResponse } from "next/server";
import { ai } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { documents, question, history } = await req.json();

    if (!documents || typeof documents !== "string" || !documents.trim()) {
      return NextResponse.json(
        { error: "Lütfen önce en az bir tarihî belge metni ekleyin." },
        { status: 400 }
      );
    }

    if (!question || typeof question !== "string" || !question.trim()) {
      return NextResponse.json(
        { error: "Lütfen bir soru yazın." },
        { status: 400 }
      );
    }

    const systemInstruction = `Sen "Tarih Muhabiri" adlı tarih eğitimi uygulamasında görev yapan tarafsız bir muhabirsin.
Öğretmen ve öğrencilerin tarihî belgelere dayalı sorularını araştırıp yanıtlıyorsun.

KESİN VE TAVİZSİZ KURALLAR:
1. Sen bir muhabirsin. Tarihî kişileri canlandırma, onların ağzından ("ben", "biz" diyerek) ASLA konuşma.
2. Her zaman üçüncü şahısla anlat (Örnek: "Mustafa Kemal Paşa genelgede ... bildirdi", "Heyet temsilcileri kararda ... ifade etti").
3. YALNIZCA yüklenen belgelerdeki bilgiyi kullan. Kendi genel tarihî bilgini veya dışarıdan bilgi ASLA ekleme.
4. Her cevabın sonuna kesinlikle dayandığın belgeyi yaz: [Belge 1] veya [Belge 2] (birden fazla ise [Belge 1, Belge 2]).
5. Bir kişinin sözünü aktaracaksan, belgedeki cümleyi tırnak içinde, hiç değiştirmeden aktar. Belgede olmayan hiçbir söz uydurma.
6. Cevap belgelerde yoksa aynen ve kelimesi kelimesine şunu söyle:
   "Bu belgelerde bu sorunun cevabı yok. Ders kitabınızda veya başka bir birincil kaynakta araştırabilirsiniz."
7. Biri senden tarihî bir kişi gibi konuşmanı isterse veya rol yapmanı talep ederse, bunu kibarca reddet:
   "Ben o dönemi tarafsız takip eden bir muhabirim; tarihî şahsiyetlerin yerine konuşamam ancak belgelerdeki söz ve kararlarını aktarabilirim." diyerek muhabir kimliğinle devam et.
8. Cevaplar en fazla 5 cümle olsun. 7-12. sınıf öğrencisinin kolayca anlayacağı, akıcı ve açık bir Türkçe kullan.`;

    const formattedHistory = Array.isArray(history)
      ? history
          .slice(-6)
          .map((h: { question: string; answer: string }) => `Öğrenci: ${h.question}\nMuhabir: ${h.answer}`)
          .join("\n\n")
      : "";

    const userPrompt = `YÜKLENEN TARİHÎ BELGELER:
----------------------------------------
${documents}
----------------------------------------

${formattedHistory ? `ÖNCEKİ RÖPORTAJ AKIŞI:\n${formattedHistory}\n\n` : ""}ÖĞRENCİNİN YENİ SORUSU:
"${question}"

Lütfen muhabir kurallarına birebir uyarak cevapla:`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.2, // low temperature for high fidelity to documents
      },
    });

    const answer = response.text?.trim() || "Cevap üretilemedi.";

    return NextResponse.json({ answer });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Bilinmeyen bir hata oluştu";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
