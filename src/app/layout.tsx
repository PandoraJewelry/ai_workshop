import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Market Help — Pandora",
  description:
    "Ask questions about promotions, loyalty, translations, and content across Pandora repositories",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
