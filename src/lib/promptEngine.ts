import type { GenerateResult, Tone } from "./types";

/**
 * Builds the instruction prompt sent to the AI model. Asking for strict JSON
 * keeps parsing deterministic instead of scraping free-form prose.
 */
export function buildPrompt(
  product: string | null,
  tone: Tone,
  imageDescription?: string
): string {
  const subjectLine = product
    ? `Generate social media marketing content for a product called "${product}".`
    : `Generate social media content for a photo (no specific product — write about the moment/scene itself).`;

  const imageContext = imageDescription
    ? product
      ? `\nThe product photo shows: "${imageDescription}". Ground the captions and ad copy in what is visually shown — who/what is in it (person, animal, or object) and the situation (season, setting, who they're with).\n`
      : `\nThe photo shows: "${imageDescription}". Identify who/what is in it (a person, animal, or object) and the situation — season (summer/winter/etc.), setting (nature, city, with a car...), and who they're with (friends, family, alone, a pet) — then write captions grounded in that.\n`
    : "";

  const aboutLine = product
    ? `Every string must be about "${product}" and match the ${tone} tone.`
    : `Every string must be grounded in the photo described above and match the ${tone} tone.`;

  return `You are a world-class social media marketing copywriter.

${subjectLine}
Tone: ${tone}.
${imageContext}

Return ONLY valid JSON (no markdown fences, no commentary) in exactly this shape:
{
  "captions": ["caption1", "caption2", "caption3", "caption4", "caption5"],
  "hashtags": ["#tag1", "#tag2", "..."],
  "adCopy": {
    "short": ["short ad 1", "short ad 2", "short ad 3"],
    "long": ["long ad 1", "long ad 2", "long ad 3"]
  }
}

Rules:
- captions: exactly 5 Instagram captions in a ${tone} tone, each under 200 characters, use emojis where it fits the tone.
- hashtags: exactly 15 relevant hashtags, each starting with "#", no spaces, mix of niche and broad reach tags.
- adCopy.short: exactly 3 punchy ad copy variations, each under 90 characters.
- adCopy.long: exactly 3 persuasive ad copy variations, each 2-4 sentences.
- ${aboutLine}
- Output must be a single JSON object and nothing else.`;
}

/**
 * Extracts a JSON object from a model response that may include stray
 * markdown fences or leading/trailing prose despite instructions.
 */
export function extractJson(text: string): unknown {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    // fall through to brace extraction
  }

  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("No JSON object found in model output");
  }
  return JSON.parse(trimmed.slice(start, end + 1));
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((v) => typeof v === "string");
}

/**
 * Validates the parsed payload matches the expected shape and normalizes
 * array lengths, since models don't always follow counts exactly.
 */
export function normalizeResult(raw: unknown): Omit<GenerateResult, "source"> {
  if (typeof raw !== "object" || raw === null) {
    throw new Error("Model output is not an object");
  }
  const obj = raw as Record<string, unknown>;
  const adCopyRaw = obj.adCopy as Record<string, unknown> | undefined;

  const captions = isStringArray(obj.captions) ? obj.captions : [];
  const hashtags = isStringArray(obj.hashtags) ? obj.hashtags : [];
  const short =
    adCopyRaw && isStringArray(adCopyRaw.short) ? adCopyRaw.short : [];
  const long =
    adCopyRaw && isStringArray(adCopyRaw.long) ? adCopyRaw.long : [];

  if (captions.length === 0 || hashtags.length === 0 || short.length === 0 || long.length === 0) {
    throw new Error("Model output missing required fields");
  }

  return {
    captions: captions.slice(0, 5),
    hashtags: normalizeHashtags(hashtags).slice(0, 20),
    adCopy: {
      short: short.slice(0, 3),
      long: long.slice(0, 3),
    },
  };
}

function normalizeHashtags(tags: string[]): string[] {
  return tags
    .map((t) => t.trim().replace(/\s+/g, ""))
    .map((t) => (t.startsWith("#") ? t : `#${t}`))
    .filter((t) => t.length > 1);
}
