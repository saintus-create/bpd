import { NextResponse } from "next/server";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Passage = { source: string; text: string; score: number };

const KNOWLEDGE_DIR = path.join(process.cwd(), "knowledge");
const STOP_WORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "by", "can", "do", "for",
  "from", "how", "i", "in", "is", "it", "of", "on", "or", "that", "the",
  "this", "to", "was", "what", "when", "where", "which", "who", "why",
  "with", "would", "you", "your"
]);

function terms(value: string): string[] {
  return [...new Set(value.toLowerCase().match(/[a-z0-9][a-z0-9'-]*/g) ?? [])]
    .filter((word) => word.length > 1 && !STOP_WORDS.has(word));
}

async function markdownFiles(dir: string): Promise<string[]> {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }

  const files: string[] = [];
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await markdownFiles(fullPath));
    // Folder READMEs are navigation, not knowledge: they repeat every topic
    // name and would otherwise outrank the real documents.
    else if (/\.md$/i.test(entry.name) && !/^readme\.md$/i.test(entry.name))
      files.push(fullPath);
  }
  return files;
}

function splitPassages(markdown: string): string[] {
  return markdown
    .replace(/^---[\s\S]*?---\s*/m, "")
    .split(/\n\s*\n/)
    .map((part) => part.replace(/^#{1,6}\s+/gm, "").trim())
    .filter((part) => part.length > 25);
}

function scorePassage(queryTerms: string[], passage: string): number {
  const text = passage.toLowerCase();
  const passageTerms = terms(passage);
  let score = 0;
  for (const term of queryTerms) {
    if (text.includes(term)) score += 2;
    score += Math.min(passageTerms.filter((word) => word === term).length, 3);
  }
  return score;
}

export async function GET() {
  const files = await markdownFiles(KNOWLEDGE_DIR);
  return NextResponse.json({
    status: "ok",
    endpoint: "/api/knowledge-search",
    method: "POST",
    knowledgeDirectory: "knowledge/",
    markdownFiles: files.length,
    sampleSources: files.slice(0, 10).map((file) =>
      path.relative(KNOWLEDGE_DIR, file).split(path.sep).join("/")
    ),
    toolName: "search_knowledge",
    message: files.length
      ? "Knowledge search is ready. Configure the Hume EVI custom tool named search_knowledge to use this endpoint."
      : "No Markdown files were found. Add .md files under knowledge/."
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let parameters = body?.parameters ?? body?.arguments ?? body;
    if (typeof parameters === "string") {
      try {
        parameters = JSON.parse(parameters);
      } catch {
        parameters = { query: parameters };
      }
    }

    const rawQuery = parameters?.query;
    if (typeof rawQuery !== "string" || !rawQuery.trim()) {
      return NextResponse.json({
        success: false,
        error: {
          error: "Missing query",
          code: "invalid_query",
          level: "warn",
          content: "The knowledge search needs a question or search query."
        }
      }, { status: 400 });
    }

    const query = rawQuery.trim().slice(0, 1000);
    const queryTerms = terms(query);
    const files = await markdownFiles(KNOWLEDGE_DIR);
    const passages: Passage[] = [];

    for (const file of files) {
      const markdown = await readFile(file, "utf8");
      const source = path.relative(KNOWLEDGE_DIR, file).split(path.sep).join("/");
      for (const text of splitPassages(markdown)) {
        const score = scorePassage(queryTerms, text);
        if (score > 0) passages.push({ source, text: text.slice(0, 3000), score });
      }
    }

    const results = passages
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(({ source, text }) => ({ source, text }));

    const data = results.length
      ? results.map((item, index) =>
          "Source " + (index + 1) + " (" + item.source + "):\n" + item.text
        ).join("\n\n")
      : "No relevant passages were found in the Markdown knowledge base. Do not invent an answer from these documents.";

    return NextResponse.json({ success: true, data, resultsCount: results.length });
  } catch {
    return NextResponse.json({
      success: false,
      error: {
        error: "Knowledge search failed",
        code: "knowledge_search_error",
        level: "error",
        content: "The knowledge search could not read the supplied documents."
      }
    }, { status: 500 });
  }
}
