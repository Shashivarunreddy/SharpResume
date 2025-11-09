"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

type AnalysisResult = {
  summary?: string;
  atsScore: number;
  keywordMatch: number;
  improvementTips: string[];
  Suggestions: string[];
  projects: string[];
  toAdd: string[];
  raw?: string;
};

export default function Basic() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const jdRef = useRef<HTMLTextAreaElement | null>(null);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const file = fileRef.current?.files?.[0];
    const jd = jdRef.current?.value?.trim();

    if (!file) {
      alert("📄 Please upload your resume file before submitting.");
      return;
    }

    if (!jd) {
      alert("📝 Please paste the job description before analyzing.");
      return;
    }

    setIsLoading(true);
    setResults(null);

    try {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("jobDescription", jd);

      console.log("File selected:", file.name);
      console.log("Job description length:", jd.length);

      const res = await fetch("/api/ATS_Score", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to analyze resume");
      }

      const data = await res.json();
      setResults(data);
    } catch (err: any) {
      console.error("Error analyzing resume:", err);
      alert("❌ Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">ATS Resume Analyzer</h1>

      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="w-full max-w-xl space-y-4 border border-black rounded-xl p-6 shadow-sm bg-white"
      >
        {/* Resume Upload */}
        <div>
          <label className="block mb-1 font-medium">Upload Resume</label>
          <input
            ref={fileRef}
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
            ref={jdRef}
            name="jobDescription"
            rows={8}
            className="w-full border border-black rounded-lg p-2 bg-white text-black"
            placeholder="Paste the job description here..."
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full border border-black rounded-lg p-2 font-semibold hover:bg-black hover:text-white transition"
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
        <div className="w-full max-w-2xl mt-8 border border-black rounded-xl p-6 space-y-6 bg-white shadow">
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

          {/* Skills to Add */}
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
