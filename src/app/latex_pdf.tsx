"use client";
import React, { useEffect, useMemo, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { StreamLanguage } from "@codemirror/language";
import { stex } from "@codemirror/legacy-modes/mode/stex";
import { oneDark } from "@codemirror/theme-one-dark";

export default function LatexPDF() {
  const [code, setCode] = useState(
    "\\documentclass{article}\n\\begin{document}\nHello, \\LaTeX!\n\\end{document}"
  );
  const [pdfUrl, setPdfUrl] = useState("");
  const [isCompiling, setIsCompiling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canCompile = useMemo(
    () => code.trim().length > 0 && !isCompiling,
    [code, isCompiling]
  );

  // ✅ Auto-fetch LaTeX every 3 seconds if new data is available
  useEffect(() => {
    const pollForLatex = async () => {
      try {
        const res = await fetch("/api/fill_form"); // GET
        if (!res.ok) return;
        const data = await res.json();

        if (data.updated && data.latex) {
          console.log("🆕 New LaTeX detected, updating editor...");
          setCode(data.latex);
        }
      } catch (err: any) {
        console.error("Polling error:", err.message);
      }
    };

    // Poll every 3 seconds
    const interval = setInterval(pollForLatex, 10000);
    return () => clearInterval(interval);
  }, []);

  const compileLatex = async () => {
    if (!canCompile) return;
    setIsCompiling(true);
    setError(null);
    try {
      const res = await fetch("/api/compile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Compilation failed");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setPdfUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return url;
      });
    } catch (e: any) {
      setError(e?.message || "Compilation failed");
    } finally {
      setIsCompiling(false);
    }
  };

  return (
    <div className="flex h-screen w-screen flex-col bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 px-4">
        <div className="flex items-center gap-2">
          <span className="font-semibold tracking-tight">LaTeX Preview</span>
          <span className="text-slate-500">|</span>
          <span className="text-xs text-slate-400">
            Live editor and PDF viewer
          </span>
        </div>
        <div className="flex items-center gap-3">
          {error ? (
            <span className="max-w-[38ch] truncate text-xs text-rose-400">
              {error}
            </span>
          ) : null}
          <button
            onClick={compileLatex}
            disabled={!canCompile}
            className={[
              "inline-flex items-center rounded-md border px-3 py-2 text-sm font-semibold transition",
              "bg-blue-600 border-blue-500 text-white hover:bg-blue-500",
              isCompiling ? "opacity-80 cursor-default" : "",
              !canCompile
                ? "opacity-50 cursor-not-allowed hover:bg-blue-600"
                : "",
            ].join(" ")}
          >
            {isCompiling ? "Compiling…" : "Compile"}
          </button>
        </div>
      </header>

      {/* Main split with enforced minimum widths to resist zoom squeeze */}
      <main className="grid min-h-0 flex-1 grid-cols-[minmax(420px,1fr)_1px_minmax(520px,1fr)]">
        {/* Left: Editor */}
        <section className="flex min-h-0 min-w-[420px] flex-col">
          <div className="flex h-11 items-center justify-between border-b border-slate-800 bg-slate-900/90 px-3">
            <span className="font-semibold">Editor</span>
            <span className="text-xs text-slate-400">LaTeX (TeX) mode</span>
          </div>
          <div className="min-h-0 flex-1 p-3">
            {/* Force internal scroll so the editor doesn't expand and starve the preview */}
            <div className="h-full overflow-auto rounded-lg border border-slate-800 shadow-sm">
              <CodeMirror
                value={code}
                height="100%"
                extensions={[StreamLanguage.define(stex)]}
                theme={oneDark}
                onChange={(value) => setCode(value)}
                basicSetup={{ lineNumbers: true, highlightActiveLine: true }}
              />
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="h-full w-px bg-gradient-to-b from-slate-800 to-slate-900" />

        {/* Right: Preview */}
        <section className="flex min-h-0 min-w-[520px] flex-col">
          <div className="flex h-11 items-center justify-between border-b border-slate-800 bg-slate-900/90 px-3">
            <span className="font-semibold">Preview</span>
            <span className="text-xs text-slate-400">
              {pdfUrl ? "PDF ready" : "Compile to view"}
            </span>
          </div>
          <div className="min-h-0 flex-1 p-3">
            {pdfUrl ? (
              <iframe
                src={pdfUrl}
                title="PDF Preview"
                className="h-full w-full rounded-lg border border-slate-800 bg-slate-950 shadow-sm"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-slate-800 text-center">
                <div className="rounded-full border border-slate-800 bg-slate-900 px-2 py-1 text-[10px] tracking-widest text-slate-200">
                  PDF
                </div>
                <p className="m-0 text-sm font-medium text-indigo-200">
                  Click Compile to render the PDF
                </p>
                <p className="m-0 text-xs text-slate-400">
                  Ensure document has \documentclass and
                  \begin&#123;document&#125; … \end&#123;document&#125;
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
