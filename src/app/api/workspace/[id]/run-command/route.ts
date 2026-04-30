import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { runWorkflowCommand } from "@/lib/workflow-service";
import { WorkflowStage } from "@/lib/workflow";

function sessionUserId(session: unknown) {
  return (session as { user?: { id?: string } } | null)?.user?.id || null;
}

function statusFromError(error: unknown) {
  return typeof error === "object" && error && "status" in error ? Number((error as { status?: number }).status) : 500;
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const result = await runWorkflowCommand(
      id,
      String(body.command || ""),
      String(body.input || ""),
      (body.fallbackStage || "DEFINE_PRODUCT") as WorkflowStage,
      sessionUserId(session)
    );

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Run Command Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Command failed" },
      { status: statusFromError(error) }
    );
  }
}

