"use client";

import Link from "next/link";
import { useState } from "react";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { ShimmerButton } from "./ui/shimmer-button";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full h-16 flex items-center justify-between px-6 bg-white shadow-sm z-50">
      {/* Left Section - Logo */}
      <Link href="/" className="text-3xl sm:text-4xl font-bold text-[#6c47ff]">
        CreoRez
      </Link>

      {/* Desktop Nav Links (Visible on md+) */}
      <div className="hidden md:flex items-center gap-6 text-gray-700 font-medium">
        <Link href="/resume" className="hover:text-[#6c47ff] transition">
          Resume Builder
        </Link>
        <Link href="/ATS_Score" className="hover:text-[#6c47ff] transition">
          ATS Score
        </Link>
        <Link href="/latex_pdf" className="hover:text-[#6c47ff] transition">
          Latex/Pdf
        </Link>
        <Link href="/form" className="hover:text-[#6c47ff] transition">
          Form Fill
        </Link>
        <Link href="/enhance_resume" className="hover:text-[#6c47ff] transition">
          Enhance Resume
        </Link>
        <Link href="/my_resume" className="hover:text-[#6c47ff] transition">
          My Resume
        </Link>
      </div>

      {/* Right Section - Sign In / User + Hamburger */}
      <div className="flex items-center gap-3">
        {/* Clerk Auth */}
        <SignedOut>
          <SignInButton mode="modal">
            <ShimmerButton className="shadow-2xl">
              <span className="text-center text-sm leading-none font-medium tracking-tight whitespace-pre-wrap text-white lg:text-lg dark:from-white dark:to-slate-900/10">
                Sign In
              </span>
            </ShimmerButton>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>

        {/* Hamburger Menu Button (Mobile Only) */}
        <button
          className="md:hidden p-2 text-gray-700 hover:text-[#6c47ff] focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Slide-Out Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-[60] transform transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-[#6c47ff]">Menu</h2>
          <button
            className="text-gray-700 hover:text-[#6c47ff]"
            onClick={() => setMenuOpen(false)}
          >
            <X size={26} />
          </button>
        </div>

        {/* Links */}
        <div className="flex flex-col p-4 space-y-4 text-gray-700 font-medium">
          <Link
            href="/resume"
            onClick={() => setMenuOpen(false)}
            className="hover:text-[#6c47ff] transition"
          >
            Resume Builder
          </Link>
          <Link
            href="/ATS_Score"
            onClick={() => setMenuOpen(false)}
            className="hover:text-[#6c47ff] transition"
          >
            ATS Score
          </Link>
          <Link
            href="/latex_pdf"
            onClick={() => setMenuOpen(false)}
            className="hover:text-[#6c47ff] transition"
          >
            Latex/Pdf
          </Link>
          <Link
            href="/form"
            onClick={() => setMenuOpen(false)}
            className="hover:text-[#6c47ff] transition"
          >
            Form Fill
          </Link>
          <Link
            href="/enhance_resume"
            onClick={() => setMenuOpen(false)}
            className="hover:text-[#6c47ff] transition"
          >
            Enhance Resume
          </Link>
          <Link
            href="/my_resume"
            onClick={() => setMenuOpen(false)}
            className="hover:text-[#6c47ff] transition"
          >
            My Resume
          </Link>
        </div>
      </div>

      {/* Background Overlay when menu open */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[55]"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}
    </nav>
  );
}
