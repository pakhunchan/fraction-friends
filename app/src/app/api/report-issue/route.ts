import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const REPORTS_DIR = path.join(process.cwd(), ".reports");
const REPORTS_FILE = path.join(REPORTS_DIR, "issues.json");

export async function POST(request: NextRequest) {
  try {
    const report = await request.json();

    // Ensure .reports directory exists
    await fs.mkdir(REPORTS_DIR, { recursive: true });

    // Read existing reports or start with empty array
    let reports: unknown[] = [];
    try {
      const existing = await fs.readFile(REPORTS_FILE, "utf-8");
      reports = JSON.parse(existing);
      if (!Array.isArray(reports)) {
        reports = [];
      }
    } catch {
      // File doesn't exist yet — that's fine
    }

    // Append the new report
    reports.push({
      id: `report-${Date.now()}`,
      ...report,
      receivedAt: new Date().toISOString(),
    });

    // Write back
    await fs.writeFile(REPORTS_FILE, JSON.stringify(reports, null, 2), "utf-8");

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("[report-issue] Failed to save report:", err);
    return NextResponse.json(
      { success: false, error: "Failed to save report" },
      { status: 500 }
    );
  }
}
