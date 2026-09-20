import { NextRequest, NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import { getStockSummary } from "@/app/api/utility-stock/route";

interface Stock {
  totalItems: number;
  available: number;
  lowStock: number;
}

function generatePdf(
  stock: Stock,
  pct: number,
  lowPct: number
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];

    const doc = new PDFDocument({
      margin: 40,
      size: "A4",
      layout: "portrait",
    });

    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    // Page header
    doc.fontSize(20).text("Utility Stock Report", { align: "center" });
    doc.moveDown(0.5);

    // Metadata line
    doc
      .fontSize(12)
      .text(
        "Generated: " + new Date().toLocaleDateString(),
        { align: "center" }
      )
      .moveDown(1.5);

    // Total items
    doc
      .fontSize(18)
      .text("Total Items: " + stock.totalItems, { align: "center" })
      .moveDown(0.5);

    // Available
    doc
      .fontSize(16)
      .text(
        "Available: " + stock.available + " (" + pct + "%)",
        { align: "center" }
      )
      .moveDown(0.5);

    // Low stock
    doc
      .fontSize(16)
      .text(
        "Low Stock: " + stock.lowStock + " (" + lowPct + "%)",
        { align: "center" }
      )
      .moveDown(1.5);

    // Stock Breakdown heading
    doc.fontSize(14).text("Stock Breakdown", { align: "center" });
    doc.moveDown(1);

    // Available details
    doc.fontSize(12).text("Available: " + stock.available + " items", {
      align: "left",
    });
    doc.moveDown(0.3);

    // Low stock details
    doc
      .fontSize(12)
      .text("Low Stock: " + stock.lowStock + " items", { align: "left" })
      .moveDown(1.5);

    // Progress bars - use fixed Y position tracking
    const barHeight = 20;
    const barWidth = 400;

    // Available progress bar background
    doc.fillColor("#333333").rect(50, doc.y, barWidth, barHeight).fill();

    // Available progress bar fill
    const availableWidth = (pct / 100) * barWidth;
    doc.fillColor("#e2f1a6").rect(50, doc.y, availableWidth, barHeight).fill();

    // Available percentage label
    doc.fillColor("#ffffff").fontSize(10).text(
      pct + "% available",
      50 + barWidth + 10,
      doc.y + 5
    );
    doc.moveDown(barHeight + 10);

    // Low stock progress bar background
    const lowBarWidth = (lowPct / 100) * barWidth;
    doc.fillColor("#333333").rect(50, doc.y, barWidth, barHeight).fill();

    // Low stock progress bar fill
    doc.fillColor("#ffd166").rect(50, doc.y, lowBarWidth, barHeight).fill();

    // Low stock percentage label
    doc.fillColor("#ffffff").fontSize(10).text(
      lowPct + "% low stock",
      50 + barWidth + 10,
      doc.y + 5
    );
    doc.moveDown(barHeight + 15);

    // Footer
    doc
      .fontSize(10)
      .text(
        "DPR Construction — Daily Task Planning & Inventory Management",
        { align: "center" }
      )
      .moveDown(0.5);

    doc
      .fontSize(9)
      .text(
        "Confidential — Do not distribute without authorization",
        { align: "center" }
      );

    doc.end();
  });
}

export async function GET(request: NextRequest) {
  try {
    const projectId = new URL(request.url).searchParams.get("projectId");
    const stock = await getStockSummary(projectId);

    if (stock.totalItems === 0) {
      return NextResponse.json(
        { error: "No utility stock data found" },
        { status: 404 }
      );
    }

    const pct =
      stock.totalItems > 0
        ? Math.round((stock.available / stock.totalItems) * 100)
        : 0;
    const lowPct =
      stock.totalItems > 0
        ? Math.round((stock.lowStock / stock.totalItems) * 100)
        : 0;

    const pdfBuffer = await generatePdf(
      {
        totalItems: stock.totalItems,
        available: stock.available,
        lowStock: stock.lowStock,
      },
      pct,
      lowPct
    );

    const filename =
      "Utility_Stock_Report_" +
      new Date().toISOString().split("T")[0] +
      ".pdf";

    return new NextResponse(pdfBuffer as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="' + filename + '"',
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}