import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import PDFDocument from "pdfkit";
import { getStockSummary } from "@/app/api/utility-stock/route";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PDFDoc = any;

const INK = "#111111";
const MUTED = "#6b7280";
const FAINT = "#e5e7eb";
const PANEL = "#f4f4f5";
const ZEBRA = "#f7f7f5";
let REG = "Helvetica";
let BOLD = "Helvetica-Bold";

function setupFonts(doc: PDFDoc) {
  try {
    const root = process.cwd();
    doc.registerFont("Outfit", root + "/src/lib/fonts/outfit-400.ttf");
    doc.registerFont("Outfit-Bold", root + "/src/lib/fonts/outfit-700.ttf");
    REG = "Outfit";
    BOLD = "Outfit-Bold";
  } catch {
    REG = "Helvetica";
    BOLD = "Helvetica-Bold";
  }
}

const LEFT = 48;
const RIGHT = 547;
const WIDTH = RIGHT - LEFT;

interface OrderLine {
  id: string;
  route: string;
  load: string;
  status: string;
  eta: string;
}

interface StockLine {
  title: string;
  qty: number;
  level: string;
}

function headerBand(doc: PDFDoc, projectName: string) {
  doc.save();
  doc.fillColor(INK).rect(0, 0, 595, 118).fill();
  doc.fillColor("#ffffff").rect(LEFT, 32, 10, 10).fill();
  doc.fillColor("#ffffff").font(BOLD).fontSize(11).text("DPR CONSTRUCTION", LEFT + 18, 31);
  doc.fillColor("#ffffff").font(BOLD).fontSize(24).text("Site Operations Report", LEFT, 50);
  doc
    .fillColor("#b6b6b6")
    .font(REG)
    .fontSize(10)
    .text(
      `${projectName}  ·  ${new Date().toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}`,
      LEFT,
      82
    );
  doc.restore();
  doc.y = 140;
}

function kpiRow(doc: PDFDoc, kpis: { label: string; value: string }[]) {
  const gap = 12;
  const w = (WIDTH - gap * (kpis.length - 1)) / kpis.length;
  const y0 = doc.y;
  const h = 64;
  kpis.forEach((k, i) => {
    const x = LEFT + i * (w + gap);
    doc.save();
    doc.fillColor(PANEL).roundedRect(x, y0, w, h, 10).fill();
    doc.strokeColor(FAINT).lineWidth(1).roundedRect(x, y0, w, h, 10).stroke();
    doc.fillColor(MUTED).font(BOLD).fontSize(8).text(k.label.toUpperCase(), x + 14, y0 + 12);
    doc.fillColor(INK).font(BOLD).fontSize(22).text(k.value, x + 14, y0 + 28);
    doc.restore();
  });
  doc.y = y0 + h + 18;
}

/** Boxed section: renders content, then strokes a border box around it.
    The border is skipped when content spills across pages (coordinates reset per page). */
function boxedSection(doc: PDFDoc, title: string, count: string, body: () => void) {
  if (doc.y > 700) doc.addPage();
  const y0 = doc.y;
  const pagesBefore = doc.bufferedPageRange().count;
  doc.font(BOLD).fontSize(13).fillColor(INK).text(title, LEFT + 12, y0 + 12);
  const w = doc.widthOfString(title);
  doc.font(REG).fontSize(9).fillColor(MUTED).text(count, LEFT + 12 + w + 10, y0 + 15);
  doc.y = y0 + 36;
  body();
  if (doc.bufferedPageRange().count !== pagesBefore) {
    doc.y += 16;
    return;
  }
  const y1 = doc.y + 12;
  doc.save();
  doc.strokeColor(FAINT).lineWidth(1).roundedRect(LEFT, y0, WIDTH, y1 - y0, 10).stroke();
  doc.restore();
  doc.y = y1 + 16;
}

function tableHead(doc: PDFDoc, cols: { label: string; x: number; width: number; align: "left" | "right" }[]) {
  const y0 = doc.y;
  doc.save();
  doc.fillColor(PANEL).roundedRect(LEFT + 12, y0, WIDTH - 24, 22, 6).fill();
  doc.fillColor(MUTED).font(BOLD).fontSize(9);
  for (const c of cols) doc.text(c.label, c.x, y0 + 7, { width: c.width, align: c.align });
  doc.restore();
  doc.y = y0 + 22;
}

