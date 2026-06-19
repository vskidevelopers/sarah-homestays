// app/layout.tsx
import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "@/components/providers/ReactQueryProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "Sarah Homestay | A Home Away From Home",
  description: "Curated stays in Kilimani, Malindi & Nanyuki.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="font-sans antialiased bg-background text-foreground">
        <ReactQueryProvider>
          {children}
        </ReactQueryProvider>
      </body>
    </html>
  );
}