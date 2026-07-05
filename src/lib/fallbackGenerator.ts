import type { GenerateResult, Tone } from "./types";
import {
  capitalizeFirst,
  describeSituation,
  situationHashtags,
  type ImageAnalysis,
} from "./imageAnalysis";

/**
 * Rule-based generator used when no HF_API_KEY is configured or the free
 * Inference API call fails/times out, so the product still works end to end.
 */

const CAPTION_TEMPLATES: Record<Tone, string[]> = {
  funny: [
    "POV: you tried {product} once and now your whole personality is different 😂",
    "{product} said \"let me fix your entire life\" and honestly? valid.",
    "Me before {product}: chaotic. Me after: still chaotic, but make it aesthetic ✨",
    "Warning: {product} may cause excessive bragging to friends who haven't tried it yet.",
    "Plot twist: {product} is the main character and we're all just living in its story 🎬",
  ],
  luxury: [
    "Elevate the everyday. {product} — crafted for those who accept nothing less than exceptional.",
    "Some things whisper luxury. {product} is one of them.",
    "Indulge in the extraordinary. {product} redefines what it means to have it all.",
    "Timeless. Refined. {product} — a statement, not just a product.",
    "For the discerning few: {product}, where craftsmanship meets desire.",
  ],
  corporate: [
    "Introducing {product} — engineered to drive efficiency and measurable results for your team.",
    "{product}: a scalable solution built for the modern enterprise.",
    "Empower your workflow with {product}, designed for reliability and growth.",
    "Trusted by teams who demand performance: {product} delivers, every time.",
    "{product} — innovation meets execution, so your business stays ahead.",
  ],
  casual: [
    "Just added {product} to the daily lineup and honestly no regrets 🙌",
    "{product} kind of just gets it, you know?",
    "New favorite unlocked: {product}. Simple as that.",
    "Been using {product} all week and yeah, it's a keeper.",
    "{product} — no overthinking, just good vibes.",
  ],
  bold: [
    "{product} doesn't follow trends. It sets them.",
    "Loud. Unapologetic. {product} is not here to blend in.",
    "Break the mold with {product} — made for the ones who go all in.",
    "{product}: for people who refuse to settle for average.",
    "This is {product}. Fear it, love it, can't ignore it.",
  ],
};

const AD_SHORT_TEMPLATES: Record<Tone, string[]> = {
  funny: [
    "{product}: because adulting is hard enough already.",
    "Warning: {product} may cause spontaneous joy.",
    "{product} — your new favorite excuse to treat yourself.",
  ],
  luxury: [
    "{product}. Excellence, delivered.",
    "Discover {product} — luxury redefined.",
    "{product}: where quality speaks for itself.",
  ],
  corporate: [
    "{product}: results you can measure.",
    "Streamline success with {product}.",
    "{product} — built for performance.",
  ],
  casual: [
    "{product}. Easy. Good. Done.",
    "Meet {product}, your new go-to.",
    "{product} — simple, honest, reliable.",
  ],
  bold: [
    "{product}: unapologetically different.",
    "Go bigger with {product}.",
    "{product} — dare to stand out.",
  ],
};

