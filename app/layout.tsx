import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SmoSpot — 近くの喫煙所を探す",
  description:
    "現在地周辺の喫煙所・喫煙可能な飲食店をGPSで検索。ユーザー投稿で最新の喫煙可否を確認できます。",
};

export const viewport: Viewport = {
  themeColor: "#2D6A4F",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
