import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { createProject, listProjects } from "@/lib/workflow-service";

function sessionUserId(session: unknown) {
  return (session as { user?: { id?: string } } | null)?.user?.id || null;
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  try {
    const body = await req.json();
    const { idea } = body;

    if (!idea || typeof idea !== "string" || !idea.trim()) {
      return NextResponse.json({ error: "Idea is required" }, { status: 400 });
    }

    const project = await createProject(idea.trim(), sessionUserId(session));

    return NextResponse.json(project);
  } catch (error) {
    console.error("Workspace POST Error:", error);
    return NextResponse.json({ error: "Failed to save project" }, { status: 500 });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);

  try {
    const projects = await listProjects(sessionUserId(session));
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Workspace GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