function tableRow(doc: PDFDoc, cells: { text: string; x: number; width: number; align: "left" | "right"; bold?: boolean }[], zebra: boolean) {
  if (doc.y > 745) doc.addPage();
  const y0 = doc.y;
  const h = 24;
  if (zebra) {
    doc.save();
    doc.fillColor(ZEBRA).rect(LEFT + 12, y0, WIDTH - 24, h).fill();
    doc.restore();
  }
  for (const c of cells) {
    doc
      .fillColor(c.bold ? INK : MUTED)
      .font(c.bold ? BOLD : REG)
      .fontSize(10)
      .text(c.text, c.x, y0 + 7, { width: c.width, align: c.align });
  }
  // First cell (item name) prints dark
  doc.y = y0 + h;
}

function itemRow(doc: PDFDoc, title: string, right: string, zebra: boolean) {
  tableRow(
    doc,
    [
      { text: title, x: LEFT + 24, width: WIDTH - 190, align: "left", bold: true },
      { text: right, x: LEFT + WIDTH - 150, width: 126, align: "right" },
    ],
    zebra
  );
}

function emptyNote(doc: PDFDoc, msg: string) {
  doc.fillColor(MUTED).font(REG).fontSize(10).text(msg, LEFT + 24, doc.y + 4);
  doc.y += 22;
}

function footer(doc: PDFDoc) {
  const y = 800;
  doc.save();
  doc.strokeColor(FAINT).lineWidth(1).moveTo(LEFT, y).lineTo(RIGHT, y).stroke();
  doc.fillColor(MUTED).font(REG).fontSize(8);
  doc.text("DPR Construction — Daily Task Planning & Inventory Management", LEFT, y + 8);
  doc.text("Confidential — do not distribute", LEFT, y + 20);
  doc.text(`Page ${doc.bufferedPageRange().count}`, RIGHT - 60, y + 8, { width: 60, align: "right" });
  doc.restore();
}

function generatePdf(
  projectName: string,
  summary: { totalItems: number; available: number; lowStock: number },
  delivered: OrderLine[],
  pending: OrderLine[],
  inStock: StockLine[],
  lowStock: StockLine[]
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    const doc = new PDFDocument({ margin: 0, size: "A4", bufferPages: true });
    try {
      const root = process.cwd();
      doc.registerFont(REG, root + "/src/lib/fonts/outfit-400.ttf");
      doc.registerFont(BOLD, root + "/src/lib/fonts/outfit-700.ttf");
    } catch {
      // fall back to built-in fonts below
    }

    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    headerBand(doc, projectName);

    kpiRow(doc, [
      { label: "Stock units", value: summary.totalItems.toLocaleString() },
      { label: "Delivered orders", value: String(delivered.length) },
      { label: "Pending orders", value: String(pending.length) },
      { label: "Low / out items", value: String(lowStock.length) },
    ]);

    boxedSection(doc, "Delivered", `${delivered.length} orders`, () => {
      if (delivered.length === 0) return emptyNote(doc, "No delivered orders yet.");
      tableHead(doc, [
        { label: "ORDER", x: LEFT + 24, width: 90, align: "left" },
        { label: "ROUTE", x: LEFT + 120, width: WIDTH - 280, align: "left" },
        { label: "LOAD", x: LEFT + WIDTH - 150, width: 126, align: "right" },
      ]);
      delivered.forEach((o, i) =>
        tableRow(
          doc,
          [
            { text: o.id, x: LEFT + 24, width: 90, align: "left", bold: true },
            { text: o.route, x: LEFT + 120, width: WIDTH - 280, align: "left" },
            { text: o.load, x: LEFT + WIDTH - 150, width: 126, align: "right" },
          ],
          i % 2 === 1
        )
      );
    });

    boxedSection(doc, "Pending", `${pending.length} orders`, () => {
      if (pending.length === 0) return emptyNote(doc, "Nothing pending — all orders delivered.");
      tableHead(doc, [
        { label: "ORDER", x: LEFT + 24, width: 80, align: "left" },
        { label: "ROUTE", x: LEFT + 110, width: WIDTH - 330, align: "left" },
        { label: "STATUS", x: LEFT + WIDTH - 210, width: 90, align: "left" },
        { label: "ETA", x: LEFT + WIDTH - 110, width: 86, align: "right" },
      ]);
      pending.forEach((o, i) =>
        tableRow(
          doc,
          [
            { text: o.id, x: LEFT + 24, width: 80, align: "left", bold: true },
            { text: o.route, x: LEFT + 110, width: WIDTH - 330, align: "left" },
            { text: o.status, x: LEFT + WIDTH - 210, width: 90, align: "left", bold: true },
            { text: o.eta, x: LEFT + WIDTH - 110, width: 86, align: "right" },
          ],
          i % 2 === 1
        )
      );
    });

    boxedSection(doc, "In stock", `${inStock.length} items · ${summary.available.toLocaleString()} units`, () => {
      if (inStock.length === 0) return emptyNote(doc, "No stocked items recorded.");
      tableHead(doc, [
        { label: "ITEM", x: LEFT + 24, width: WIDTH - 190, align: "left" },
        { label: "QTY", x: LEFT + WIDTH - 150, width: 126, align: "right" },
      ]);
      inStock.forEach((it, i) => itemRow(doc, it.title, `${it.qty} units`, i % 2 === 1));
    });

    boxedSection(doc, "Low / out of stock", `${lowStock.length} items`, () => {
      if (lowStock.length === 0) return emptyNote(doc, "Everything is sufficiently stocked.");
      tableHead(doc, [
        { label: "ITEM", x: LEFT + 24, width: WIDTH - 190, align: "left" },
        { label: "QTY", x: LEFT + WIDTH - 150, width: 126, align: "right" },
      ]);
      lowStock.forEach((it, i) => itemRow(doc, `${it.title}  ·  ${it.level}`, `${it.qty} left`, i % 2 === 1));
    });

    footer(doc);
    doc.end();
  });
}

