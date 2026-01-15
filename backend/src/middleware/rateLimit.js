const store = new Map();

/**
 * Simple in-memory rate limiter (per IP)
 * NOTE: resets on server restart (fine for assignment)
 */
export function rateLimit({ windowMs = 60_000, limit = 60 } = {}) {
  return async (c, next) => {
    try {
      const ip =
        c.req.header('x-forwarded-for')?.split(',')[0]?.trim() ||
        c.req.header('x-real-ip') ||
        'unknown';

      const now = Date.now();

      const record = store.get(ip) || { count: 0, resetAt: now + windowMs };

      if (now > record.resetAt) {
        record.count = 0;
        record.resetAt = now + windowMs;
      }

      record.count += 1;
      store.set(ip, record);

      const remaining = Math.max(0, limit - record.count);

      c.header('X-RateLimit-Limit', String(limit));
      c.header('X-RateLimit-Remaining', String(remaining));
      c.header('X-RateLimit-Reset', String(record.resetAt));

      if (record.count > limit) {
        const retryAfterSec = Math.ceil((record.resetAt - now) / 1000);

        c.header('Retry-After', String(retryAfterSec));

        return c.json(
          {
            error: 'RATE_LIMIT_EXCEEDED',
            message: `Too many requests. Try again in ${retryAfterSec}s.`,
          },
          429
        );
      }

      await next();
    } catch (err) {
      console.error('Rate limit middleware error:', err);
      await next();
    }
  };
}
