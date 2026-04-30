import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { approveBlueprint, generateBlueprint, runBlueprintLens } from "@/lib/workflow-service";
import { LensType } from "@/lib/workflow";

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
    if (body.action === "generate") return NextResponse.json(await generateBlueprint(projectId, sessionUserId(session)));
    if (body.action === "approve") return NextResponse.json(await approveBlueprint(projectId, sessionUserId(session)));
    const lens = String(body.lens || "PRODUCT").toUpperCase() as LensType;
    return NextResponse.json(await runBlueprintLens(projectId, lens, sessionUserId(session)));
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Blueprint review failed" }, { status: statusFromError(error) });
  }
}
