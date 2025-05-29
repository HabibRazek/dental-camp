import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/session-provider";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Dental Camp | Premium Dental Supplies & Equipment",
    template: "%s | Dental Camp"
  },
  description: "Dental Camp is your trusted supplier of premium dental equipment, instruments, and materials. Shop ADA-approved products with fast shipping for dental professionals worldwide.",
  keywords: [
    "dental supplies",
    "dental equipment",
    "dentist tools",
    "dental instruments",
    "dental practice supplies",
    "ADA approved dental products",
    "dental clinic equipment",
    "wholesale dental supplies",
    "dental materials",
    "professional dental tools"
  ],
  metadataBase: new URL('https://www.dental-camp.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Dental Camp | Premium Dental Supplies & Equipment",
    description: "Your trusted supplier of premium dental equipment, instruments, and materials for dental professionals.",
    url: "https://www.dental-camp.com",
    siteName: "Dental Camp",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Dental Camp - Premium Dental Supplies",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: '595a1oRrNvw2eqKTf-3VnfdFoXwfFysMtPLoEqOLe3s',
  },
  manifest: '/site.webmanifest',
  authors: [
    {
      name: "Dental Camp Team",
      url: "https://www.dental-camp.com",
    },
  ],
  category: "dental supplies",
  publisher: "Dental Camp",
  applicationName: "Dental Camp",
  formatDetection: {
    email: false,
    address: false,
    telephone: true,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-192x192.png', type: 'image/png', sizes: '192x192' },
      { url: '/icon-512x512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#3b82f6" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          {children}
          <Toaster position="top-right" richColors />
        </Providers>
      </body>
    </html>
  );
}