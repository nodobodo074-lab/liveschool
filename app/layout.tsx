import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Live School GE",
  description: "Live School GE is an educational platform that connects students and teachers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <Link href="/" className="flex items-center">
                <Image
                  src="https://uuvezwvssnoeyybryemw.supabase.co/storage/v1/object/public/images/site%20logo/logo1_png.png"
                  alt="Live School GE Logo"
                  width={50}
                  height={50}
                  className="mr-2"
                />
                <span className="text-xl font-bold text-gray-900">Live School GE</span>
              </Link>
              <nav className="flex space-x-4">
                <Link href="/" className="text-gray-700 hover:text-gray-900">მთავარი</Link>
                <Link href="/news" className="text-gray-700 hover:text-gray-900">სიახლეები</Link>
                <Link href="/blog" className="text-gray-700 hover:text-gray-900">ბლოგი</Link>
                <Link href="/about" className="text-gray-700 hover:text-gray-900">ჩვენ შესახებ</Link>
                <Link href="/contact" className="text-gray-700 hover:text-gray-900">კონტაქტი</Link>
              </nav>
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="bg-gray-800 text-white py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p>&copy; 2026 Live School GE. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
