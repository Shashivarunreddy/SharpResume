import "./globals.css";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { AuroraBackground } from "../components/ui/aurora-background";
import { Navbar } from "../components/Navbar";
import Footer from "../components/Footer";
// import { SessionWrapper } from "@/providers/SessionWrapper";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

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
