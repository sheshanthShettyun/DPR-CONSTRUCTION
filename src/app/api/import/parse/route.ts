import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { extractText } from "unpdf";

export type ColRole = "name" | "price" | "qty" | "ignore";

const NAME_KEYS = ["item", "utility", "utilities", "name", "description", "material", "materials", "product", "particular"];
const PRICE_KEYS = ["price", "cost", "rate", "amount", "unit price", "unitprice", "unit cost", "value", "total"];
const QTY_KEYS = ["qty", "quantity", "count", "units", "stock", "nos", "number"];

function guessRole(header: string): ColRole {
  const h = header.trim().toLowerCase();
  if (NAME_KEYS.some((k) => h === k || h.includes(k))) return "name";
  if (QTY_KEYS.some((k) => h === k || h.includes(k))) return "qty";
  if (PRICE_KEYS.some((k) => h === k || h.includes(k))) return "price";
  return "ignore";
}

function parseSheet(buffer: Buffer, isCsv: boolean) {
  const wb = XLSX.read(buffer, { type: isCsv ? "string" : "buffer", ...(isCsv ? {} : {}) });
  const csvBuffer = isCsv ? buffer.toString("utf-8") : undefined;
  const book = isCsv ? XLSX.read(csvBuffer, { type: "string" }) : wb;
  const sheet = book.Sheets[book.SheetNames[0]];
  if (!sheet) return { columns: [] as string[], rows: [] as Record<string, string>[] };
  const grid = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: "" });
  const nonEmpty = grid.filter((r) => r.some((c) => String(c).trim() !== ""));
  if (nonEmpty.length < 2) return { columns: [] as string[], rows: [] as Record<string, string>[] };
  const columns = nonEmpty[0].map((c, i) => String(c).trim() || `Column ${i + 1}`);
  const rows = nonEmpty.slice(1).map((r) => {
    const obj: Record<string, string> = {};
    columns.forEach((col, i) => {
      obj[col] = String(r[i] ?? "").trim();
    });
    return obj;
  });
  return { columns, rows };
}

const HEADER_HINTS = ["item", "price", "qty", "quantity", "amount", "cost", "rate", "name", "description", "unit", "particulars"];

function foldHeader(toks: string[]): string[] {
  if (toks.length === 3) return toks;
  if (toks.length < 3) return toks;
  return [toks[0], toks.slice(1, -1).join(" "), toks[toks.length - 1]];
}

function splitCells(line: string): string[] {
  // Strategy 1: 2+ spaces / tabs / pipes (nicely formatted PDFs)
  const wide = line.split(/\s{2,}|\t|\|/).map((c) => c.trim()).filter(Boolean);
  if (wide.length >= 2) return wide;
  // Strategy 2: single spaces, but the line ends in two numbers: "<name> <price> <qty>"
  const m = line.match(/^(.+?)\s+([\d,.]+)\s+([\d,.]+)\s*$/);
  if (m) return [m[1].trim(), m[2], m[3]];
  return [line.trim()].filter(Boolean);
}

async function parsePdf(buffer: Buffer) {
  let text: string;
  try {
    const result = (await extractText(new Uint8Array(buffer))) as { text: string | string[] };
    text = Array.isArray(result.text) ? result.text.join("\n") : (result.text ?? "");
    if (!text.trim()) throw new Error("empty");
  } catch (e) {
    console.error("pdf extract detail:", e instanceof Error ? e.message : e);
    throw new Error("PDF text could not be extracted (scanned image? try Excel/CSV instead)");
  }
  const rawLines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  // Pre-scan for a real header line (single-spaced headers never survive cell splitting)
  let columns: string[] | null = null;
  let dataLines: string[][];
  {
    let found: string[] | null = null;
    for (const l of rawLines) {
      const toks = l.split(/\s+/);
      const hits = toks.filter((t) => HEADER_HINTS.includes(t.toLowerCase())).length;
      if (toks.length >= 2 && hits >= 2) {
        found = foldHeader(toks);
        break;
      }
    }
    const lines = rawLines
      .map((l) => splitCells(l))
      .filter((cells) => cells.length >= 2);
    if (lines.length < 2) throw new Error("No readable table found in this PDF");
    if (found) {
      columns = found;
      dataLines = lines;
    } else {
      const headerIdx = lines.findIndex((cells: string[]) => cells.filter((c: string) => isNaN(Number(String(c).replace(/,/g, "")))).length >= 2);
      const head = headerIdx >= 0 ? headerIdx : 0;
      const rawHead = lines[head];
      // Fold middle tokens so "Item Unit Price Qty" -> ["Item", "Unit Price", "Qty"]
      columns =
        rawHead.length === 3
          ? rawHead
          : [rawHead[0], rawHead.slice(1, -1).join(" ") || `Column 2`, rawHead[rawHead.length - 1] || `Column 3`];
      dataLines = lines.slice(head + 1);
    }
  }
  const rows = dataLines.map((cells: string[]) => {
    const obj: Record<string, string> = {};
    columns.forEach((col: string, i: number) => {
      obj[col] = cells[i] ?? "";
    });
    return obj;
  });
  return { columns, rows };
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: "File must be under 5MB" }, { status: 400 });

    const name = file.name.toLowerCase();
    const buffer = Buffer.from(await file.arrayBuffer());

    let parsed;
    if (name.endsWith(".pdf")) {
      parsed = await parsePdf(buffer);
    } else if (name.endsWith(".csv")) {
      parsed = parseSheet(buffer, true);
    } else if (name.endsWith(".xlsx") || name.endsWith(".xls")) {
      parsed = parseSheet(buffer, false);
    } else {
      return NextResponse.json({ error: "Unsupported file. Upload .xlsx, .xls, .csv, or .pdf" }, { status: 400 });
    }

    const rows = parsed.rows.slice(0, 200);
    const mapping: Record<string, ColRole> = {};
    parsed.columns.forEach((c: string) => {
      mapping[c] = guessRole(c);
    });
    // Ensure at least a name column: first text-heavy column
    if (!Object.values(mapping).includes("name") && parsed.columns.length > 0) {
      mapping[parsed.columns[0]] = "name";
    }

    return NextResponse.json({ filename: file.name, columns: parsed.columns, rows, mapping });
  } catch (e) {
    console.error("import parse error:", e);
    const msg = e instanceof Error ? e.message : "Could not read this file";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
