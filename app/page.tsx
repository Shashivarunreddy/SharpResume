"use client";

import { useState } from "react";

export default function Home() {
  const [results, setResults] = useState<any | null>(null);

  async function handleSubmit(formData: FormData) {
    const res = await fetch("/api/analyze", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setResults(data);
  }
  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center p-8">
      <h1 className="text-2xl font-bold mb-6">Resume Analyzer</h1>

      {/* --- Form --- */}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          await handleSubmit(fd);
        }}
        className="w-full max-w-xl space-y-4 border border-black rounded-xl p-6"
      >
        {/* Gemini API Key */}
        <div>
          <label className="block mb-1 font-medium">Gemini API Key</label>
          <input
            type="text"
            name="apiKey"
            className="w-full border border-black rounded-lg p-2 bg-white text-black"
            placeholder="Enter your Gemini API key"
            required
          />
        </div>

        {/* File Input */}
        <div>
          <label className="block mb-1 font-medium">Upload Resume</label>
          <input
            type="file"
            name="resume"
            accept=".pdf,.doc,.docx"
            className="w-full border border-black rounded-lg p-2 bg-white text-black"
            required
          />
        </div>

        {/* Job Description */}
        <div>
          <label className="block mb-1 font-medium">Job Description</label>
          <textarea
            name="jobDescription"
            rows={4}
            className="w-full border border-black rounded-lg p-2 bg-white text-black"
            placeholder="Paste the job description here..."
            required
          />
        </div>

        {/* Strict ATS Mode */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="strictATS"
            className="w-4 h-4 border border-black rounded"
          />
          <label className="text-sm font-medium">Strict ATS Mode</label>
        </div>

        {/* Target Role/Seniority */}
        <div>
          <label className="block mb-1 font-medium">
            Target Role/Seniority
          </label>
          <select
            name="role"
            className="w-full border border-black rounded-lg p-2 bg-white text-black"
            required
          >
            <option value="">Select role...</option>
            <option value="junior">Junior</option>
            <option value="mid">Mid-level</option>
            <option value="senior">Senior</option>
            <option value="lead">Lead</option>
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full border border-black rounded-lg p-2 font-semibold hover:bg-black hover:text-white transition"
        >
          Analyze Resume
        </button>
      </form>

      {/* --- Results Panel --- */}
      {results && (
        <div className="w-full max-w-2xl mt-8 border border-black rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-bold">Results</h2>

          <div>
            <h3 className="font-semibold">Summary of Suggested Edits</h3>
            <p className="text-sm">{results.summary}</p>
          </div>

          <div>
            <h3 className="font-semibold">Keyword Gaps</h3>
            <ul className="list-disc pl-5 text-sm">
              {results.keywordGaps?.map((kw: string, i: number) => (
                <li key={i}>{kw}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold">Recommended Bullet Replacements</h3>
            <ul className="list-disc pl-5 text-sm">
              {results.bulletReplacements?.map((b: string, i: number) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold">Suggested Title Tweaks</h3>
            <p className="text-sm">{results.titleTweaks}</p>
          </div>

          <button
            onClick={() => {
              const blob = new Blob([JSON.stringify(results, null, 2)], {
                type: "application/json",
              });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "resume-analysis.json";
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="border border-black rounded-lg px-4 py-2 text-sm font-semibold hover:bg-black hover:text-white transition"
          >
            Download JSON
          </button>
        </div>
      )}
    </div>
  );
}
