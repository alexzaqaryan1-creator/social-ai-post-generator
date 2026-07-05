import { ImagePlus, ScanEye, MessageCircle, Hash, Megaphone, Gift } from "lucide-react";
import { Section, Eyebrow } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";

const FEATURES = [
  {
    icon: ImagePlus,
    title: "Any photo works",
    description:
      "Upload a person, a pet, a product, or a scene. A product name is optional — the photo can carry the whole post.",
  },
  {
    icon: ScanEye,
    title: "Smart context detection",
    description:
      "Detects who or what's in frame and the situation — season, setting, who you're with — and writes around it.",
  },
  {
    icon: MessageCircle,
    title: "5 caption variations",
    description: "Five distinct, ready-to-post Instagram captions in the tone you choose.",
  },
  {
    icon: Hash,
    title: "10–20 relevant hashtags",
    description: "A mix of niche and broad-reach tags, grounded in your product and photo.",
  },
  {
    icon: Megaphone,
    title: "Ad copy, short & long",
    description: "Punchy one-liners and persuasive long-form copy, generated side by side.",
  },
  {
    icon: Gift,
    title: "Always free",
    description:
      "Runs on free, open AI models with a built-in fallback — no subscription, no credit card.",
  },
];

export function Features() {
  return (
    <Section id="features">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
        <div className="lg:sticky lg:top-24 lg:col-span-4 lg:self-start">
          <Eyebrow>Features</Eyebrow>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Everything a post needs, generated at once
          </h2>
          <p className="mt-4 max-w-sm text-muted">
            Six things happen in the same request — no separate tools, no copy-pasting between
            apps.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-8">
          {FEATURES.map(({ icon: Icon, title, description }, i) => (
            <Card key={title} delay={i * 0.05} className="p-6">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-foreground/[0.04]">
                <Icon className="h-5 w-5 text-accent-from" strokeWidth={2} />
              </div>
              <h3 className="mb-1.5 text-base font-semibold text-foreground">{title}</h3>
              <p className="text-sm leading-relaxed text-muted">{description}</p>
            </Card>
          ))}
        </div>
      </div>
    </Section>
  );
}
