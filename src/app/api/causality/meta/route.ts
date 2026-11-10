import { NextResponse } from "next/server";

/**
 * Lane 4 — Challenge 4: Causality Audit Service
 *
 * This API endpoint identifies our service
 * and returns our course token to the grader.
 */
export async function GET() {
  return NextResponse.json({
    service: "causality",
    specVersion: "1",
    studentToken: process.env.SITE_TOKEN,
  });
}
