import { NextResponse } from "next/server";
import { getGlassesState, setGlassesState } from "@/lib/glassesState";
import { workflowSteps } from "@/lib/mockData";

function isValidState(value: unknown): value is { activeIndex: number; escalated: boolean } {
  if (typeof value !== "object" || value === null) return false;
  const typed = value as Record<string, unknown>;
  return (
    typeof typed.activeIndex === "number" &&
    typed.activeIndex >= 0 &&
    typed.activeIndex < workflowSteps.length &&
    typeof typed.escalated === "boolean"
  );
}

export async function GET() {
  const state = await getGlassesState();
  return NextResponse.json(state);
}

export async function POST(request: Request) {
  const body = await request.json();
  if (!isValidState(body)) {
    return NextResponse.json({ error: "Invalid state payload." }, { status: 400 });
  }

  await setGlassesState(body);
  return NextResponse.json({ status: "ok" });
}
