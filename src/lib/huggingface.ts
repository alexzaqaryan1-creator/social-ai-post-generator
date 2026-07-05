const DEFAULT_MODEL = "HuggingFaceH4/zephyr-7b-beta";
const HF_TIMEOUT_MS = 20_000;

/**
 * Calls the free HuggingFace Inference API. Throws on any failure so the
 * caller can fall back to the rule-based generator.
 */
export async function callHuggingFace(prompt: string): Promise<string> {
  const apiKey = process.env.HF_API_KEY;
  if (!apiKey) {
    throw new Error("HF_API_KEY is not configured");
  }

  const model = process.env.HF_MODEL || DEFAULT_MODEL;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), HF_TIMEOUT_MS);

  try {
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${model}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 900,
            temperature: 0.8,
            return_full_text: false,
          },
          options: {
            wait_for_model: true,
          },
        }),
        signal: controller.signal,
      }
    );

    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      throw new Error(`HuggingFace API error ${response.status}: ${errText}`);
    }

    const data = await response.json();

    if (Array.isArray(data) && typeof data[0]?.generated_text === "string") {
      return data[0].generated_text;
    }
    if (typeof data?.generated_text === "string") {
      return data.generated_text;
    }

    throw new Error("Unexpected HuggingFace response shape");
  } finally {
    clearTimeout(timeout);
  }
}
