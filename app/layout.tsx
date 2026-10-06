import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Tarih Muhabiri - Belgelere Dayalı Tarih Öğrenimi',
  description: 'Tarih dersleri için birincil belgelere dayalı yapay zekâ muhabirliği, 1919 dönemi gazete sayfası ve çift sesli podcast stüdyosu.',
  openGraph: {
    title: 'Tarih Muhabiri - Belgelere Dayalı Tarih Öğrenimi',
    description: 'Tarih dersleri için birincil belgelere dayalı yapay zekâ muhabirliği, 1919 dönemi gazete sayfası ve çift sesli podcast stüdyosu.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tarih Muhabiri - Belgelere Dayalı Tarih Öğrenimi',
    description: 'Tarih dersleri için birincil belgelere dayalı yapay zekâ muhabirliği, 1919 dönemi gazete sayfası ve çift sesli podcast stüdyosu.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="tr">
      <body suppressHydrationWarning className="antialiased min-h-screen bg-stone-100 text-stone-900 selection:bg-amber-800 selection:text-amber-50">
        {children}
      </body>
    </html>
  );
}
