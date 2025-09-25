import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import "./globals.css";

// Pretendard Variable 폰트 (로컬 파일)
const pretendard = localFont({
  src: "../../public/fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

// Inter 폰트 (폴백용)
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Who's your papa - AI 얼굴 분석 서비스",
  description: "AI로 가족 얼굴 유사도를 분석하는 재미있는 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body 
        className={`${pretendard.variable} ${inter.variable} font-sans antialiased`}
      >
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
