import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EuroCalc",
  description: "Евро / лев калкулатор за плащания",
  manifest: "/manifest.webmanifest",
  themeColor: "#10b981",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bg">
      <head>
        {/* iOS / iPhone специфични неща */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="bg-slate-900">{children}</body>
    </html>
  );
}