export async function GET(request: NextRequest) {
  try {
    const projectId = new URL(request.url).searchParams.get("projectId");
    const where = projectId ? { projectId } : {};
    const [summary, orders, cards, project] = await Promise.all([
      getStockSummary(projectId),
      prisma.order.findMany({
        where,
        orderBy: { createdAt: "asc" },
        select: { id: true, from: true, to: true, load: true, status: true, eta: true },
      }),
      prisma.taskCard.findMany({
        where,
        orderBy: { title: "asc" },
        select: { title: true, qty: true, level: true },
      }),
      projectId ? prisma.project.findUnique({ where: { id: projectId }, select: { name: true } }) : null,
    ]);

    if (summary.totalItems === 0 && orders.length === 0 && cards.length === 0) {
      return NextResponse.json({ error: "No data found for this report" }, { status: 404 });
    }

    const isLow = (level: string) => level === "Low" || level === "Critical";
    const delivered: OrderLine[] = orders
      .filter((o) => o.status === "Delivered")
      .map((o) => ({ id: o.id, route: `${o.from} - ${o.to}`, load: o.load, status: o.status, eta: o.eta }));
    const pending: OrderLine[] = orders
      .filter((o) => o.status !== "Delivered")
      .map((o) => ({ id: o.id, route: `${o.from} - ${o.to}`, load: o.load, status: o.status, eta: o.eta }));
    const inStock: StockLine[] = [
      ...cards
        .filter((c) => !isLow(c.level) && (c.qty || 0) > 0)
        .map((c) => ({ title: c.title, qty: c.qty || 0, level: c.level })),
      ...(summary.unassigned > 0
        ? [{ title: "General stock (unassigned)", qty: summary.unassigned, level: "Plenty" }]
        : []),
    ];
    const lowStock: StockLine[] = cards
      .filter((c) => isLow(c.level))
      .sort((a, b) => (a.qty || 0) - (b.qty || 0))
      .map((c) => ({ title: c.title, qty: c.qty || 0, level: c.level }));

    const pdfBuffer = await generatePdf(project?.name ?? "All projects", summary, delivered, pending, inStock, lowStock);
    const filename = "Site_Operations_Report_" + new Date().toISOString().split("T")[0] + ".pdf";

    return new NextResponse(pdfBuffer as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="' + filename + '"',
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
  }
}
