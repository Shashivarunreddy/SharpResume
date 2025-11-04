import "./globals.css";
import type { Metadata } from "next";
import { Navbar } from "../components/Navbar";
import { SessionWrapper } from "@/providers/SessionWrapper";


export const metadata: Metadata = {
  title: "CreoRez",
  description: "AI-powered LaTeX Resume Builder",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white text-black antialiased">
        <SessionWrapper>
          <Navbar />
          <main className="pt-16">{children}</main>
        </SessionWrapper>
      </body>
    </html>
  );
}
