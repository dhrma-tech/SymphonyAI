import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { listRuns } from "@/lib/workflow-service";

function sessionUserId(session: unknown) {
  return (session as { user?: { id?: string } } | null)?.user?.id || null;
}

function statusFromError(error: unknown) {
  return typeof error === "object" && error && "status" in error ? Number((error as { status?: number }).status) : 500;
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  void req;
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;
    const runs = await listRuns(id, sessionUserId(session));
    return NextResponse.json(runs);
  } catch (error: unknown) {
    console.error("List Runs Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch runs" },
      { status: statusFromError(error) }
    );
  }
}
