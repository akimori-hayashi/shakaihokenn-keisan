import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "社会保険料計算ツール | 2025年度対応",
  description:
    "月額給与・年齢・都道府県を入力するだけで健康保険料・介護保険料・厚生年金・雇用保険料を自動計算。2025年度（令和7年度）協会けんぽ料率対応。",
  keywords: ["社会保険料", "計算", "健康保険", "厚生年金", "雇用保険", "介護保険"],
  openGraph: {
    title: "社会保険料計算ツール | 2025年度対応",
    description:
      "月額給与・年齢・都道府県を入力するだけで健康保険料・介護保険料・厚生年金・雇用保険料を自動計算。",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="bg-gray-50 min-h-screen antialiased">{children}</body>
    </html>
  );
}
