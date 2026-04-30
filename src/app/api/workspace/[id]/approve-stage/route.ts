import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { approveStage } from "@/lib/workflow-service";
import { WorkflowStage } from "@/lib/workflow";

function sessionUserId(session: unknown) {
  return (session as { user?: { id?: string } } | null)?.user?.id || null;
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;
    const body = await req.json();
    if (!body.stage) {
      return NextResponse.json({ error: "Stage is required" }, { status: 400 });
    }

    const result = await approveStage(id, body.stage as WorkflowStage, sessionUserId(session));
    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Approve Stage Error:", error);
    const status = typeof error === "object" && error && "status" in error ? Number((error as { status?: number }).status) : 500;
    const message = error instanceof Error ? error.message : "Failed to approve stage";
    return NextResponse.json({ error: message }, { status });
  }
}

