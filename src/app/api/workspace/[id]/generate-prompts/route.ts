import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { runWorkflowCommand } from "@/lib/workflow-service";

function sessionUserId(session: unknown) {
  return (session as { user?: { id?: string } } | null)?.user?.id || null;
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const result = await runWorkflowCommand(id, "/prompt-workflow", String(body.input || ""), "WORKFLOW", sessionUserId(session));
    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Prompt Workflow Error:", error);
    const status = typeof error === "object" && error && "status" in error ? Number((error as { status?: number }).status) : 500;
    const message = error instanceof Error ? error.message : "Failed to generate prompts";
    return NextResponse.json({ error: message }, { status });
  }
}

