"use client";
import React, { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { StreamLanguage } from "@codemirror/language";
import { stex } from "@codemirror/legacy-modes/mode/stex";
import { oneDark } from "@codemirror/theme-one-dark";

export default function LatexPDF() {
  const [code, setCode] = useState(`\\documentclass{article}
\\begin{document}
Hello, \\LaTeX!
\\end{document}`);
  const [pdfUrl, setPdfUrl] = useState("");

  const compileLatex = async () => {
    const res = await fetch("/api/compile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    if (!res.ok) return alert("Compilation failed");

    const blob = await res.blob();
    setPdfUrl(URL.createObjectURL(blob));
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Left: Code editor */}
      <div style={{ width: "50%", padding: "1rem" }}>
        <CodeMirror
          value={code}
          height="90vh"
          extensions={[StreamLanguage.define(stex)]}
          theme={oneDark}
          onChange={(value) => setCode(value)}
        />
        <button
          onClick={compileLatex}
          style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}
        >
          Compile
        </button>
      </div>

      {/* Right: PDF Viewer */}
      <div style={{ width: "50%", borderLeft: "1px solid #ccc" }}>
        {pdfUrl ? (
          <iframe src={pdfUrl} width="100%" height="100%" title="PDF Preview" />
        ) : (
          <p style={{ textAlign: "center", marginTop: "2rem" }}>
            Compile to view PDF
          </p>
        )}
      </div>
    </div>
  );
}
