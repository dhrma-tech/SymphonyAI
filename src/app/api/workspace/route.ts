import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, idea, synopsis, features, design, phases, activePhase } = body;

    const project = await prisma.project.create({
      data: {
        title,
        idea,
        synopsis,
        features: JSON.stringify(features),
        design: JSON.stringify(design),
        phases: JSON.stringify(phases),
        activePhase,
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error("Workspace POST Error:", error);
    return NextResponse.json({ error: "Failed to save project" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { updatedAt: "desc" },
    });
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Workspace GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}
