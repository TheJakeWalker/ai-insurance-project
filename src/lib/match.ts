import Fuse from "fuse.js";
import { INSUREDS, Insured } from "@/constants/insureds";

export type MatchResult = {
  match: Insured | null;
  confidence: number;
};

// Normalize text to improve match quality
const normalize = (str: string) =>
  str
    .toLowerCase()
    .replace(/[,\.]/g, "") // remove punctuation
    .replace(/\b(inc|llc|ltd|corp|corporation)\b/g, "") // remove suffixes
    .replace(/\b([a-z])\s(?=[a-z]\b)/g, "$1") // fix broken acronyms like "L T D"
    .replace(/\s+/g, " ") // collapse spaces
    .trim();

export function matchInsuredName(extractedName: string): MatchResult {
  const cleanedInput = normalize(extractedName);

  const normalizedInsureds = INSUREDS.map((insured) => ({
    ...insured,
    normalizedName: normalize(insured.name),
  }));

  const fuse = new Fuse(normalizedInsureds, {
    keys: ["normalizedName"],
    threshold: 0.35, // looser match: 0 = exact, 1 = match everything
    includeScore: true,
  });

  const result = fuse.search(cleanedInput);
  const best = result[0];

  if (best?.score !== undefined && 1 - best.score >= 0.8) {
    return {
      match: best.item,
      confidence: parseFloat((1 - best.score).toFixed(2)),
    };
  }

  return { match: null, confidence: 0 };
}
