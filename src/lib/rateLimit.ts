/**
 * Simple in-memory fixed-window rate limiter, per process. Good enough for a
 * single-instance deployment (e.g. Vercel hobby / small traffic); resets on
 * cold start and does not coordinate across multiple server instances. Being
 * fixed- rather than sliding-window, a client can get up to ~2x the limit by
 * timing requests across a window boundary — acceptable for its purpose here
 * (protecting a free API key's quota, not a hard security boundary).
 */

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 10;
const SWEEP_EVERY_N_CALLS = 200;

interface Bucket {
  count: number;
  windowStart: number;
}

const buckets = new Map<string, Bucket>();
let callsSinceSweep = 0;

/** Drops expired buckets periodically so `buckets` doesn't grow unbounded. */
function sweepExpiredBuckets(now: number) {
  callsSinceSweep += 1;
  if (callsSinceSweep < SWEEP_EVERY_N_CALLS) return;
  callsSinceSweep = 0;

  for (const [key, bucket] of buckets) {
    if (now - bucket.windowStart >= WINDOW_MS) {
      buckets.delete(key);
    }
  }
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterMs: number;
}

export function checkRateLimit(key: string): RateLimitResult {
  const now = Date.now();
  sweepExpiredBuckets(now);
  const bucket = buckets.get(key);

  if (!bucket || now - bucket.windowStart >= WINDOW_MS) {
    buckets.set(key, { count: 1, windowStart: now });
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - 1, retryAfterMs: 0 };
  }

  if (bucket.count >= MAX_REQUESTS_PER_WINDOW) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterMs: WINDOW_MS - (now - bucket.windowStart),
    };
  }

  bucket.count += 1;
  return {
    allowed: true,
    remaining: MAX_REQUESTS_PER_WINDOW - bucket.count,
    retryAfterMs: 0,
  };
}
