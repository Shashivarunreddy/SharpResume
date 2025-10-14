"use client";

import { Navbar } from "./components/Navbar";


export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center p-8 pt-24">
        <h1 className="text-4xl font-bold mb-6 text-gray-900">
          Welcome to <span className="text-blue-600">Resume Analyzer</span>
        </h1>
        <p className="text-lg mb-6 text-gray-700">
          Analyze and improve your resume with AI-powered insights.
        </p>

        {/* Components */}
        <div className="w-full max-w-4xl space-y-8">
        </div>
      </main>
    </div>
  );
}
