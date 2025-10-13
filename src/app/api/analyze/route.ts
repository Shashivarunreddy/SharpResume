// app/api/analyze/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  GoogleGenAI,
  createPartFromUri,
  createUserContent,
} from "@google/genai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ModelJSON = {
  summaryRewrite: string;
  skillsToAdd?: string[];
  bullets?: { section?: string; original?: string; suggested: string }[];
  projectideas?: string[];
  notes?: string[];
};

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const apiKey = String(form.get("apiKey") || "");
    const jd = String(form.get("jobDescription") || "");
    const role = String(form.get("role") || "");
    const strictATS = String(form.get("strictATS") || "") === "on";
    const file = form.get("resume") as File | null;

    if (!apiKey || !jd || !file) {
      return NextResponse.json(
        { error: "Missing apiKey, jobDescription, or resume." },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    // 1) Upload file
    const uploaded = await ai.files.upload({
      file,
      config: { displayName: file.name },
    });

    const uploadedName = "name" in uploaded ? uploaded.name : undefined;
    if (!uploadedName) {
      return NextResponse.json(
        {
          error:
            "Upload succeeded but no file name returned. Try PDF or retry.",
        },
        { status: 502 }
      );
    }

    // 2) Poll until ACTIVE
    let meta = await ai.files.get({ name: uploadedName });
    for (let i = 0; i < 20 && meta.state === "PROCESSING"; i++) {
      await new Promise((r) => setTimeout(r, 1500));
      meta = await ai.files.get({ name: uploadedName });
    }
    if (meta.state !== "ACTIVE" || !meta.uri || !meta.mimeType) {
      return NextResponse.json(
        {
          error: "File processing failed (not ACTIVE or missing uri/mimeType).",
        },
        { status: 502 }
      );
    }

    // 3) Build prompt
    const system = [
      "You are an ATS optimization assistant.",
      "Task: analyze the attached resume and the Job Description to maximize ATS keyword alignment while preserving truthfulness. use the STAR (Situation, Task, Action, Result) method for my experience bullet points. Quantify my achievements wherever possible.",
      strictATS
        ? "Strict ATS mode: prefer exact JD terminology, single-column structure, standard section headers, no tables/columns/images."
        : "Balance ATS keyword coverage with clarity and conciseness.",
      "Return two outputs:",
      "1) GUIDANCE: Human-readable guidance with sections: Title & Summary, Skills to Add, Experience Bullet Rewrites, Keyword Coverage vs JD, Formatting for ATS.",
      "2) JSON only in a fenced code block labeled json with fields: summaryRewrite, missingKeywords[], skillsToAdd[], bullets[{section, original?, suggested}], projectideas[],  notes[].",
      "Bullets should be action-oriented and quantify impact where possible.",
      role ? `Target seniority: ${role}.` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const filePart = createPartFromUri(meta.uri, meta.mimeType);
    const contents = createUserContent([
      system,
      "\nJob Description:\n",
      jd,
      "\nResume file attached below.\n",
      filePart,
      "\nOutput exactly: First 'GUIDANCE:' section, then a fenced json code block.",
    ]);

    // 4) Generate content
    const resp = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
    });

    if (!resp.text) {
      return NextResponse.json(
        { error: "Gemini returned no text response." },
        { status: 502 }
      );
    }
    const full = resp.text;

    // 5) Extract JSON fenced block (robust)
    let parsed: ModelJSON | null = null;

    // Preferred: fenced code block with json language
    const match = full.match(/```json\s*([\s\S]*?)\s*```/i);
    if (match && match[1]) {
      try {
        parsed = JSON.parse(match[1]) as ModelJSON;
      } catch (err) {
        console.error("JSON parse error:", err);
        parsed = null;
      }
    }

    // As a last resort, try to find a top-level JSON object in the string
    if (!parsed) {
      const firstBrace = full.indexOf("{");
      const lastBrace = full.lastIndexOf("}");
      if (firstBrace !== -1 && lastBrace > firstBrace) {
        const maybeJson = full.slice(firstBrace, lastBrace + 1);
        try {
          parsed = JSON.parse(maybeJson) as ModelJSON;
        } catch (e) {
          const err = e as Error;
          return NextResponse.json(
            { error: err.message || "Unexpected error" },
            { status: 500 }
          );
        }
      }
    }

    // 6) Map to UI contract
    const summary =
      parsed?.summaryRewrite ||
      "No summary rewrite returned. Check JSON block above for details.";

    const toAdd = parsed?.skillsToAdd ?? [];
    const Suggestions = parsed?.notes ?? [];
    const projects = parsed?.projectideas ?? [];
    const bulletReplacements =
      parsed?.bullets
        ?.map((b) =>
          b?.suggested
            ? b.section
              ? `${b.section}: ${b.suggested}`
              : b.suggested
            : ""
        )
        .filter(Boolean) ?? [];

    return NextResponse.json({
      summary,
      Suggestions,
      projects,
      bulletReplacements,
      toAdd,
      raw: full,
      json: parsed,
    });
  } catch (e) {
    const err = e as Error;
    return NextResponse.json(
      { error: err.message || "Unexpected error" },
      { status: 500 }
    );
  }
}
