import "./globals.css";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { AuroraBackground } from "../components/ui/aurora-background";
import { Navbar } from "../components/Navbar";
import Footer from "../components/Footer";

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
            <AuroraBackground children />
          </div>

          {/* Foreground content */}
          <div style={{ position: "relative", zIndex: 1, minHeight: "100vh" }}>
            <Navbar />
            <main className="pt-16">{children}</main>
            <Footer />
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
