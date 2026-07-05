import { Upload, SlidersHorizontal, Sparkles, Copy } from "lucide-react";
import { Section, Eyebrow } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";

const STEPS = [
  {
    icon: Upload,
    title: "Add a photo or product",
    description: "Upload an image, type a product name, or both — nothing is required alone.",
  },
  {
    icon: SlidersHorizontal,
    title: "Pick a tone",
    description: "Funny, luxury, corporate, casual, or bold — one click sets the voice.",
  },
  {
    icon: Sparkles,
    title: "AI generates everything",
    description: "Captions, hashtags, and ad copy, written together in a few seconds.",
  },
  {
    icon: Copy,
    title: "Copy & post",
    description: "One click copies exactly what you need, ready to paste.",
  },
];

export function HowItWorks() {
  return (
    <Section id="how-it-works" className="border-t border-border">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <Eyebrow>How it works</Eyebrow>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            From photo to post in four steps
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-8">
          {STEPS.map(({ icon: Icon, title, description }, i) => (
            <Card key={title} delay={i * 0.08} hoverLift={false} className="relative p-6">
              <span className="mb-4 block text-xs font-medium text-muted">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-foreground/[0.04]">
                <Icon className="h-5 w-5 text-accent-to" strokeWidth={2} />
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
