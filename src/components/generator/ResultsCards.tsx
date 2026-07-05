"use client";

import { motion } from "framer-motion";
import { Eye, MessageCircle, Hash, Megaphone } from "lucide-react";
import type { GenerateResult } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { CopyButton } from "@/components/generator/CopyButton";
import { useToast } from "@/components/ui/Toast";

function CardHeader({ icon: Icon, title }: { icon: typeof Eye; title: string }) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <Icon className="h-4 w-4 text-accent-from" strokeWidth={2} />
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
    </div>
  );
}

function ListRow({ text }: { text: string }) {
  return (
    <li className="flex items-start justify-between gap-3 rounded-xl border border-border px-4 py-3 transition-colors duration-200 hover:border-border-strong hover:bg-foreground/[0.015]">
      <span className="text-sm leading-relaxed text-foreground">{text}</span>
      <CopyButton text={text} label="Copy" />
    </li>
  );
}

export function ResultsCards({ result, subject }: { result: GenerateResult; subject: string }) {
  const hashtagsBlock = result.hashtags.join(" ");
  const { showToast } = useToast();

  async function copyTag(tag: string) {
    try {
      await navigator.clipboard.writeText(tag);
      showToast("Copied to clipboard");
    } catch {
      showToast("Couldn't copy — try again", "error");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          Results for <span className="font-medium text-foreground">{subject}</span>
        </p>
        <span className="rounded-full border border-border-strong px-3 py-1 text-xs font-medium text-muted">
          {result.source === "ai" ? "AI generated" : "Template generated"}
        </span>
      </div>

      {result.imageDescription && (
        <Card delay={0}>
          <div className="p-6">
            <CardHeader icon={Eye} title="Image description" />
            <p className="text-sm leading-relaxed text-muted">{result.imageDescription}</p>
          </div>
        </Card>
      )}

      <Card delay={0.05}>
        <div className="p-6">
          <CardHeader icon={MessageCircle} title="Captions" />
          <ul className="flex flex-col gap-2">
            {result.captions.map((caption, i) => (
              <ListRow key={i} text={caption} />
            ))}
          </ul>
        </div>
      </Card>

      <Card delay={0.1}>
        <div className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-accent-from" strokeWidth={2} />
              <h3 className="text-sm font-semibold text-foreground">Hashtags</h3>
            </div>
            <CopyButton text={hashtagsBlock} label="Copy all hashtags" />
          </div>
          <div className="flex flex-wrap gap-2">
            {result.hashtags.map((tag) => (
              <motion.button
                key={tag}
                type="button"
                onClick={() => copyTag(tag)}
                whileTap={{ scale: 0.94 }}
                className="rounded-full border border-border bg-foreground/[0.02] px-3 py-1.5 text-xs text-foreground/80 transition-colors hover:border-border-strong hover:bg-foreground/[0.05]"
                title="Click to copy"
              >
                {tag}
              </motion.button>
            ))}
          </div>
        </div>
      </Card>

      <Card delay={0.15}>
        <div className="p-6">
          <CardHeader icon={Megaphone} title="Ad copy — short" />
          <ul className="flex flex-col gap-2">
            {result.adCopy.short.map((copy, i) => (
              <ListRow key={i} text={copy} />
            ))}
          </ul>
        </div>
      </Card>

      <Card delay={0.2}>
        <div className="p-6">
          <CardHeader icon={Megaphone} title="Ad copy — long" />
          <ul className="flex flex-col gap-2">
            {result.adCopy.long.map((copy, i) => (
              <ListRow key={i} text={copy} />
            ))}
          </ul>
        </div>
      </Card>
    </div>
  );
}
