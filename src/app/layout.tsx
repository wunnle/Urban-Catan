import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Catan Turnuvası - Urban Roastery",
  description: "Urban Roastery Catan Turnuvasına kayıt olun - Moda, İstanbul",
  openGraph: {
    title: "Catan Turnuvası - Urban Roastery",
    description: "Urban Roastery Catan Turnuvasına kayıt olun - Moda, İstanbul",
    images: [
      {
        url: "/logo.jpg",
        width: 1024,
        height: 1024,
        alt: "Urban Roastery Logo",
      },
    ],
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Catan Turnuvası - Urban Roastery",
    description: "Urban Roastery Catan Turnuvasına kayıt olun - Moda, İstanbul",
    images: ["/logo.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${geistSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
