// src/app/layout.tsx
import { Navbar } from "./components/Navbar";
import "./globals.css";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "SharpResume",
  description: "AI-powered LaTeX Resume Builder",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Keep styling consistent for SSR + Client */}
      <body className="bg-white text-black antialiased">
          {/* ✅ Fixed Navbar visible on all pages */}
          <Navbar />
          <main className="pt-16">{children}</main> {/* padding for fixed navbar */}
      </body>
    </html>
  );
}
