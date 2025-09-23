import type { Metadata } from "next";
import { Montserrat, Roboto, Playfair_Display, Fredoka } from "next/font/google";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["400"],
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
        className={`${montserrat.variable} ${roboto.variable} ${playfair.variable} ${fredoka.variable} antialiased`}
      >
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
