import { NextResponse } from "next/server";
import { dynamicResumeTemplate, ResumeData } from "../../../templates/dynamicResumeTemplate";

interface StoredFormData extends ResumeData {
  latex: string;
}

let lastFormData: StoredFormData | null = null;
let hasNewUpdate = false; // Tracks if a new LaTeX was generated

export async function POST(req: Request) {
  try {
    const data: ResumeData = await req.json();

    if (!data.name) {
      return NextResponse.json({ error: "Name required" }, { status: 400 });
    }

    const latexCode = dynamicResumeTemplate(data);

    lastFormData = { ...data, latex: latexCode };
    hasNewUpdate = true; // Mark as new update ready

    return NextResponse.json({
      message: "LaTeX generated successfully",
      latex: latexCode,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error occurred";
    console.error("❌ Error generating LaTeX:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// GET endpoint: used by frontend to fetch updated LaTeX
export async function GET() {
  try {
    if (!lastFormData) {
      return NextResponse.json({ latex: "", updated: false });
    }

    // Send LaTeX only if new update exists
    const response = {
      latex: hasNewUpdate ? lastFormData.latex : "",
      updated: hasNewUpdate,
    };

    // Reset update flag once fetched
    hasNewUpdate = false;

    return NextResponse.json(response);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error occurred";
    console.error("❌ Error fetching LaTeX:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
