import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, createUserContent } from "@google/genai";
import { dynamicResumeTemplate, type ResumeData } from "../../../templates/dynamicResumeTemplate";

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
      return NextResponse.json({ error: "Missing GEMINI_API_KEY" }, { status: 500 });
    }
    if (!formData || !jobDescription) {
      return NextResponse.json({ error: "Missing formData or jobDescription" }, { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
You are an AI assistant that improves resumes based on job descriptions.
Enhance and rewrite content to improve ATS matching. Output JSON in this exact shape ONLY:

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

Job Description:
${jobDescription}

Candidate Resume Data:
${JSON.stringify(formData, null, 2)}

Return the JSON inside a fenced block like:
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
      return NextResponse.json({ error: "Empty response from Gemini" }, { status: 502 });
    }

    // Extract JSON
    let enhanced: ResumeData | null = null;
    const match = fullText.match(/```json\s*([\s\S]*?)\s*```/i);
    if (match?.[1]) {
      try {
        enhanced = JSON.parse(match[1]) as ResumeData;
      } catch {}
    }
    if (!enhanced) {
      const s = fullText.indexOf("{");
      const e = fullText.lastIndexOf("}");
      if (s !== -1 && e > s) {
        try {
          enhanced = JSON.parse(fullText.slice(s, e + 1)) as ResumeData;
        } catch {}
      }
    }
    if (!enhanced) {
      return NextResponse.json({ error: "Invalid JSON", raw: fullText }, { status: 502 });
    }

    const latexCode = dynamicResumeTemplate(enhanced);

    const result: EnhancedResumeResponse = { enhanced, latex: latexCode };
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("❌ /api/enhance_resume error:", error);
    return NextResponse.json({ error: error.message || "Server Error" }, { status: 500 });
  }
}
