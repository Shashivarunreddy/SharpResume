import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, createUserContent } from "@google/genai";
import type { ResumeData } from "../../../templates/dynamicResumeTemplate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface EnhancedResumeResponse {
  enhanced: ResumeData;
  latex: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { formData, jobDescription } = body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing API Key in server environment." },
        { status: 500 }
      );
    }
    if (!formData || !jobDescription) {
      return NextResponse.json(
        { error: "Missing formData or jobDescription." },
        { status: 400 }
      );
    }

    // Gemini prompt...
    const ai = new GoogleGenAI({ apiKey });
    // ✅ Prompt for Gemini
    const prompt = `
You are an AI assistant that improves resumes to match job descriptions.
Your goal:
- Enhance candidate data to maximize ATS (Applicant Tracking System) score.
- Add missing keywords and improve phrasing.
- Keep it truthful and natural.
- Output only valid JSON in the specified format.

Format strictly as:
{
  "name": "...",
  "phone": "...",
  "email": "...",
  "linkedin": "...",
  "github": "...",
  "summary": "...",
  "skills": {
    "languages": "...",
    "tools": "...",
    "web": "...",
    "devops": "..."
  },
  "experience": [
    { "role": "...", "dates": "...", "company": "...", "location": "...", "points": ["..."] }
  ],
  "projects": [
    { "name": "...", "github": "...", "live": "...", "points": ["..."] }
  ],
  "certifications": [
    { "title": "...", "org": "...", "date": "...", "link": "..." }
  ],
  "education": [
    { "institution": "...", "duration": "...", "degree": "...", "grade": "..." }
  ]
}

Now improve the following resume JSON according to this Job Description:
${jobDescription}

Candidate Data:
${JSON.stringify(formData, null, 2)}

Return only the JSON inside a fenced block like:
\`\`\`json
{ ... }
\`\`\`
`;
    const content = createUserContent(prompt);

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [content],
    });

    const fullText = response?.text || "";
    if (!fullText.trim()) {
      return NextResponse.json({ error: "No response from Gemini model." }, { status: 502 });
    }

    let enhanced: ResumeData | null = null;
    const match = fullText.match(/```json\s*([\s\S]*?)\s*```/i);
    if (match?.[1]) {
      try { enhanced = JSON.parse(match[1]) as ResumeData; } catch { }
    }
    if (!enhanced) {
      const start = fullText.indexOf("{");
      const end = fullText.lastIndexOf("}");
      if (start !== -1 && end > start) {
        try { enhanced = JSON.parse(fullText.slice(start, end + 1)) as ResumeData; } catch { }
      }
    }
    if (!enhanced) {
      return NextResponse.json({ error: "Gemini did not return valid JSON.", raw: fullText }, { status: 502 });
    }

    // ✅ Build absolute base URL for server-side fetch
    const base =
      process.env.NEXT_PUBLIC_BASE_URL ||
      req.nextUrl.origin ||
      "http://localhost:3000";
    // works locally & on Vercel
    // Fallback (paranoid): const base = new URL(req.url).origin;

    const fillFormUrl = `${base}/api/fill`;
    const latexResponse = await fetch(fillFormUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(enhanced),
    });

    if (!latexResponse.ok) {
      const raw = await latexResponse.text(); // may be HTML
      console.error("❌ /api/fill failed:", latexResponse.status, raw);
      return NextResponse.json({ error: "fill_form failed", raw }, { status: 502 });
    }

    let latexData: { latex?: string };
    try {
      latexData = await latexResponse.json();
    } catch {
      const raw = await latexResponse.text();
      console.error("❌ Invalid JSON from /api/fill:", raw);
      return NextResponse.json({ error: "Invalid JSON from fill_form", raw }, { status: 502 });
    }

    const result: EnhancedResumeResponse = {
      enhanced,
      latex: latexData?.latex || "",
    };

    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    console.error("❌ Error in /api/enhance_resume:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
