import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, createPartFromUri, createUserContent } from "@google/genai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ImprovementItem = string | { name: string; description?: string };
type BulletItem = { section?: string; original?: string; suggested: string };

type ModelJSON = {
  atsScore?: number;
  keywordMatch?: number;
  improvementTips?: ImprovementItem[];
  skillsToAdd?: ImprovementItem[];
  bullets?: BulletItem[];
  projectideas?: ImprovementItem[];
  notes?: ImprovementItem[];
};

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const jd = String(form.get("jobDescription") || "");
    const file = form.get("resume") as File | null;

    if (!jd || !file) {
      return NextResponse.json(
        { error: "Missing jobDescription or resume." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Server missing API Key. Set GEMINI_API_KEY in .env." },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    // Upload file
    const uploaded = await ai.files.upload({
      file,
      config: { displayName: file.name },
    });

    const uploadedName = "name" in uploaded ? uploaded.name : undefined;
    if (!uploadedName) {
      return NextResponse.json(
        { error: "Upload succeeded but no file name returned." },
        { status: 502 }
      );
    }

    // Wait until ACTIVE
    let meta = await ai.files.get({ name: uploadedName });
    for (let i = 0; i < 20 && meta.state === "PROCESSING"; i++) {
      await new Promise((r) => setTimeout(r, 1500));
      meta = await ai.files.get({ name: uploadedName });
    }

    if (meta.state !== "ACTIVE" || !meta.uri || !meta.mimeType) {
      return NextResponse.json(
        { error: "File processing failed (not ACTIVE or missing uri/mimeType)." },
        { status: 502 }
      );
    }

    // Prompt for Gemini
    const system = `
You are an ATS scoring assistant.

Analyze the attached resume against the job description and return:
1. ATS score (0–100)
2. Keyword match percentage (0–100)
3. Key missing keywords or skill gaps
4. Suggestions to improve both scores
5. Optional: bullet rewrites, project ideas, notes

Output exactly this JSON inside a fenced code block:
\`\`\`json
{
  "atsScore": 0,
  "keywordMatch": 0,
  "improvementTips": [],
  "skillsToAdd": [],
  "bullets": [],
  "projectideas": [],
  "notes": []
}
\`\`\`
`;

    const filePart = createPartFromUri(meta.uri, meta.mimeType);
    const contents = createUserContent([
      system,
      "\nJob Description:\n",
      jd,
      "\nResume file attached below.\n",
      filePart,
    ]);

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
    let parsed: ModelJSON | null = null;

    // Extract JSON block
    const match = full.match(/```json\s*([\s\S]*?)\s*```/i);
    if (match && match[1]) {
      try {
        parsed = JSON.parse(match[1]) as ModelJSON;
      } catch {
        parsed = null;
      }
    }

    if (!parsed) {
      const fb = full.indexOf("{");
      const lb = full.lastIndexOf("}");
      if (fb !== -1 && lb > fb) {
        try {
          parsed = JSON.parse(full.slice(fb, lb + 1)) as ModelJSON;
        } catch {
          parsed = null;
        }
      }
    }

    if (!parsed) {
      return NextResponse.json(
        { error: "Failed to parse JSON from model output." },
        { status: 500 }
      );
    }

    // ✅ Type-safe flatten helper
    const flatten = <T extends string | { name: string; description?: string }>(
      arr?: T[]
    ): string[] =>
      arr?.map((x) =>
        typeof x === "string"
          ? x
          : x?.name
          ? `${x.name}: ${x.description ?? ""}`
          : JSON.stringify(x)
      ) ?? [];

    return NextResponse.json({
      atsScore: parsed.atsScore ?? 0,
      keywordMatch: parsed.keywordMatch ?? 0,
      improvementTips: flatten(parsed.improvementTips),
      Suggestions: flatten(parsed.notes),
      projects: flatten(parsed.projectideas),
      toAdd: flatten(parsed.skillsToAdd),
      raw: full,
      json: parsed,
    });
  } catch (e: unknown) {
    const errMsg = e instanceof Error ? e.message : "Unknown error occurred";
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
