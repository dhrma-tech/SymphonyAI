import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { savePromptRating } from "@/lib/workflow-service";

function sessionUserId(session: unknown) {
  return (session as { user?: { id?: string } } | null)?.user?.id || null;
}

function statusFromError(error: unknown) {
  return typeof error === "object" && error && "status" in error ? Number((error as { status?: number }).status) : 500;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json().catch(() => ({}));
    const result = await savePromptRating(
      String(body.projectId || ""),
      Number(body.phaseNumber || 1),
      String(body.rating || ""),
      String(body.feedback || ""),
      String(body.phaseTitle || ""),
      sessionUserId(session)
    );
    return NextResponse.json(result);
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Prompt rating failed" }, { status: statusFromError(error) });
  }
}
