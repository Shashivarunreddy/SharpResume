"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type AnalysisResult = {
  summary: string;
  atsScore: number;
  keywordMatch: number;
  improvementTips: string[];
  Suggestions: string[];
  projects: string[];
  toAdd: string[];
  raw: string;
};

export default function Basic() {
  const router = useRouter();
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    try {
      setIsLoading(true);
      const res = await fetch("/api/ATS_Score", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setResults(data);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center p-8">
      <h1 className="text-2xl font-bold mb-6">ATS Score</h1>

      {/* Form */}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          await handleSubmit(fd);
        }}
        className="w-full max-w-xl space-y-4 border border-black rounded-xl p-6"
      >
        {/* Resume Upload */}
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
            rows={8}
            className="w-full border border-black rounded-lg p-2 bg-white text-black"
            placeholder="Paste the job description here..."
            required
          />
        </div>

        <button
          type="submit"
          className="w-full border border-black rounded-lg p-2 font-semibold hover:bg-black hover:text-white transition"
          disabled={isLoading}
        >
          {isLoading ? "Analyzing…" : "Analyze Resume"}
        </button>
      </form>

      {/* Spinner */}
      {isLoading && (
        <div className="w-full max-w-xl mt-4 border border-black rounded-xl p-4 flex items-center justify-center">
          <svg className="animate-spin h-6 w-6 text-black" viewBox="0 0 24 24">
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

      {/* Results */}
      {results && !isLoading && (
        <div className="w-full max-w-2xl mt-8 border border-black rounded-xl p-6 space-y-6">
          <h2 className="text-xl font-bold mb-2">Results</h2>

          {/* ATS Score */}
          <div>
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">ATS Score</h3>
              <span
                className={`text-2xl font-bold ${
                  results.atsScore >= 80
                    ? "text-green-600"
                    : results.atsScore >= 50
                    ? "text-yellow-500"
                    : "text-red-600"
                }`}
              >
                {results.atsScore}/100
              </span>
            </div>
            <div className="w-full bg-gray-200 h-3 rounded-full mt-1">
              <div
                className="h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${results.atsScore}%`,
                  backgroundColor:
                    results.atsScore >= 80
                      ? "green"
                      : results.atsScore >= 50
                      ? "orange"
                      : "red",
                }}
              ></div>
            </div>
          </div>

          {/* Keyword Match */}
          <div>
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Keyword Match</h3>
              <span
                className={`text-2xl font-bold ${
                  results.keywordMatch >= 80
                    ? "text-green-600"
                    : results.keywordMatch >= 50
                    ? "text-yellow-500"
                    : "text-red-600"
                }`}
              >
                {results.keywordMatch}%
              </span>
            </div>
            <div className="w-full bg-gray-200 h-3 rounded-full mt-1">
              <div
                className="h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${results.keywordMatch}%`,
                  backgroundColor:
                    results.keywordMatch >= 80
                      ? "green"
                      : results.keywordMatch >= 50
                      ? "orange"
                      : "red",
                }}
              ></div>
            </div>
          </div>

          {/* Improvement Tips */}
          <div>
            <h3 className="font-semibold">Improvement Tips</h3>
            <ul className="list-disc pl-5 text-sm">
              {results.improvementTips?.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>

          {/* Skills */}
          <div>
            <h3 className="font-semibold">Skills to Add</h3>
            <ul className="list-disc pl-5 text-sm">
              {results.toAdd?.map((skill, i) => (
                <li key={i}>{skill}</li>
              ))}
            </ul>
          </div>

          {/* Projects */}
          <div>
            <h3 className="font-semibold">Project Ideas</h3>
            <ul className="list-disc pl-5 text-sm">
              {results.projects?.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </div>

          {/* Suggestions */}
          <div>
            <h3 className="font-semibold">Additional Suggestions</h3>
            <ul className="list-disc pl-5 text-sm">
              {results.Suggestions?.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

          {/* Button */}
          <div className="mt-6 flex flex-col items-center">
            <button
              onClick={() => router.push("/")}
              className="border border-black rounded-lg px-4 py-2 text-sm font-semibold hover:bg-black hover:text-white transition"
            >
              Increase Your Hiring Chances →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
