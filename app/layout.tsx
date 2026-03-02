import type { Metadata } from "next";
import { Geist, Geist_Mono,IBM_Plex_Serif,Mona_Sans } from "next/font/google";
import "./globals.css";

const ibmPlexSerif = IBM_Plex_Serif({
  subsets: ["latin"],
  variable: "--font-ibm-plex-serif",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});


const monaSans = Mona_Sans({
  subsets: ["latin"],
  variable: "--font-mona-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Learnly",
  description: "Transform your Docs into interactive learning experiences,upload PDFs,and chat with your content using voice",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${ibmPlexSerif.variable} ${monaSans.variable} relative font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
