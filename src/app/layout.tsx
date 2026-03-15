import "./globals.css";
import type { Metadata } from "next";


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
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className="bg-transparent text-black antialiased"
          style={{ minHeight: "100vh", overflowX: "hidden" }}
        >
          {/* Fixed Aurora background behind everything */}
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              zIndex: 0,
              pointerEvents: "none",
            }}
          >
            <AuroraBackground><></></AuroraBackground>
          </div>

          {/* Foreground content */}
          <div style={{ position: "relative", zIndex: 1, minHeight: "100vh" }}>
            <header className="flex justify-end items-center p-4 gap-4 h-16">
              <SignedOut>
                <SignInButton />
                <SignUpButton>
                  <button className="bg-[#6c47ff] text-ceramic-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                    Sign Up
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </header>
            <Navbar />
            <main className="pt-16">{children}</main>
            <Footer />
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
