"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Upload, FileSpreadsheet } from "lucide-react";
import type { ColRole } from "@/app/api/import/parse/route";

interface RawRow {
  [col: string]: string;
}

interface MappedRow {
  name: string;
  amount: number;
  qty: number;
}

const ROLES: ColRole[] = ["name", "price", "qty", "ignore"];
const ROLE_LABEL: Record<ColRole, string> = { name: "Item name", price: "Price", qty: "Quantity", ignore: "Ignore" };

function num(v: string): number {
  const n = Number(String(v ?? "").replace(/[^0-9.\-]/g, ""));
  return isNaN(n) ? 0 : n;
}

export default function ImportSheetModal({
  open,
  onClose,
  onImported,
  projectId,
}: {
  open: boolean;
  onClose: () => void;
  onImported?: () => void;
  projectId?: string | null;
}) {
  const [mounted, setMounted] = useState(false);
  const [filename, setFilename] = useState("");
  const [columns, setColumns] = useState<string[]>([]);
  const [rows, setRows] = useState<RawRow[]>([]);
  const [mapping, setMapping] = useState<Record<string, ColRole>>({});
  const [toExpenses, setToExpenses] = useState(true);
  const [toStock, setToStock] = useState(true);
  const [parsing, setParsing] = useState(false);
  const [importing, setImporting] = useState(false);
  const [mappingItems, setMappingItems] = useState(false);
  const [catOptions, setCatOptions] = useState<{ id: number; name: string }[]>([]);
  const [itemCats, setItemCats] = useState<Record<string, number | null>>({});
  const [mapEngine, setMapEngine] = useState<"ai" | "local">("local");
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ categoriesAdded: number; totalCost: number; unitsAdded: number; cardsAdded: number } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      setFilename("");
      setColumns([]);
      setRows([]);
      setMapping({});
      setError("");
      setResult(null);
      setToExpenses(true);
      setToStock(true);
      setCatOptions([]);
      setItemCats({});
    }
  }, [open ]);

  const pickFile = async (file: File | undefined) => {
    if (!file) return;
    setError("");
    setResult(null);
    setParsing(true);
    const form = new FormData();
    form.append("file", file);
    const r = await fetch("/api/import/parse", { method: "POST", body: form });
    const d = await r.json();
    setParsing(false);
    if (!r.ok) {
      setError(d.error ?? "Could not read this file");
      return;
    }
    setFilename(d.filename);
    setColumns(d.columns);
    setRows(d.rows);
    setMapping(d.mapping);
    // AI-map item names onto existing categories
    const nameCol = d.columns.find((c: string) => d.mapping[c] === "name");
    const names = [...new Set((d.rows as RawRow[]).map((r) => String(r[nameCol] ?? "").trim()).filter(Boolean))];
    if (nameCol && names.length > 0) {
      setMappingItems(true);
      const mr = await fetch("/api/import/map", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: names, projectId: projectId ?? null }),
      });
      const md = await mr.json();
      setMappingItems(false);
      if (mr.ok) {
        setCatOptions(md.categories);
        setMapEngine(md.engine);
        const preset: Record<string, number | null> = {};
        for (const s of md.suggestions as { item: string; categoryId: number | null }[]) {
          preset[s.item] = s.categoryId;
        }
        setItemCats(preset);
      }
    }
  };

  const mapped: MappedRow[] = rows.map((row) => {
    const get = (role: ColRole) => {
      const col = columns.find((c) => mapping[c] === role);
      return col ? row[col] ?? "" : "";
    };
    return { name: get("name").trim(), amount: num(get("price")), qty: Math.max(0, Math.floor(num(get("qty")))) };
  });
  const valid = mapped.filter((r) => r.name && (r.amount > 0 || r.qty > 0));
  const totalCost = valid.reduce((s, r) => s + (r.qty > 0 ? r.amount * r.qty : r.amount), 0);
  const totalUnits = valid.reduce((s, r) => s + r.qty, 0);

  const doImport = async () => {
    setError("");
    setImporting(true);
    const payload = valid.map((r) => ({ ...r, categoryId: itemCats[r.name] ?? null }));
    const r = await fetch("/api/import/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rows: payload, targets: { expenses: toExpenses, stock: toStock }, projectId: projectId ?? null }),
    });
    const d = await r.json();
    setImporting(false);
    if (!r.ok) {
      setError(d.error ?? "Import failed");
      return;
    }
    setResult(d);
    onImported?.();
    // Hand off to the dashboard takeover: brief confirm, then blur + buffering loader
    setTimeout(() => {
      onClose();
      window.dispatchEvent(new Event("dpr:import-start"));
      window.dispatchEvent(new Event("dpr:refresh"));
      setTimeout(() => window.dispatchEvent(new Event("dpr:import-done")), 2300);
    }, 900);
  };

  const close = () => {
    onClose();
  };

  if (!mounted) return null;

  return createPortal(
    open && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4" onClick={close}>
        <div
          onClick={(e) => e.stopPropagation()}
          className="dashboard-card max-h-[85vh] w-full max-w-[640px] overflow-y-auto"
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileSpreadsheet size={15} className="text-[#e2f1a6]" />
              <h2 className="text-[15px] font-medium tracking-wide text-white">Import utilities sheet</h2>
            </div>
            <button onClick={close} className="text-[#8c8c8c] transition-colors hover:text-white">
              <X size={16} />
            </button>
          </div>

          {columns.length === 0 ? (
            <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-white/10 bg-[#1f1f1f] px-6 py-10 text-center transition-colors hover:border-white/25">
              <Upload size={22} className="text-[#8c8c8c]" />
              <span className="text-[13px] text-white">{parsing ? "Reading file…" : "Drop an Excel, CSV, or PDF sheet here, or click to browse"}</span>
              <span className="text-[11px] text-[#6b7280]">.xlsx, .xls, .csv, .pdf — up to 5MB</span>
              <input
                type="file"
                accept=".xlsx,.xls,.csv,.pdf"
                className="hidden"
                onChange={(e) => pickFile(e.target.files?.[0])}
              />
            </label>
          ) : result ? (
            <div className="flex flex-col items-center gap-2 py-6 text-center">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e2f1a6]/15 text-lg text-[#e2f1a6]">✓</span>
              <h3 className="text-[15px] font-semibold text-white">Import complete</h3>
              <p className="text-[12px] text-[#8c8c8c]">
                {result.categoriesAdded > 0 && `${result.categoriesAdded} categories · $${result.totalCost.toLocaleString()} `}
                {result.unitsAdded > 0 && `${result.unitsAdded} units added to stock `}
                {result.cardsAdded > 0 && `· ${result.cardsAdded} utility cards`}
              </p>
              <button
                onClick={close}
                className="mt-3 rounded-lg bg-[#e2f1a6] px-5 py-2 text-[13px] font-semibold text-black hover:bg-[#d4f05a]"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              <p className="mb-3 text-[12px] text-[#8c8c8c]">
                <span className="text-white">{filename}</span> · {rows.length} rows · tell us what each column is
              </p>
              <div className="mb-3 flex flex-wrap gap-2">
                {columns.map((col) => (
                  <label key={col} className="flex items-center gap-2 rounded-lg bg-[#1f1f1f] px-2.5 py-1.5">
                    <span className="max-w-[120px] truncate text-[11px] text-white">{col}</span>
                    <select
                      value={mapping[col] ?? "ignore"}
                      onChange={(e) => setMapping({ ...mapping, [col]: e.target.value as ColRole })}
                      className="rounded bg-black/40 px-1.5 py-1 text-[11px] text-[#e2f1a6] outline-none"
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>
                          {ROLE_LABEL[r]}
                        </option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>

              {(mappingItems || Object.keys(itemCats).length > 0) && (
                <div className="mb-3 rounded-xl bg-[#1f1f1f] p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[9px] font-medium uppercase tracking-wider text-[#8c8c8c]">
                      Map items to categories
                    </span>
                    <span className="rounded-full bg-[#e2f1a6]/10 px-1.5 py-0.5 text-[9px] font-medium text-[#e2f1a6]">
                      {mappingItems ? "matching…" : mapEngine === "ai" ? "✦ AI matched" : "auto matched"}
                    </span>
                  </div>
                  <div className="flex max-h-[132px] flex-col gap-1.5 overflow-y-auto">
                    {Object.keys(itemCats).map((item) => (
                      <div key={item} className="flex items-center gap-2">
                        <span className="min-w-0 flex-1 truncate text-[12px] text-white">{item}</span>
                        <span className="text-[11px] text-[#52525b]">→</span>
                        <select
                          value={itemCats[item] ?? "new"}
                          onChange={(e) =>
                            setItemCats({
                              ...itemCats,
                              [item]: e.target.value === "new" ? null : Number(e.target.value),
                            })
                          }
                          className="max-w-[170px] rounded bg-black/40 px-1.5 py-1 text-[11px] text-[#e2f1a6] outline-none"
                        >
                          <option value="new">+ New category</option>
                          {catOptions.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                    {Object.keys(itemCats).length === 0 && (
                      <p className="py-1 text-[11px] text-[#6b7280]">Matching items…</p>
                    )}
                  </div>
                  <p className="mt-2 text-[10px] leading-relaxed text-[#6b7280]">
                    Matched items merge their cost into that category. Unmatched items create a new category.
                  </p>
                </div>
              )}

              <div className="mb-3 max-h-[220px] overflow-y-auto rounded-xl bg-[#1f1f1f]">
                <div className="grid grid-cols-[2fr_1fr_1fr] gap-2 border-b border-white/5 px-3 py-2 text-[9px] font-medium uppercase tracking-wider text-[#8c8c8c]">
                  <span>Item</span>
                  <span className="text-right">Price</span>
                  <span className="text-right">Qty</span>
                </div>
                {valid.slice(0, 10).map((r, i) => (
                  <div key={i} className="grid grid-cols-[2fr_1fr_1fr] gap-2 border-b border-white/5 px-3 py-1.5 text-[12px] last:border-0">
                    <span className="truncate text-white">{r.name}</span>
                    <span className="text-right text-[#8c8c8c]">${r.amount.toLocaleString()}</span>
                    <span className="text-right text-[#8c8c8c]">{r.qty}</span>
                  </div>
                ))}
                {valid.length === 0 && (
                  <p className="px-3 py-4 text-center text-[12px] text-[#6b7280]">No usable rows — map an item column and a price or quantity column.</p>
                )}
                {valid.length > 10 && (
                  <p className="px-3 py-2 text-center text-[11px] text-[#6b7280]">+ {valid.length - 10} more rows</p>
                )}
              </div>

              <div className="mb-4 flex items-center gap-4 text-[12px] text-[#8c8c8c]">
                <label className="flex cursor-pointer items-center gap-2">
                  <input type="checkbox" checked={toExpenses} onChange={(e) => setToExpenses(e.target.checked)} className="h-3.5 w-3.5 accent-[#e2f1a6]" />
                  Monthly Expenses <span className="text-white">${totalCost.toLocaleString()}</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input type="checkbox" checked={toStock} onChange={(e) => setToStock(e.target.checked)} className="h-3.5 w-3.5 accent-[#e2f1a6]" />
                  Utility stock & cards <span className="text-white">+{totalUnits} units</span>
                </label>
              </div>

              <button
                onClick={doImport}
                disabled={importing || valid.length === 0 || (!toExpenses && !toStock)}
                className="flex w-full items-center justify-center rounded-lg bg-[#e2f1a6] py-2.5 text-[13px] font-semibold text-black transition-colors hover:bg-[#d4f05a] disabled:opacity-40"
              >
                {importing ? "Importing…" : `Import ${valid.length} items`}
              </button>
            </>
          )}

          {error && <p className="mt-3 text-center text-[12px] text-rose-300">{error}</p>}
        </div>
      </div>
    ),
    document.body
  );
}
