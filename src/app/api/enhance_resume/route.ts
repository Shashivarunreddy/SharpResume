import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, createUserContent } from "@google/genai";
import type { ResumeData } from "@/templates/dynamicResumeTemplate";

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


    // ✅ Initialize Gemini client
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

    // ✅ Call Gemini 2.0 model
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [content],
    });

    const fullText = response?.text || "";
    if (!fullText.trim()) {
      return NextResponse.json(
        { error: "No response from Gemini model." },
        { status: 502 }
      );
    }

    // ✅ Extract JSON block safely
    const match = fullText.match(/```json\s*([\s\S]*?)\s*```/i);
    let enhanced: ResumeData | null = null;

    if (match?.[1]) {
      try {
        enhanced = JSON.parse(match[1]) as ResumeData;
      } catch (err) {
        console.error("JSON parse error:", err);
      }
    }

    if (!enhanced) {
      const start = fullText.indexOf("{");
      const end = fullText.lastIndexOf("}");
      if (start !== -1 && end > start) {
        try {
          enhanced = JSON.parse(fullText.slice(start, end + 1)) as ResumeData;
        } catch (err) {
          console.error("Fallback parse error:", err);
        }
      }
    }

    if (!enhanced) {
      return NextResponse.json(
        { error: "Gemini did not return valid JSON.", raw: fullText },
        { status: 502 }
      );
    }

    // ✅ Auto-call /api/fill_form to generate LaTeX
    const latexResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/fill_form`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(enhanced),
      }
    );

    const latexData = await latexResponse.json();

    if (!latexResponse.ok) {
      console.error("❌ LaTeX generation failed:", latexData);
    }

    const result: EnhancedResumeResponse = {
      enhanced,
      latex: latexData?.latex || "",
    };

    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    console.error("❌ Error in /api/enhance:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
