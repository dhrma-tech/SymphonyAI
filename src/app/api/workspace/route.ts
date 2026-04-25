import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  try {
    const body = await req.json();
    const { title, idea, synopsis, features, design, phases } = body;

    const project = await db.project.create({
      data: {
        title,
        idea,
        synopsis: synopsis || "",
        features: JSON.stringify(features || []),
        design: JSON.stringify(design || {}),
        phases: JSON.stringify(phases || []),
        status: "Complete",
        activePhase: 1,
        userId: session?.user?.id || null, // Optional for now
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error("Workspace POST Error:", error);
    return NextResponse.json({ error: "Failed to save project" }, { status: 500 });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);

  try {
    const projects = await db.project.findMany({
      where: session?.user?.id ? { userId: session.user.id } : {}, // Filter if logged in
      orderBy: { updatedAt: "desc" },
      take: 20,
    });
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Workspace GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}
