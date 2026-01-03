import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "재료 다:씀 레시피 - 남은 재료 활용 레시피 추천",
    template: "%s | 재료 다:씀 레시피",
  },
  description:
    "냉장고에 남은 재료를 선택하면 재료를 최대한 활용할 수 있는 레시피를 추천해드립니다. 음식물 쓰레기를 줄이고 맛있는 요리를 만들어보세요!",
  keywords: ["레시피", "요리", "재료 활용", "음식물 쓰레기 줄이기", "한식"],
  authors: [{ name: "재료 다:씀" }],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "/",
    siteName: "재료 다:씀 레시피",
    title: "재료 다:씀 레시피 - 남은 재료 활용 레시피 추천",
    description:
      "냉장고에 남은 재료를 선택하면 재료를 최대한 활용할 수 있는 레시피를 추천해드립니다.",
  },
  twitter: {
    card: "summary_large_image",
    title: "재료 다:씀 레시피",
    description: "남은 재료를 활용한 레시피 추천 서비스",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${inter.className} antialiased min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
