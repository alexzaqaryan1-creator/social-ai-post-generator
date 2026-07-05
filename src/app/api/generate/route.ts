import { NextRequest, NextResponse } from "next/server";
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_IMAGE_BYTES,
  TONES,
  type GenerateResult,
  type Tone,
} from "@/lib/types";
import { buildPrompt, extractJson, normalizeResult } from "@/lib/promptEngine";
import { callHuggingFace } from "@/lib/huggingface";
import { describeImage } from "@/lib/imageCaption";
import { analyzeImageDescription } from "@/lib/imageAnalysis";
import { generateFallback } from "@/lib/fallbackGenerator";
import { checkRateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";

const MAX_PRODUCT_LENGTH = 120;

function getClientIp(req: NextRequest): string {
  // x-real-ip is set directly by the edge/proxy layer and isn't client-controllable.
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  // x-forwarded-for is "client, proxy1, proxy2, ..." — each hop appends its own
  // address. The first entry is whatever the client sent (spoofable); the last
  // entry is what our own edge/proxy appended, so trust that one instead.
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const ips = forwardedFor.split(",").map((ip) => ip.trim());
    return ips[ips.length - 1];
  }

  return "unknown";
}

function isValidTone(tone: unknown): tone is Tone {
  return typeof tone === "string" && (TONES as readonly string[]).includes(tone);
}

interface ParsedInput {
  product: string | null;
  tone: Tone;
  image: File | null;
}

async function parseInput(req: NextRequest): Promise<ParsedInput | { error: string }> {
  const contentType = req.headers.get("content-type") ?? "";

  let productRaw: unknown;
  let toneRaw: unknown;
  let image: File | null = null;

  if (contentType.includes("multipart/form-data")) {
    const form = await req.formData();
    productRaw = form.get("product");
    toneRaw = form.get("tone");
    const imageEntry = form.get("image");
    if (imageEntry instanceof File && imageEntry.size > 0) {
      image = imageEntry;
    }
  } else {
    const body = await req.json().catch(() => null);
    if (typeof body !== "object" || body === null) {
      return { error: "Invalid request body" };
    }
    const b = body as Record<string, unknown>;
    productRaw = b.product;
    toneRaw = b.tone;
  }

  const hasProduct = typeof productRaw === "string" && productRaw.trim().length > 0;

  if (hasProduct && (productRaw as string).trim().length > MAX_PRODUCT_LENGTH) {
    return { error: `'product' must be at most ${MAX_PRODUCT_LENGTH} characters.` };
  }

  if (!hasProduct && !image) {
    return { error: "Provide a product name, an image, or both." };
  }

  if (!isValidTone(toneRaw)) {
    return { error: "'tone' must be one of: " + TONES.join(", ") };
  }

  if (image) {
    if (!(ACCEPTED_IMAGE_TYPES as readonly string[]).includes(image.type)) {
      return { error: "Image must be PNG, JPEG, or WebP." };
    }
    if (image.size > MAX_IMAGE_BYTES) {
      return { error: "Image must be smaller than 5MB." };
    }
  }

  return {
    product: hasProduct ? (productRaw as string).trim() : null,
    tone: toneRaw,
    image,
  };
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rateLimit = checkRateLimit(ip);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error: "Too many requests. Please wait a moment before trying again.",
      },
      {
        status: 429,
        headers: {
          "Retry-After": Math.ceil(rateLimit.retryAfterMs / 1000).toString(),
        },
      }
    );
  }

  const parsed = await parseInput(req);
  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }
  const { product, tone, image } = parsed;

  let imageDescription: string | undefined;
  if (image) {
    try {
      const buffer = Buffer.from(await image.arrayBuffer());
      imageDescription = await describeImage(buffer, image.type);
    } catch {
      imageDescription = undefined;
    }
  }
  const analysis = imageDescription ? analyzeImageDescription(imageDescription) : undefined;

  let result: GenerateResult;
  try {
    if (!imageDescription && !product) {
      // No image analysis available (no API key / call failed) and no
      // product name to fall back on — skip straight to the rule-based path.
      throw new Error("Insufficient input for AI generation");
    }
    const prompt = buildPrompt(product, tone, imageDescription);
    const rawText = await callHuggingFace(prompt);
    const parsedJson = extractJson(rawText);
    const normalized = normalizeResult(parsedJson);
    result = { ...normalized, source: "ai", ...(imageDescription ? { imageDescription } : {}) };
  } catch {
    result = generateFallback(product, tone, imageDescription, analysis);
  }

  return NextResponse.json(result, {
    headers: { "X-RateLimit-Remaining": rateLimit.remaining.toString() },
  });
}
