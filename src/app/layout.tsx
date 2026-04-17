import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Market Help — myPandora",
  description:
    "Ask questions about promotions, loyalty, translations, and content across Pandora repositories",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/pandora-crown.svg", type: "image/svg+xml" },
    ],
    apple: "/icon-192.png",
  },
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
