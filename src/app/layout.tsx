import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  variable: "--font-playfair",
  display: "swap",
});

// Use local Caveat font for better Vietnamese support
const caveat = localFont({
  src: "../../public/Fz-Caveat-Regular.ttf",
  variable: "--font-handwriting",
  display: "swap",
});

export const metadata: Metadata = {
  title: "YEARBOOK 12A19 | THANH XUÂN CỦA TÔI",
  description:
    "ĐÂY LÀ YEARBOOK CỦA MÌNH, NƠI LƯU GIỮ NHỮNG KỶ NIỆM ĐẸP ĐẼ CỦA LỚP 12A19 TRONG QUÁ TRÌNH HỌC TẬP VÀ PHÁT TRIỂN CÙNG NHAU. CHÚC CÁC BẠN LUÔN MẠNH KHỎE, HẠNH PHÚC VÀ THÀNH CÔNG TRONG CUỘC SỐNG!",
  keywords: ["kỷ yếu", "12A19", "tốt nghiệp", "memories", "yearbook", "Nguyễn Tài Phát"],
  openGraph: {
    title: "KÝ ỨC | A19 • 2023–2026",
    description: "ĐÂY LÀ YEARBOOK CỦA MÌNH",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} ${caveat.variable} antialiased`}
        style={{ fontFamily: "var(--font-inter), sans-serif" }}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
