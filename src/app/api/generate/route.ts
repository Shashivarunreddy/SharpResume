import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await fetch("http://13.208.244.123:3001/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Backend failed" }, { status: 500 });
    }

    const blob = await res.blob();
    return new NextResponse(blob, {
      headers: { "Content-Type": "application/pdf" },
    });
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
