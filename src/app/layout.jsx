import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NextAuthProvider from "./components/NextAuthProvider";
import SmoothScroll from "./components/SmoothScroll";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "AniStream - Streaming Anime Sub Indo Gratis",
  description: "Web Streaming Anime Sub Indo",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0b0c10]`} 
      >
        <NextAuthProvider>
          {/* Bungkus dengan SmoothScroll */}
          <SmoothScroll>
            {children}
          </SmoothScroll>
        </NextAuthProvider>
      </body>
    </html>
  );
}