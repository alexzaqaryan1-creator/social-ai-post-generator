# SANA — AI Social Caption Generator

A full-stack Next.js (App Router) app that turns a product name and/or an
uploaded photo into Instagram captions, hashtags, and ad copy, using a
**free** AI backend — no paid API required.

## Features

- Product name (optional) + tone selector (funny, luxury, corporate, casual,
  bold)
- Optional photo upload (PNG/JPEG/WebP, up to 5MB), drag-and-drop, described
  by a free HuggingFace image-captioning model and analyzed for subject
  (person/animal/object) and situation (season, setting, companions) to
  ground the generated captions/hashtags in what's actually shown
- Works with product name alone, photo alone, or both
- AI-generated output:
  - 5 Instagram caption variations
  - 10–20 relevant hashtags
  - 3 short + 3 long ad copy variations
- Premium landing page (hero, features, how-it-works, live demo, FAQ) plus a
  fully functional generator tool with animated generation-step progress,
  copy-to-clipboard buttons, and toast confirmations
- `/api/generate` route with input validation and in-memory per-IP rate
  limiting
- Free HuggingFace Inference API integration with an automatic rule-based
  fallback if no API key is set or a request fails

## Tech stack

- Next.js (App Router) + TypeScript
- TailwindCSS v4
- Framer Motion (animation) + Lucide (icons) + React Hook Form
- Next.js Route Handlers (`/api/generate`) as the backend — no separate server

## Project structure

```
src/
  app/
    api/generate/route.ts    # POST endpoint: validation, rate limit, AI call, fallback
    page.tsx                  # Assembles the full landing page
    layout.tsx                 # Fonts, metadata/SEO, ToastProvider
    globals.css                # Design tokens, grain texture, keyframes
    icon.png                    # Favicon (auto-picked up by Next.js)
  components/
    generator/                 # The functional tool: form, upload, steps, results
      GeneratorTool.tsx
      UploadZone.tsx
      ToneSelector.tsx
      GenerationSteps.tsx
      ResultsCards.tsx
      CopyButton.tsx
    sections/                  # Marketing/landing sections
      Hero.tsx, FloatingPreviewCards.tsx, Features.tsx, HowItWorks.tsx,
      DemoPreview.tsx, FAQ.tsx
    layout/                    # NavBar, Footer, shared nav links
    ui/                        # Button, Card, Section, Toast, CursorGlow
  lib/
    types.ts                  # Shared types (Tone, GenerateResult, ...)
    promptEngine.ts             # Prompt template + JSON parsing/validation
    fallbackGenerator.ts         # Rule-based generator (no API key needed)
    huggingface.ts               # Free HuggingFace Inference API client (text)
    imageCaption.ts               # Free HuggingFace image-to-text client
    imageAnalysis.ts               # Subject/situation detection from image caption
    rateLimit.ts                  # In-memory per-IP rate limiter
```

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. (Optional) Configure a free AI backend. Copy `.env.example` to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

   Get a free HuggingFace access token at
   https://huggingface.co/settings/tokens and set it as `HF_API_KEY`.

   **You can skip this step** — without a key (or if the free API is
   unavailable), the app automatically uses a rule-based template generator
   so it still works end-to-end.

3. Run the dev server:

   ```bash
   npm run dev
   ```

   Open http://localhost:3000.

## How generation works

1. The form posts `product` (optional), `tone`, and an optional `image` file
   as `multipart/form-data` to `POST /api/generate` (plain JSON body without
   an image is also accepted).
2. The route checks a simple in-memory per-IP rate limit (10 requests/min)
   and requires at least a product name or an image.
3. If an image was uploaded, it's sent to a free HuggingFace image-captioning
   model to get a description, then analyzed (`lib/imageAnalysis.ts`) for
   subject type and situation (season, setting, companions).
4. It builds a prompt (see `lib/promptEngine.ts`) instructing the model to
   return strict JSON with captions, hashtags, and ad copy, grounded in the
   image description when present.
5. If `HF_API_KEY` is set, it calls the free HuggingFace Inference API and
   parses/validates the JSON response.
6. If the API key is missing, a call fails, or a response can't be parsed, it
   transparently falls back to `lib/fallbackGenerator.ts`, a deterministic
   template-based generator that still uses the discovered image subject and
   situation — the UI always gets a full result.

The response includes a `source: "ai" | "fallback"` field so the UI can show
which path produced the result.

## Notes on the rate limiter

The limiter in `lib/rateLimit.ts` is a simple in-memory map keyed by client
IP. It resets on server restart/cold start and does not coordinate across
multiple serverless instances — sufficient for a demo/small-scale deployment,
but swap in Redis/Upstash for production traffic at scale.

## Deploying to Vercel

1. Push this project to a GitHub repo.
2. Import it in [Vercel](https://vercel.com/new).
3. (Optional) Add the `HF_API_KEY` environment variable in the Vercel project
   settings if you want AI-generated (rather than fallback) output.
4. Deploy — no other configuration needed.
