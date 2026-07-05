"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Section, Eyebrow } from "@/components/ui/Section";

const FAQS = [
  {
    question: "Is this really free?",
    answer:
      "Yes. Generation runs on free HuggingFace models, with an automatic rule-based fallback if the free API is unavailable — either way, you get a full result at no cost.",
  },
  {
    question: "Do I need to create an account?",
    answer: "No sign-up, no login, no email required. Just open the page and generate.",
  },
  {
    question: "Do I need a product name?",
    answer:
      "No — it's optional. Upload a photo alone and the AI writes based on what it sees; add a product name for something more specific; or use both together.",
  },
  {
    question: "What image formats are supported?",
    answer: "PNG, JPEG, and WebP, up to 5MB per photo.",
  },
  {
    question: "How is my photo used?",
    answer:
      "It's sent to a free image-captioning model for a one-time description used to write your captions — it isn't stored or used for anything else.",
  },
  {
    question: "Can I use the generated captions commercially?",
    answer: "Yes — everything generated is yours to use, edit, and post however you'd like.",
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-border">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <span className="text-[15px] font-medium text-foreground">{question}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
          className="shrink-0 text-muted"
        >
          <ChevronDown className="h-4 w-4" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm leading-relaxed text-muted">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQ() {
  return (
    <Section id="faq" className="border-t border-border">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <Eyebrow>FAQ</Eyebrow>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Questions, answered
          </h2>
        </div>

        <div className="lg:col-span-8">
          {FAQS.map((faq) => (
            <FAQItem key={faq.question} {...faq} />
          ))}
        </div>
      </div>
    </Section>
  );
}
