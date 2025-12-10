import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EuroCalc",
  description: "Евро / лев калкулатор за плащания",
  manifest: "/manifest.webmanifest",
  themeColor: "#10b981",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "EuroCalc",
  },
  // за всеки случай и за Android
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bg">
      <body className="bg-slate-900 min-h-screen">{children}</body>
    </html>
  );
}
