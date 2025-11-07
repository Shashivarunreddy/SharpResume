"use client";

import Link from "next/link";

import {
  SignInButton,
  // SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { ShimmerButton } from "./ui/shimmer-button";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full h-16 flex items-center justify-between px-6 bg-white shadow-sm z-50">
      {/* Left Section - Logo */}
      <Link href="/" className="text-4xl font-bold text-[#6c47ff]">
        CreoRez
      </Link>

      {/* Middle Section - Nav Links */}
      <div className="flex items-center gap-6 text-gray-700 font-medium">
        <Link href="/resume">Resume Builder</Link>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/ATS_Score">ATS Score</Link>
        <Link href="/latex_pdf">Latex/Pdf</Link>
        <Link href="/form">form fill</Link>
        <Link href="/enhance_resume">Enhance resume</Link>
        <Link href="/my_resume">my resume</Link>
      </div>

      {/* Right Section - Auth Buttons */}
      <div className="flex items-center gap-4">
        <SignedOut>
          <SignInButton mode="modal">
            <ShimmerButton className="shadow-2xl">
              <span className="text-center text-sm leading-none font-medium tracking-tight whitespace-pre-wrap text-white lg:text-lg dark:from-white dark:to-slate-900/10">
                Sign In
              </span>
            </ShimmerButton>
          </SignInButton>

          {/* <SignUpButton mode="modal">
            <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-11 px-4 sm:px-5 hover:bg-[#5a3ae6] transition">
              Sign Up
            </button>
          </SignUpButton> */}
        </SignedOut>

        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
}
