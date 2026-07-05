export const TONES = ["funny", "luxury", "corporate", "casual", "bold"] as const;

export type Tone = (typeof TONES)[number];

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"] as const;

export interface AdCopy {
  short: string[];
  long: string[];
}

export interface GenerateResult {
  captions: string[];
  hashtags: string[];
  adCopy: AdCopy;
  source: "ai" | "fallback";
  imageDescription?: string;
}
