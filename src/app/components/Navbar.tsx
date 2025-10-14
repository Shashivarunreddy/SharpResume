// src/components/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/60 backdrop-blur-md shadow-sm z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">
        {/* Left Section */}
        <div className="text-2xl font-bold tracking-tight">
          <Link href="/">Sharp<span className="text-blue-600">Resume</span></Link>
        </div>

        {/* Middle Section (Links) */}
        <div className="flex space-x-6 text-gray-700">
          <Link
            href="/"
            className={`hover:text-blue-600 transition ${
              pathname === "/" ? "font-semibold text-blue-600" : ""
            }`}
          >
            Home
          </Link>
          <Link
            href="/analyze"
            className={`hover:text-blue-600 transition ${
              pathname === "/analyze" ? "font-semibold text-blue-600" : ""
            }`}
          >
            Analyze
          </Link>
          <Link
            href="/latex_pdf"
            className={`hover:text-blue-600 transition ${
              pathname === "/latex_pdf" ? "font-semibold text-blue-600" : ""
            }`}
          >
            Latex/Pdf
          </Link>
        </div>
      </div>
    </nav>
  );
};
