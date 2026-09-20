// Smart item → category matcher. Uses an LLM when an API key is configured,
// otherwise falls back to a local token-overlap + synonym scorer (no keys needed).

const STOP = new Set([
  "the", "a", "an", "of", "and", "for", "with", "in", "on", "to", "per", "pcs", "pc", "nos", "qty", "new", "ltd", "pvt",
]);

const SYNONYMS: Record<string, string[]> = {
  cement: ["concrete", "mortar", "cement"],
  concrete: ["cement", "rmc", "mortar"],
  steel: ["iron", "rebar", "beam", "rod", "tmt", "structural"],
  sand: ["aggregate", "gravel", "crushed", "river"],
  brick: ["block", "masonry", "cement"],
  diesel: ["fuel", "petrol", "oil", "lubricant"],
  fuel: ["diesel", "petrol", "oil"],
  paint: ["coating", "primer", "enamel"],
  wire: ["cable", "electrical", "copper"],
  pipe: ["pvc", "plumbing", "fitting"],
  helmet: ["safety", "ppe", "jacket", "glove", "boot"],
  safety: ["helmet", "ppe", "harness", "jacket"],
  wood: ["timber", "plywood", "lumber"],
  glass: ["glazing", "window"],
  labour: ["labor", "crew", "wage", "worker", "manpower"],
  labor: ["labour", "crew", "wage", "worker"],
  transport: ["truck", "freight", "logistics", "delivery", "hire"],
  equipment: ["machine", "rental", "hire", "crane", "excavator"],
  rent: ["rental", "hire", "lease"],
  materials: ["material", "cement", "concrete", "steel", "sand", "brick", "supplies", "supply"],
  supplies: ["supply", "material", "materials"],
  utilities: ["utility", "water", "electricity", "power", "gas"],
  fleet: ["truck", "vehicle", "transport", "freight", "delivery"],
  ppe: ["helmet", "safety", "gear", "glove", "boot", "jacket"],
  gear: ["ppe", "helmet", "safety", "equipment"],
  energy: ["fuel", "diesel", "power", "electricity"],
};

function tokens(s: string): string[] {
  const raw = s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t && !STOP.has(t) && t.length > 1);
  // Add singular forms so plurals hit the synonym graph ("helmets" -> "helmet")
  const out = [...raw];
  for (const t of raw) {
    if (t.length > 3 && t.endsWith("s") && !/(ss|us|is)$/.test(t)) {
      const singular = t.slice(0, -1);
      if (!STOP.has(singular)) out.push(singular);
    }
  }
  return out;
}

function expand(ts: string[]): Set<string> {
  const out = new Set<string>(ts);
  for (const t of ts) {
    for (const syn of SYNONYMS[t] ?? []) out.add(syn);
    for (const [key, syns] of Object.entries(SYNONYMS)) {
      if (syns.includes(t)) {
        out.add(key);
        for (const s of syns) out.add(s);
      }
    }
  }
  return out;
}

/** 0..1 similarity between an item name and a category name. */
export function similarity(item: string, category: string): number {
  const it = tokens(item);
  const ct = tokens(category);
  if (it.length === 0 || ct.length === 0) return 0;
  const ie = expand(it);
  const ce = expand(ct);
  let overlap = 0;
  for (const t of ie) if (ce.has(t)) overlap += 1;
  const base = overlap / Math.max(ie.size, ce.size);
  // Bonus: category name appears verbatim inside the item name
  const rawBonus = item.toLowerCase().includes(category.toLowerCase()) || category.toLowerCase().includes(item.toLowerCase()) ? 0.35 : 0;
  // Bonus: exact token hits on the raw (unexpanded) tokens
  const rawOverlap = it.filter((t) => ct.includes(t)).length;
  const rawScore = rawOverlap / Math.max(it.length, ct.length);
  return Math.min(1, base * 0.6 + rawScore * 0.4 + rawBonus);
}

export interface CategoryLike {
  id: number;
  name: string;
}

export interface MapSuggestion {
  categoryId: number | null;
  confidence: number; // 0..1
}

const THRESHOLD = 0.3;

export function suggestLocal(item: string, categories: CategoryLike[]): MapSuggestion {
  let best: MapSuggestion = { categoryId: null, confidence: 0 };
  for (const c of categories) {
    const s = similarity(item, c.name);
    if (s > best.confidence) best = { categoryId: c.id, confidence: Math.round(s * 100) / 100 };
  }
  if (best.confidence < THRESHOLD) return { categoryId: null, confidence: best.confidence };
  return best;
}

async function suggestLlm(items: string[], categories: CategoryLike[]): Promise<Record<string, number | null> | null> {
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  const prompt = `You map construction inventory item names to expense categories. Reply with ONLY a JSON object mapping each item to a category id or null when nothing fits.\nCategories: ${JSON.stringify(categories.map((c) => ({ id: c.id, name: c.name })))}\nItems: ${JSON.stringify(items)}`;
  try {
    if (geminiKey) {
      // Free tier: https://aistudio.google.com/apikey
      const r = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt + "\nReply with ONLY the JSON object." }] }],
            generationConfig: { temperature: 0, maxOutputTokens: 1024 },
          }),
        }
      );
      const d = await r.json();
      const text = d.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? "").join("") ?? "";
      const m = text.match(/\{[\s\S]*\}/);
      if (m) return JSON.parse(m[0]);
    }
    if (anthropicKey) {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": anthropicKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5",
          max_tokens: 1024,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const d = await r.json();
      const text = d.content?.[0]?.text ?? "";
      const m = text.match(/\{[\s\S]*\}/);
      if (m) return JSON.parse(m[0]);
    } else if (openaiKey) {
      const r = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${openaiKey}` },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt + "\nReply with ONLY the JSON object." }],
          temperature: 0,
        }),
      });
      const d = await r.json();
      const text = d.choices?.[0]?.message?.content ?? "";
      const m = text.match(/\{[\s\S]*\}/);
      if (m) return JSON.parse(m[0]);
    }
  } catch (e) {
    console.error("LLM mapping failed, falling back to local:", e);
  }
  return null;
}

export async function suggestMappings(
  items: string[],
  categories: CategoryLike[]
): Promise<{ item: string; categoryId: number | null; confidence: number; source: "ai" | "local" }[]> {
  const unique = [...new Set(items.filter(Boolean))];
  const llm = await suggestLlm(unique, categories);
  if (llm) {
    return unique.map((item) => {
      const id = llm[item];
      const valid = typeof id === "number" && categories.some((c) => c.id === id);
      return { item, categoryId: valid ? (id as number) : null, confidence: valid ? 0.95 : 0, source: "ai" as const };
    });
  }
  return unique.map((item) => ({ item, ...suggestLocal(item, categories), source: "local" as const }));
}
