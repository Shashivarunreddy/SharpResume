"use client";

import { useState } from "react";
type ModelJSON = {
    summaryRewrite: string;
    skillsToAdd?: string[];
    bullets?: { section?: string; original?: string; suggested: string }[];
    projectideas?: string[];
    notes?: string[];
  };

      type AnalysisResult = {
      summary: string;
      Suggestions: string[];
      projects: string[];
      bulletReplacements: string[];
      toAdd: string[];
      raw: string;
      json: ModelJSON | null;
    };
export default function Basic() {

 
 const [results, setResults] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    try {
      setIsLoading(true); // start spinner
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setResults(data);
    } finally {
      setIsLoading(false); // stop spinner
    }
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
          disabled={isLoading}
        >
          {isLoading ? "Analyzing…" : "Analyze Resume"}
        </button>
      </form>

      {/* --- Spinner (below form) --- */}
      {isLoading && (
        <div className="w-full max-w-xl mt-4 border border-black rounded-xl p-4 flex items-center justify-center">
          {/* Tailwind SVG spinner */}
          <svg
            className="animate-spin h-6 w-6 text-black"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          <span className="ml-3 text-sm">Processing your resume…</span>
        </div>
      )}

      {/* --- Results Panel --- */}
      {results && !isLoading && (
        <div className="w-full max-w-2xl mt-8 border border-black rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-bold">Results</h2>

          <div>
            <h3 className="font-semibold">Summary of Suggested Edits</h3>
            <p className="text-sm">{results.summary}</p>
          </div>

          <div>
            <h3 className="font-semibold">Skills to Consider Adding</h3>
            <ul className="list-disc pl-5 text-sm">
              {results.toAdd?.map((skill: string, i: number) => (
                <li key={i}>{skill}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold">Project Ideas to Consider Adding</h3>
            <ul>
              {results.projects?.map((project: string, i: number) => (
                <li key={i} className="text-sm mb-2">
                  - {project}
                </li>
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
            <h3 className="font-semibold">Additional Suggestions</h3>
            <ul className="list-disc pl-5 text-sm">
              {results.Suggestions?.map((s: string, i: number) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
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
