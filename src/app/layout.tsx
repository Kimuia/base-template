import { ToastProvider } from '@/shared/provider/ToastProvider';
import { createMetadata } from '@/shared/lib';
import { seoConfig } from '@/shared/lib';
import './globals.css';

/*
 * === Font 설정 (프로젝트에 맞게 선택) ===
 *
 * 옵션 A: Google Font
 * import { Inter } from 'next/font/google';
 * const font = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-sans' });
 *
 * 옵션 B: 로컬 폰트 (Pretendard 등 한글 폰트)
 * import localFont from 'next/font/local';
 * const font = localFont({
 *   src: './fonts/PretendardVariable.woff2',
 *   display: 'swap',
 *   variable: '--font-sans',
 * });
 *
 * 설정 후 아래 <html>에 className={font.variable} 추가
 */

export const metadata = createMetadata(seoConfig);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
