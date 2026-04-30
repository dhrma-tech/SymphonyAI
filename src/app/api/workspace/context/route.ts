import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getWorkspaceContext, updateWorkspaceContext } from "@/lib/workflow-service";

function sessionUserId(session: unknown) {
  return (session as { user?: { id?: string } } | null)?.user?.id || null;
}

function statusFromError(error: unknown) {
  return typeof error === "object" && error && "status" in error ? Number((error as { status?: number }).status) : 500;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  return NextResponse.json(await getWorkspaceContext(sessionUserId(session)));
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json().catch(() => ({}));
    return NextResponse.json(await updateWorkspaceContext(body, sessionUserId(session)));
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Workspace context update failed" }, { status: statusFromError(error) });
  }
}
