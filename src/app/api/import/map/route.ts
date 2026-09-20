import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { suggestMappings } from "@/lib/itemMapper";

export async function POST(req: NextRequest) {
  try {
    const { items, projectId } = (await req.json()) as { items: string[]; projectId?: string | null };
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items to map" }, { status: 400 });
    }
    const categories = await prisma.expenseCategory.findMany({
      where: projectId ? { projectId } : {},
      orderBy: { position: "asc" },
      select: { id: true, name: true },
    });
    const suggestions = await suggestMappings(items.slice(0, 200), categories);
    return NextResponse.json({
      categories,
      suggestions,
      engine:
        process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY
          ? "ai"
          : "local",
    });
  } catch (e) {
    console.error("import map error:", e);
    return NextResponse.json({ error: "Mapping failed" }, { status: 500 });
  }
}
