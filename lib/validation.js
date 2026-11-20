// Small helpers shared by the API routes.

export function cleanString(value) {
  return typeof value === "string" ? value.trim() : "";
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Returns a number, or null when the value is not a valid number.
export function toNumber(value) {
  if (value === "" || value === null || value === undefined) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

// Escape a user search string before using it in a regular expression.
export function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
