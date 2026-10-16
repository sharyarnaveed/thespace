import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono, Inter, Silkscreen } from "next/font/google";
import { BRAND } from "@/components/landing/brand";
import "./globals.css";

const display = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Variable font with a width axis: condensed for the hero, normal for body.
const sans = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const pixel = Silkscreen({
  variable: "--font-silkscreen",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: `${BRAND.name} — Your team, together`,
  description:
    "A cozy pixel-art virtual office for remote teams. Walk over to a teammate, share a coffee break, and make remote work feel a little less lonely.",
};

export const viewport: Viewport = {
  themeColor: "#F5F1E8",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable} ${pixel.variable} antialiased`}
    >
      <body className="min-h-full bg-paper font-sans text-ink">{children}</body>
    </html>
  );
}
