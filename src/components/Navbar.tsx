"use client";

import Link from "next/link";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full h-16 flex items-center justify-between px-6 bg-white shadow-sm z-50">
      {/* Left Section - Logo */}
      <Link href="/" className="text-2xl font-bold text-[#6c47ff]">
        CreoRez
      </Link>

      {/* Middle Section - Nav Links */}
      <div className="flex items-center gap-6 text-gray-700 font-medium">
        <Link href="/">Home</Link>
        <Link href="/resume">Resume Builder</Link>
        <Link href="/dashboard">Dashboard</Link>
      </div>

      {/* Right Section - Auth Buttons */}
      <div className="flex items-center gap-4">
        <SignedOut>
          <SignInButton mode="modal">
            <button className="text-[#6c47ff] border border-[#6c47ff] rounded-full font-medium text-sm sm:text-base h-10 sm:h-11 px-4 sm:px-5 hover:bg-[#6c47ff]/10 transition">
              Sign In
            </button>
          </SignInButton>

          <SignUpButton mode="modal">
            <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-11 px-4 sm:px-5 hover:bg-[#5a3ae6] transition">
              Sign Up
            </button>
          </SignUpButton>
        </SignedOut>

        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
    </nav>
  );
}
