import 'katex/dist/katex.min.css';
import './globals.css';
import { Inter, Outfit } from 'next/font/google';

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-outfit',
  weight: ['500', '600', '700'],
  display: 'swap',
});

export const metadata = {
  title: 'ManMath — Luyện đề Toán THPT Quốc gia',
  description:
    'Nền tảng luyện đề Toán THPT trực tuyến. Thi thử với giao diện tập trung, đồng hồ bấm giờ và xem lại kết quả chi tiết.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${inter.variable} ${outfit.variable}`}>
      <body className={`${inter.className} bg-background text-text-primary antialiased`}>
        {children}
      </body>
    </html>
  );
}
