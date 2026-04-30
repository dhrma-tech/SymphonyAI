import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getSessionGraph, putSessionGraph } from "@/lib/workflow-service";

function sessionUserId(session: unknown) {
  return (session as { user?: { id?: string } } | null)?.user?.id || null;
}

function statusFromError(error: unknown) {
  return typeof error === "object" && error && "status" in error ? Number((error as { status?: number }).status) : 500;
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const projectId = new URL(req.url).searchParams.get("projectId") || "";
    if (!projectId) return NextResponse.json({ error: "projectId is required" }, { status: 400 });
    return NextResponse.json(await getSessionGraph(projectId, sessionUserId(session)));
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to fetch session graph" }, { status: statusFromError(error) });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json().catch(() => ({}));
    const projectId = String(body.projectId || "");
    if (!projectId || !body.sessionGraph) return NextResponse.json({ error: "projectId and sessionGraph are required" }, { status: 400 });
    return NextResponse.json(await putSessionGraph(projectId, body.sessionGraph, sessionUserId(session)));
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to update session graph" }, { status: statusFromError(error) });
  }
}
