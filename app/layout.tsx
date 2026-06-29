import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "FixIt — See It. Snap It. Get It Fixed.",
  description:
    "AI-powered civic reporting that holds authorities accountable. Snap a photo, watch it get fixed. Report potholes, leaks, broken streetlights and more.",
  keywords: [
    "civic reporting",
    "pothole reporting",
    "smart city",
    "community issues",
    "AI classification",
    "infrastructure",
  ],
  openGraph: {
    title: "FixIt — AI-Powered Civic Intelligence Platform",
    description:
      "See it. Snap it. Get it fixed. AI-powered civic reporting that holds authorities accountable.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-navy text-text-primary font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
