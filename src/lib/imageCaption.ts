const DEFAULT_IMAGE_MODEL = "Salesforce/blip-image-captioning-base";
const IMAGE_TIMEOUT_MS = 20_000;

/**
 * Calls the free HuggingFace image-to-text Inference API to get a short
 * natural-language description of an uploaded product photo. Throws on any
 * failure so the caller can fall back to a generic description.
 */
export async function describeImage(imageBuffer: Buffer, mimeType: string): Promise<string> {
  const apiKey = process.env.HF_API_KEY;
  if (!apiKey) {
    throw new Error("HF_API_KEY is not configured");
  }

  const model = process.env.HF_IMAGE_MODEL || DEFAULT_IMAGE_MODEL;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), IMAGE_TIMEOUT_MS);

  try {
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${model}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": mimeType,
        },
        body: new Uint8Array(imageBuffer),
        signal: controller.signal,
      }
    );

    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      throw new Error(`HuggingFace image API error ${response.status}: ${errText}`);
    }

    const data = await response.json();

    if (Array.isArray(data) && typeof data[0]?.generated_text === "string") {
      return data[0].generated_text.trim();
    }

    throw new Error("Unexpected image captioning response shape");
  } finally {
    clearTimeout(timeout);
  }
}
