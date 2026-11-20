// Very small in-memory rate limiter for login and registration.
// It is best-effort only: serverless instances do not share memory, but it
// still slows down repeated password guesses on a single instance.

const attempts = new Map();

export function isRateLimited(key, limit = 10, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const entry = attempts.get(key);

  if (!entry || now > entry.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  entry.count += 1;

  // Keep the map from growing forever on a long-running server.
  if (attempts.size > 1000) {
    for (const [storedKey, stored] of attempts) {
      if (now > stored.resetAt) attempts.delete(storedKey);
    }
  }

  return entry.count > limit;
}

export function clientKey(request, action) {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "local";
  return action + ":" + ip;
}
