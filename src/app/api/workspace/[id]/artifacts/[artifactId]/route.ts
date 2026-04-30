import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { updateArtifact } from "@/lib/workflow-service";

function sessionUserId(session: unknown) {
  return (session as { user?: { id?: string } } | null)?.user?.id || null;
}

function statusFromError(error: unknown) {
  return typeof error === "object" && error && "status" in error ? Number((error as { status?: number }).status) : 500;
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string; artifactId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id, artifactId } = await params;
    const body = await req.json();

    if (!body.structured) {
      return NextResponse.json({ error: "structured artifact payload is required" }, { status: 400 });
    }

    const result = await updateArtifact(id, artifactId, body.structured, sessionUserId(session));
    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Update Artifact Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update artifact" },
      { status: statusFromError(error) }
    );
  }
}

