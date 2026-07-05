"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, AlertCircle } from "lucide-react";
import type { GenerateResult, Tone } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Section, Eyebrow } from "@/components/ui/Section";
import { UploadZone } from "@/components/generator/UploadZone";
import { ToneSelector } from "@/components/generator/ToneSelector";
import { GenerationSteps } from "@/components/generator/GenerationSteps";
import { ResultsCards } from "@/components/generator/ResultsCards";

const STEPS_WITH_IMAGE = [
  "Uploading photo",
  "Analyzing image",
  "Understanding context",
  "Writing captions",
  "Generating hashtags",
  "Finalizing",
];

const STEPS_NO_IMAGE = [
  "Understanding product",
  "Writing captions",
  "Generating hashtags",
  "Finalizing",
];

interface FormValues {
  product: string;
}

type Phase = "idle" | "generating" | "done-fetching" | "results";

export function GeneratorTool() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues: { product: "" } });

  const [tone, setTone] = useState<Tone>("funny");
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [subject, setSubject] = useState("");
  const previewUrlRef = useRef<string | null>(null);

  useEffect(() => {
    previewUrlRef.current = previewUrl;
  }, [previewUrl]);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    };
  }, []);

  function handleImageSelect(file: File) {
    setImage(file);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
  }

  function handleImageClear() {
    setImage(null);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
  }

  async function onSubmit(values: FormValues) {
    const product = values.product.trim();
    if (!product && !image) {
      setError("Add a product name, upload a photo, or both.");
      return;
    }

    setError(null);
    setResult(null);
    setSubject(product || "your photo");
    setPhase("generating");

    try {
      const formData = new FormData();
      formData.set("product", product);
      formData.set("tone", tone);
      if (image) formData.set("image", image);

      const res = await fetch("/api/generate", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setError(data?.error ?? "Something went wrong. Please try again.");
        setPhase("idle");
        return;
      }

      setResult(data as GenerateResult);
      setPhase("done-fetching");
      setTimeout(() => setPhase("results"), 950);
    } catch {
      setError("Network error. Please check your connection and try again.");
      setPhase("idle");
    }
  }

  const steps = image ? STEPS_WITH_IMAGE : STEPS_NO_IMAGE;
  const isGenerating = phase === "generating" || phase === "done-fetching";

  return (
    <Section id="generate" className="scroll-mt-16 border-t border-border">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
        <div className="lg:sticky lg:top-24 lg:col-span-4 lg:self-start">
          <Eyebrow>Try it now</Eyebrow>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Generate your first post
          </h2>
          <p className="mt-4 max-w-sm text-muted">
            A product name, a photo, or both — your call. Nothing is saved, nothing is required.
          </p>
        </div>

        <div className="lg:col-span-8">
        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ type: "spring", stiffness: 200, damping: 26 }}
          className="rounded-3xl border border-border bg-card p-6 shadow-[0_1px_2px_rgba(10,10,10,0.04)] sm:p-8"
        >
          <fieldset disabled={isGenerating} className="flex flex-col gap-6 disabled:opacity-60">
            <div>
              <label htmlFor="product" className="mb-2 block text-sm font-medium text-foreground">
                Product name <span className="font-normal text-muted">(optional)</span>
              </label>
              <input
                id="product"
                type="text"
                placeholder="e.g. GlowSkin Serum — or leave blank and just upload a photo"
                className="w-full rounded-xl border border-border-strong bg-white px-4 py-3 text-[15px] text-foreground placeholder:text-muted/70 outline-none transition-colors focus:border-accent-from/50 focus:ring-4 focus:ring-accent-from/10"
                {...register("product", { maxLength: 120 })}
              />
              {errors.product && (
                <p className="mt-1.5 text-xs text-red-500">Max 120 characters.</p>
              )}
            </div>

            <div>
              <span className="mb-2 block text-sm font-medium text-foreground">Tone</span>
              <ToneSelector value={tone} onChange={setTone} />
            </div>

            <div>
              <span className="mb-2 block text-sm font-medium text-foreground">
                Photo <span className="font-normal text-muted">(optional)</span>
              </span>
              <UploadZone
                file={image}
                previewUrl={previewUrl}
                onSelect={handleImageSelect}
                onClear={handleImageClear}
              />
              <p className="mt-2 text-xs text-muted">
                The AI figures out who/what is in it and the situation — summer, winter, with
                friends, with a car, in nature — and writes around that.
              </p>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 overflow-hidden text-sm text-red-500"
                >
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <Button type="submit" variant="primary" disabled={isGenerating} className="w-full">
              <Sparkles className="h-4 w-4" />
              {isGenerating ? "Generating..." : "Generate Caption"}
            </Button>
          </fieldset>
        </motion.form>

        <AnimatePresence mode="wait">
          {isGenerating && (
            <motion.div
              key="steps"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-8 rounded-2xl border border-border bg-card p-6"
            >
              <GenerationSteps steps={steps} done={phase === "done-fetching"} />
            </motion.div>
          )}

          {phase === "results" && result && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mt-8"
            >
              <ResultsCards result={result} subject={subject} />
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </div>
    </Section>
  );
}
