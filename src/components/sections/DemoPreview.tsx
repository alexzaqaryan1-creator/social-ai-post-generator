import type { GenerateResult } from "@/lib/types";
import { Section, Eyebrow } from "@/components/ui/Section";
import { ResultsCards } from "@/components/generator/ResultsCards";

const SAMPLE_RESULT: GenerateResult = {
  source: "ai",
  imageDescription: "a golden retriever running across the sand at sunset",
  captions: [
    "Golden hour, golden retriever. This dog understands lighting better than most photographers.",
    "Some days are just for chasing the sun down the beach — no agenda, no notifications.",
    "Sandy paws, salty air, zero regrets.",
    "The best part of the day, every single time.",
    "Proof that the simplest moments make the best ones.",
  ],
  hashtags: [
    "#goldenretriever",
    "#dogsofinstagram",
    "#beachdog",
    "#goldenhour",
    "#petsofinstagram",
    "#sunsetvibes",
    "#dogphotography",
    "#happydog",
    "#naturelovers",
    "#summervibes",
  ],
  adCopy: {
    short: [
      "Golden hour has a new favorite subject.",
      "This is what happy looks like.",
      "Some moments just don't need a caption.",
    ],
    long: [
      "There's a particular kind of light that only shows up for a few minutes a day — and somehow, it always finds the good moments. This was one of them.",
      "No filter changes a moment like this. Just a dog, the tide, and the last light of the day doing exactly what it does best.",
    ],
  },
};

export function DemoPreview() {
  return (
    <Section id="demo" className="border-t border-border">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
        <div className="lg:sticky lg:top-24 lg:col-span-4 lg:self-start">
          <Eyebrow>Demo</Eyebrow>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            See what it writes
          </h2>
          <p className="mt-4 max-w-sm text-muted">
            A real example, generated from a single beach photo. Try copying something.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-[0_30px_80px_rgba(10,10,10,0.08)] lg:col-span-8">
          <div className="flex items-center gap-1.5 border-b border-border px-5 py-3.5">
            <span className="h-2.5 w-2.5 rounded-full bg-foreground/10" />
            <span className="h-2.5 w-2.5 rounded-full bg-foreground/10" />
            <span className="h-2.5 w-2.5 rounded-full bg-foreground/10" />
          </div>
          <div className="p-5 sm:p-8">
            <ResultsCards result={SAMPLE_RESULT} subject="this beach photo" />
          </div>
        </div>
      </div>
    </Section>
  );
}
