import "./globals.css";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Navbar } from "../components/Navbar";

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
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className="bg-white text-black antialiased">
          <Navbar /> {/* Move Clerk UI inside Navbar */}
          <main className="pt-16">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
