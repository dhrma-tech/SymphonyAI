import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { approveArtifact } from "@/lib/workflow-service";

function sessionUserId(session: unknown) {
  return (session as { user?: { id?: string } } | null)?.user?.id || null;
}

function statusFromError(error: unknown) {
  return typeof error === "object" && error && "status" in error ? Number((error as { status?: number }).status) : 500;
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string; artifactId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id, artifactId } = await params;
    const body = await req.json().catch(() => ({}));
    const result = await approveArtifact(id, artifactId, String(body.approvalNote || ""), sessionUserId(session));
    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Approve Artifact Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to approve artifact" },
      { status: statusFromError(error) }
    );
  }
}

