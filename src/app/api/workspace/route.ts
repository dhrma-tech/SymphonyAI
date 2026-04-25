import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const projects = await db.project.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" },
    });
    return NextResponse.json(projects);
  } catch (error) {
    return new NextResponse("Database Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, title, idea, synopsis, features, design, phases, activeStage, status } = body;

    const projectData = {
      title: title || "Untitled Project",
      idea: idea || "",
      synopsis: synopsis || "",
      features: features || "[]",
      design: design || "{}",
      phases: phases || "[]",
      activePhase: activeStage || 1,
      status: status || "Ideation",
      userId: session.user.id,
    };

    let project;
    if (id) {
      project = await db.project.update({
        where: { id, userId: session.user.id },
        data: projectData,
      });
    } else {
      project = await db.project.create({
        data: projectData,
      });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("POST Error:", error);
    return new NextResponse("Database Error", { status: 500 });
  }
}
