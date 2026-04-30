import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { answerBriefQuestion, createProject } from "@/lib/workflow-service";

function sessionUserId(session: unknown) {
  return (session as { user?: { id?: string } } | null)?.user?.id || null;
}

function statusFromError(error: unknown) {
  return typeof error === "object" && error && "status" in error ? Number((error as { status?: number }).status) : 500;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = sessionUserId(session);
    const body = await req.json().catch(() => ({}));
    const message = String(body.message || body.input || "").trim();
    if (!message) return NextResponse.json({ error: "Message is required" }, { status: 400 });

    let projectId = String(body.projectId || body.conversationId || "");
    let project = null;
    if (!projectId) {
      project = await createProject(message, userId);
      projectId = project.id;
    }

    const result = await answerBriefQuestion(projectId, message, userId);
    return NextResponse.json({ ...result, project: result.project, conversation: result.project });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Workspace chat failed" },
      { status: statusFromError(error) }
    );
  }
}
