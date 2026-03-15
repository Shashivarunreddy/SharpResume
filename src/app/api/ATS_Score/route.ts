import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, createPartFromUri, createUserContent } from "@google/genai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ImprovementItem = string | { name: string; description?: string };
type ModelJSON = {
  atsScore?: number;
  keywordMatch?: number;
  improvementTips?: ImprovementItem[];
  skillsToAdd?: ImprovementItem[];
  projectideas?: ImprovementItem[];
  notes?: ImprovementItem[];
};

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const jd = String(form.get("jobDescription") || "");
    const file = form.get("resume") as File | null;

    if (!jd || !file) {
      return NextResponse.json({ error: "Missing jobDescription or resume." }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Server missing GEMINI_API_KEY." }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });
    const uploaded = await ai.files.upload({ file, config: { displayName: file.name } });

    const uploadedName = "name" in uploaded ? uploaded.name : undefined;
    if (!uploadedName) {
      return NextResponse.json({ error: "Upload succeeded but no file name returned." }, { status: 502 });
    }

    // Wait until ACTIVE
    let meta = await ai.files.get({ name: uploadedName });
    for (let i = 0; i < 20 && meta.state === "PROCESSING"; i++) {
      await new Promise((r) => setTimeout(r, 1500));
      meta = await ai.files.get({ name: uploadedName });
    }

    if (meta.state !== "ACTIVE" || !meta.uri || !meta.mimeType) {
      return NextResponse.json({ error: "File not ready or missing meta info." }, { status: 502 });
    }

    const system = `
You are an ATS scoring assistant.

Analyze the attached resume and return:
{
  "atsScore": 0,
  "keywordMatch": 0,
  "improvementTips": [],
  "skillsToAdd": [],
  "projectideas": [],
  "notes": []
}`;

    const contents = createUserContent([
      system,
      "\nJob Description:\n",
      jd,
      "\nResume file below.\n",
      createPartFromUri(meta.uri, meta.mimeType),
    ]);

    const resp = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
    });

    const text = resp.text;
    if (!text) return NextResponse.json({ error: "No text output from Gemini." }, { status: 502 });

    const match = text.match(/```json\s*([\s\S]*?)\s*```/i);
    let parsed: ModelJSON | null = null;

    if (match?.[1]) {
      try {
        parsed = JSON.parse(match[1]);
      } catch {
        parsed = null;
      }
    }

    if (!parsed) {
      const fb = text.indexOf("{");
      const lb = text.lastIndexOf("}");
      if (fb !== -1 && lb > fb) {
        try {
          parsed = JSON.parse(text.slice(fb, lb + 1));
        } catch {
          parsed = null;
        }
      }
    }

    if (!parsed) {
      return NextResponse.json({ error: "Failed to parse model output." }, { status: 500 });
    }

    const flatten = <T extends string | { name: string; description?: string }>(arr?: T[]): string[] =>
      arr?.map((x) => (typeof x === "string" ? x : `${x.name}: ${x.description ?? ""}`)) ?? [];

    return NextResponse.json({
      atsScore: parsed.atsScore ?? 0,
      keywordMatch: parsed.keywordMatch ?? 0,
      improvementTips: flatten(parsed.improvementTips),
      Suggestions: flatten(parsed.notes),
      projects: flatten(parsed.projectideas),
      toAdd: flatten(parsed.skillsToAdd),
      raw: text,
    });
  } catch (e: unknown) {
    const errMsg = e instanceof Error ? e.message : "Unknown error occurred";
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
