import fs from "fs/promises";
import path from "path";

const DOCUMENT_PATH = path.join(process.cwd(), "data", "tapeDriveManual.txt");
const CHUNK_MAX_CHARS = 1800;
const MAX_TOP_CHUNKS = 3;

export type DocumentChunk = {
  id: string;
  text: string;
  terms: string[];
};

let documentChunks: DocumentChunk[] | null = null;

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\u2018\u2019\u201c\u201d]/g, "'")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function termsFromText(text: string): string[] {
  return normalizeText(text)
    .split(/\s+/)
    .filter(Boolean)
    .filter((term) => term.length > 2);
}

function chunkDocument(text: string): DocumentChunk[] {
  const paragraphs = text.split(/\n{2,}/).map((part) => part.trim()).filter(Boolean);
  const chunks: DocumentChunk[] = [];
  let current: string[] = [];
  let currentLength = 0;

  for (const paragraph of paragraphs) {
    const paragraphLength = paragraph.length;
    if (currentLength + paragraphLength + 2 > CHUNK_MAX_CHARS && current.length > 0) {
      const chunkText = current.join("\n\n");
      chunks.push({ id: `chunk-${chunks.length + 1}`, text: chunkText, terms: termsFromText(chunkText) });
      current = [paragraph];
      currentLength = paragraphLength;
    } else {
      current.push(paragraph);
      currentLength += paragraphLength + 2;
    }
  }

  if (current.length > 0) {
    const chunkText = current.join("\n\n");
    chunks.push({ id: `chunk-${chunks.length + 1}`, text: chunkText, terms: termsFromText(chunkText) });
  }

  return chunks;
}

async function loadDocumentChunks(): Promise<DocumentChunk[]> {
  if (documentChunks) {
    return documentChunks;
  }

  const raw = await fs.readFile(DOCUMENT_PATH, "utf-8");
  documentChunks = chunkDocument(raw);
  return documentChunks;
}

function computeScore(queryTerms: Set<string>, chunk: DocumentChunk): number {
  let matches = 0;
  for (const term of chunk.terms) {
    if (queryTerms.has(term)) {
      matches += 1;
    }
  }
  return matches;
}

export async function getRagContext(query: string): Promise<string> {
  const chunks = await loadDocumentChunks();
  const queryTerms = new Set(termsFromText(query));

  if (queryTerms.size === 0 || chunks.length === 0) {
    return "";
  }

  const scored = chunks
    .map((chunk) => ({ chunk, score: computeScore(queryTerms, chunk) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_TOP_CHUNKS);

  if (scored.length === 0) {
    return "";
  }

  return scored
    .map((item, index) => `Manual section ${index + 1}:\n${item.chunk.text}`)
    .join("\n\n---\n\n");
}
