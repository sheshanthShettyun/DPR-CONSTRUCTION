import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateRisksAndMilestones, type IntakeInput } from "@/lib/riskEngine";

export async function GET() {
  const intakes = await prisma.projectIntake.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, location: true, projectType: true, createdAt: true },
  });
  return NextResponse.json(intakes);
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as IntakeInput;

  const { risks, milestones } = generateRisksAndMilestones(body);

  const intake = await prisma.projectIntake.create({
    data: {
      name: body.name,
      location: body.location,
      projectType: body.projectType,
      budget: body.budget,
      startDate: body.startDate,
      targetDate: body.targetDate,
      crewSize: body.crewSize,
      scale: body.scale,
      siteConditions: body.siteConditions,
      risks: { create: risks.map((r, i) => ({ ...r, position: i })) },
      milestones: { create: milestones.map((m, i) => ({ ...m, position: i })) },
    },
    include: {
      risks: { orderBy: { position: "asc" } },
      milestones: { orderBy: { position: "asc" } },
    },
  });

  return NextResponse.json(intake, { status: 201 });
}
