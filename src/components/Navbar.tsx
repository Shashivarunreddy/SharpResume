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
          <Link href="/">Creo<span className="text-blue-600">Rez</span></Link>
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
            href="/ATS_Score"
            className={`hover:text-blue-600 transition ${
              pathname === "/ATS_Score" ? "font-semibold text-blue-600" : ""
            }`}
          >
            ATS Score
          </Link>
          <Link
            href="/latex_pdf"
            className={`hover:text-blue-600 transition ${
              pathname === "/latex_pdf" ? "font-semibold text-blue-600" : ""
            }`}
          >
            Latex/Pdf
          </Link>
          <Link
            href="/form"
            className={`hover:text-blue-600 transition ${
              pathname === "/form" ? "font-semibold text-blue-600" : ""
            }`}
          >
            form fill
          </Link>
          <Link
            href="/enhance_resume"
            className={`hover:text-blue-600 transition ${
              pathname === "/enhance_resume" ? "font-semibold text-blue-600" : ""
            }`}
          >
            Enhance resume
          </Link>
          <Link
            href="/my_resume"
            className={`hover:text-blue-600 transition ${
              pathname === "/my_resume" ? "font-semibold text-blue-600" : ""
            }`}
          >
            my resume
          </Link>
        </div>
      </div>
    </nav>
  );
};
