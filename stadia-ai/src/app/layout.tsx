import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StadiaAI — The AI Operating System for Smart Stadiums",
  description:
    "Next-generation AI platform for FIFA World Cup 2026. Real-time crowd intelligence, AI-powered operations, interactive stadium maps, and multilingual assistance.",
  keywords: [
    "FIFA World Cup 2026",
    "Smart Stadium",
    "AI Operations",
    "Crowd Management",
    "Stadium Intelligence",
  ],
  openGraph: {
    title: "StadiaAI — The AI Operating System for Smart Stadiums",
    description:
      "Next-generation AI platform for FIFA World Cup 2026. Real-time crowd intelligence, AI-powered operations, and stadium management.",
    type: "website",
    locale: "en_US",
  },
  robots: "index, follow",
};

export const viewport = {
  themeColor: "#09090B",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