const AD_LONG_TEMPLATES: Record<Tone, string[]> = {
  funny: [
    "Look, we could tell you {product} will change your life, but that sounds dramatic. It will just make everything slightly funnier, way easier, and honestly a bit more fun. Try it before your friends do.",
    "{product} is basically the friend who always has a solution, minus the unsolicited advice. Give it a shot — your future self will thank you (and probably laugh a little too).",
    "We built {product} for people who take fun seriously and everything else a little less seriously. Come for the results, stay for the good time.",
  ],
  luxury: [
    "{product} was created for those who understand that true quality cannot be rushed. Every detail has been considered, every material chosen with intention, so you experience nothing short of excellence.",
    "There is a difference between owning something and experiencing it. {product} offers the latter — a rare blend of craftsmanship, elegance, and lasting value.",
    "In a world of endless options, {product} stands apart. It is not for everyone — it is for those who know exactly what they deserve.",
  ],
  corporate: [
    "{product} was designed to solve real operational challenges, helping teams move faster without sacrificing quality. Built with scalability and reliability at its core, it's the solution growing businesses trust.",
    "Efficiency shouldn't be a luxury. {product} gives your team the tools to execute with confidence, backed by performance you can measure and results that speak for themselves.",
    "From startups to established enterprises, {product} adapts to how your team actually works — reducing friction, increasing output, and supporting sustainable growth.",
  ],
  casual: [
    "Honestly, {product} just makes life a little easier. No gimmicks, no overpromises — just something that works well and fits right into your routine.",
    "We didn't overthink {product}. We just made something genuinely useful, and figured you'd appreciate that as much as we do.",
    "{product} is one of those things you didn't know you needed until you tried it — now it's just part of the routine.",
  ],
  bold: [
    "{product} isn't for people who play it safe. It's for the ones who move first, speak up, and refuse to blend into the crowd. This is your sign to go bigger.",
    "Some products fit in. {product} stands out — built for people who lead instead of follow, and who aren't afraid to make noise doing it.",
    "You already know average isn't your style. {product} was made for the bold ones who want more, expect more, and settle for nothing less.",
  ],
};

const TONE_HASHTAGS: Record<Tone, string[]> = {
  funny: ["#lol", "#funnybusiness", "#relatable", "#comedygold", "#lightenup"],
  luxury: ["#luxurylifestyle", "#premiumquality", "#exclusive", "#luxurybrand", "#finethings"],
  corporate: ["#business", "#innovation", "#productivity", "#b2b", "#enterprise"],
  casual: ["#everyday", "#simplelife", "#nofilter", "#realtalk", "#goodvibes"],
  bold: ["#gobold", "#standout", "#nofear", "#gamechanger", "#unstoppable"],
};

const GENERIC_HASHTAGS = [
  "#newproduct",
  "#musthave",
  "#shopnow",
  "#trending",
  "#instagood",
  "#marketing",
  "#smallbusiness",
  "#brand",
  "#launch",
  "#discover",
];

function slugifyForHashtag(product: string): string {
  return product
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .join("");
}

function fillTemplate(template: string, product: string): string {
  return template.replace(/\{product\}/g, product);
}

function imageHashtags(imageDescription: string): string[] {
  const stopWords = new Set([
    "a",
    "an",
    "the",
    "of",
    "with",
    "and",
    "on",
    "in",
    "is",
    "to",
    "at",
  ]);

  return imageDescription
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !stopWords.has(word))
    .slice(0, 3)
    .map((word) => `#${word}`);
}

/**
 * Generates captions/hashtags/ad copy for a product name, or — when no
 * product name is given — for whatever the uploaded photo shows (subject +
 * situation discovered by `analyzeImageDescription`).
 */
export function generateFallback(
  product: string | null,
  tone: Tone,
  imageDescription?: string,
  analysis?: ImageAnalysis
): GenerateResult {
  const effectiveSubject =
    product ?? capitalizeFirst(describeSituation(analysis ?? { subject: "object", nature: false, withCar: false }));

  const productSlug = product ? slugifyForHashtag(product) : "";

  const captions = CAPTION_TEMPLATES[tone].map((t) => fillTemplate(t, effectiveSubject));
  const adShort = AD_SHORT_TEMPLATES[tone].map((t) => fillTemplate(t, effectiveSubject));
  const adLong = AD_LONG_TEMPLATES[tone].map((t) => fillTemplate(t, effectiveSubject));

  if (imageDescription) {
    captions.unshift(`📸 ${capitalizeFirst(imageDescription)}`);
  }

  const hashtags = [
    ...(productSlug ? [`#${productSlug}`] : []),
    ...(analysis ? situationHashtags(analysis) : []),
    ...(imageDescription ? imageHashtags(imageDescription) : []),
    ...TONE_HASHTAGS[tone],
    ...GENERIC_HASHTAGS,
  ]
    .filter((tag, idx, arr) => arr.indexOf(tag) === idx)
    .slice(0, 20);

  return {
    captions: captions.slice(0, 5),
    hashtags,
    adCopy: { short: adShort, long: adLong },
    source: "fallback",
    ...(imageDescription ? { imageDescription } : {}),
  };
}
