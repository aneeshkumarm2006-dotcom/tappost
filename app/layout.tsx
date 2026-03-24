import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "TapPost — AI Poster & Caption Agent for Bars",
  description:
    "Generate professional posters and platform-optimized captions for your bar's specials in under 2 minutes. No design skills required.",
  openGraph: {
    title: "TapPost — AI Poster & Caption Agent for Bars",
    description:
      "Generate professional posters and platform-optimized captions for your bar's specials in under 2 minutes.",
    url: "https://tappost.io",
    siteName: "TapPost",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TapPost — AI Poster & Caption Agent for Bars",
    description:
      "Generate professional posters and platform-optimized captions for your bar's specials in under 2 minutes.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased noise scanlines">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
