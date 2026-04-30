import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { runArtifactStage } from "@/lib/workflow-service";

function sessionUserId(session: unknown) {
  return (session as { user?: { id?: string } } | null)?.user?.id || null;
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const result = await runArtifactStage(id, "BLUEPRINT", String(body.input || ""), sessionUserId(session));
    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Refine Idea Error:", error);
    const status = typeof error === "object" && error && "status" in error ? Number((error as { status?: number }).status) : 500;
    const message = error instanceof Error ? error.message : "Failed to refine idea";
    return NextResponse.json({ error: message }, { status });
  }
}

