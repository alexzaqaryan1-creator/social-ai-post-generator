export interface ImageAnalysis {
  subject: "person" | "animal" | "object" | "scene";
  animalWord?: string;
  companions?: "friends" | "family" | "alone";
  season?: "summer" | "winter" | "autumn" | "spring";
  nature: boolean;
  withCar: boolean;
}

const ANIMAL_WORDS = [
  "dog",
  "puppy",
  "cat",
  "kitten",
  "bird",
  "horse",
  "cow",
  "sheep",
  "goat",
  "elephant",
  "lion",
  "tiger",
  "bear",
  "rabbit",
  "fish",
];

/**
 * Heuristically classifies a free-text image caption (from the free HF
 * image-to-text model) into subject type and situational context, so the
 * fallback generator and prompt can talk about what's actually in the photo
 * instead of a generic "product".
 */
export function analyzeImageDescription(description: string): ImageAnalysis {
  const text = description.toLowerCase();

  const animalWord = ANIMAL_WORDS.find((w) => text.includes(w));
  const hasPeopleWords =
    /\b(man|woman|person|people|boy|girl|child|kid|men|women|guy|friend|friends|family)\b/.test(
      text
    );
  const hasSceneWords =
    /\b(beach|mountain|park|forest|tree|garden|lake|river|sky|sunset|sunrise|field|street|city|building)\b/.test(
      text
    );

  let subject: ImageAnalysis["subject"] = "object";
  if (animalWord) subject = "animal";
  else if (hasPeopleWords) subject = "person";
  else if (hasSceneWords) subject = "scene";

  let companions: ImageAnalysis["companions"] | undefined;
  if (/\b(friends|friend|group)\b/.test(text)) companions = "friends";
  else if (/\bfamily\b/.test(text)) companions = "family";
  else if (subject === "person") companions = "alone";

  let season: ImageAnalysis["season"] | undefined;
  if (/\b(summer|beach|swim|sunny|shorts|pool)\b/.test(text)) season = "summer";
  else if (/\b(winter|snow|ski|coat)\b/.test(text)) season = "winter";
  else if (/\b(autumn|fall|leaves)\b/.test(text)) season = "autumn";
  else if (/\b(spring|blossom|flowers?)\b/.test(text)) season = "spring";

  const nature =
    /\b(nature|tree|forest|mountain|park|garden|lake|river|beach|field|outdoor)\b/.test(text);
  const withCar = /\b(car|vehicle|truck|motorcycle)\b/.test(text);

  return { subject, animalWord, companions, season, nature, withCar };
}

/**
 * Builds a short, natural lowercase phrase describing the situation in the
 * photo (e.g. "a summer day with friends", "time with my dog"), used to fill
 * in for a missing product name in caption/ad-copy templates.
 */
export function describeSituation(analysis: ImageAnalysis): string {
  const seasonWord = analysis.season ? `a ${analysis.season} day` : null;

  if (analysis.subject === "animal" && analysis.animalWord) {
    return seasonWord
      ? `time with my ${analysis.animalWord} this ${analysis.season}`
      : `time with my ${analysis.animalWord}`;
  }
  if (analysis.companions === "friends") {
    return seasonWord ? `${seasonWord} with friends` : "a day with friends";
  }
  if (analysis.companions === "family") {
    return seasonWord ? `${seasonWord} with family` : "a family moment";
  }
  if (analysis.withCar) {
    return "a ride worth remembering";
  }
  if (analysis.nature) {
    return seasonWord ? `${seasonWord} out in nature` : "a moment in nature";
  }
  if (seasonWord) return seasonWord;
  return "this moment";
}

export function capitalizeFirst(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** Extra hashtags derived from the discovered subject/situation. */
export function situationHashtags(analysis: ImageAnalysis): string[] {
  const tags: string[] = [];

  if (analysis.subject === "animal" && analysis.animalWord) {
    tags.push(`#${analysis.animalWord}`, "#petsofinstagram");
  }
  if (analysis.companions === "friends") tags.push("#friendship", "#goodtimes");
  if (analysis.companions === "family") tags.push("#familytime");
  if (analysis.season === "summer") tags.push("#summervibes");
  if (analysis.season === "winter") tags.push("#winterwonderland");
  if (analysis.season === "autumn") tags.push("#fallvibes");
  if (analysis.season === "spring") tags.push("#springtime");
  if (analysis.nature) tags.push("#naturelovers");
  if (analysis.withCar) tags.push("#carlife");

  return tags;
}
