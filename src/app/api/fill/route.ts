import { NextResponse } from "next/server";
import { dynamicResumeTemplate, ResumeData } from "../../../templates/dynamicResumeTemplate";

interface StoredFormData extends ResumeData {
  latex: string;
}

let lastFormData: StoredFormData | null = null;
let hasNewUpdate = false;

export async function POST(req: Request) {
  try {
    const data: ResumeData = await req.json();

    if (!data.name) {
      return NextResponse.json({ error: "Name required" }, { status: 400 });
    }

    const latexCode = dynamicResumeTemplate(data);
    lastFormData = { ...data, latex: latexCode };
    hasNewUpdate = true;


    return NextResponse.json({
      message: "LaTeX generated successfully",
      latex: latexCode,
    });
  } catch (err: unknown) {
    // ✅ Type-safe error handling
    const errorMessage =
      err instanceof Error ? err.message : "Unknown server error";
    console.error("Error in /api/fill:", errorMessage);

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function GET() {
  try {
    if (!lastFormData) {
      return NextResponse.json({
        latex: "",
        updated: false,
      });
    }

    const response = {
      latex: lastFormData.latex,
      updated: hasNewUpdate,
    };

    hasNewUpdate = false;
    return NextResponse.json(response);
  } catch (err: unknown) {
    // ✅ Type-safe error handling
    const errorMessage =
      err instanceof Error ? err.message : "Unknown server error";
    console.error("GET /api/fill:", errorMessage);

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
