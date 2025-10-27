import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";

export async function POST(req: NextRequest) {
  const tempFiles: string[] = [];

  try {
    const body = await req.json();
    let texContent = body.code;

    if (!texContent) throw new Error("No LaTeX content provided");

    // Step 1: Create temporary file paths
    const fileName = `document-${Date.now()}`;
    const windowsTexPath = path.join(os.tmpdir(), `${fileName}.tex`);
    const windowsPdfPath = path.join(os.tmpdir(), `${fileName}.pdf`);
    tempFiles.push(windowsTexPath, windowsPdfPath);

    // Step 2: Write LaTeX content to temporary file
    fs.writeFileSync(windowsTexPath, texContent, "utf8");

    // Step 3: Convert Windows path to WSL path
    const wslTexPath = windowsTexPath
      .replace(/\\/g, "/")
      .replace(/^([A-Za-z]):/, (_, drive) => `/mnt/${drive.toLowerCase()}`);
    const wslDir = path.posix.dirname(wslTexPath);

    // Step 4: Run pdflatex inside WSL
    await new Promise<void>((resolve, reject) => {
      const cmd = spawn("pdflatex", [
        "-interaction=nonstopmode",
        "-halt-on-error",
        `-output-directory=${wslDir}`,
        wslTexPath,
      ]);

      let stderr = "";
      cmd.stderr.on("data", (data) => (stderr += data.toString()));
      cmd.stdout.on("data", (data) => process.stdout.write(data.toString()));

      cmd.on("close", (code) => {
        if (code === 0) resolve();
        else {
          console.error("❌ pdflatex error:", stderr);
          reject(new Error("pdflatex failed inside WSL"));
        }
      });
    });

    // Step 5: Read compiled PDF
    const pdfBuffer = fs.readFileSync(windowsPdfPath);

    // ✅ Send PDF as response
    return new NextResponse(pdfBuffer, {
      headers: { "Content-Type": "application/pdf" },
    });
  } catch (error: any) {
    console.error("Compilation error:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF", details: error.message },
      { status: 500 }
    );
  } finally {
    // Step 6: Cleanup temporary files
    for (const file of tempFiles) {
      try {
        if (fs.existsSync(file)) fs.unlinkSync(file);
      } catch (err) {
        console.warn("⚠️ Failed to delete temp file:", file, err);
      }
    }
  }
}
