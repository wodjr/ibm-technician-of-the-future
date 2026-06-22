import { NextResponse } from "next/server";
import type { TechnicianInput } from "@/types/technician";
import { generateTechnicianGuidance } from "@/lib/apiService";

function isValidTechnicianInput(value: unknown): value is TechnicianInput {
  if (typeof value !== "object" || value === null) return false;

  const typed = value as Record<string, unknown>;
  return (
    typeof typed.assetId === "string" && typed.assetId.trim().length > 0 && typed.assetId.length <= 100 &&
    typeof typed.symptoms === "string" && typed.symptoms.trim().length > 0 && typed.symptoms.length <= 1000 &&
    typeof typed.errorCode === "string" && typed.errorCode.length <= 64 &&
    Array.isArray(typed.photos) && typed.photos.every((item) => typeof item === "string") &&
    typeof typed.escalate === "boolean"
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!isValidTechnicianInput(body)) {
      return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
    }

    const result = await generateTechnicianGuidance(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error("API generate error:", error);
    return NextResponse.json({ error: "Unable to generate guidance at this time." }, { status: 500 });
  }
}
