import { NextResponse } from "next/server";
import { dynamicResumeTemplate } from "@/templates/dynamicResumeTemplate";

let lastFormData: any = null;
let hasNewUpdate = false; // Tracks if a new LaTeX was generated

export async function POST(req: Request) {
  try {
    const data = await req.json();
    if (!data.name)
      return NextResponse.json({ error: "Name required" }, { status: 400 });

    const latexCode = dynamicResumeTemplate(data);

    lastFormData = { ...data, latex: latexCode };
    hasNewUpdate = true; // Mark as new update ready

    return NextResponse.json({ message: "LaTeX generated successfully", latex: latexCode });
  } catch (err: any) {
    console.error("❌ Error generating LaTeX:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// 🟡 GET endpoint: used by frontend to fetch updated LaTeX
export async function GET() {
  try {
    if (!lastFormData)
      return NextResponse.json({ latex: "", updated: false });

    // Send LaTeX only if new update exists
    const response = {
      latex: hasNewUpdate ? lastFormData.latex : "",
      updated: hasNewUpdate,
    };

    // Reset update flag once fetched
    hasNewUpdate = false;

    return NextResponse.json(response);
  } catch (err: any) {
    console.error("❌ Error fetching LaTeX:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
