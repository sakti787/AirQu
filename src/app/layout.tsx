import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AirQu - Dashboard Kualitas Udara",
  description: "Dashboard monitoring kualitas udara real-time",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50`}
      >
  <div className="min-h-screen flex flex-col">

          {/* Main Content */}
          <main className="flex-1 flex justify-center items-stretch font-sans text-slate-800">
            <div className="max-w-7xl w-full mx-auto p-4 md:p-8">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
