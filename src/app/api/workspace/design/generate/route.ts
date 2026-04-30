import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { approveDesign, generateDesign } from "@/lib/workflow-service";

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
    const projectId = String(body.projectId || "");
    if (!projectId) return NextResponse.json({ error: "projectId is required" }, { status: 400 });
    if (body.action === "approve") return NextResponse.json(await approveDesign(projectId, body.designChoices || body.choices, sessionUserId(session)));
    return NextResponse.json(await generateDesign(projectId, sessionUserId(session)));
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Design generation failed" }, { status: statusFromError(error) });
  }
}
