import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { resolveDecision } from "@/lib/workflow-service";

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
    if (!body.projectId || !body.decisionId) return NextResponse.json({ error: "projectId and decisionId are required" }, { status: 400 });
    return NextResponse.json(await resolveDecision(String(body.projectId), String(body.decisionId), body.resolution, sessionUserId(session)));
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Decision resolve failed" }, { status: statusFromError(error) });
  }
}
