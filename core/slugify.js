export function slugify(str) {
  if (!str) return ''; // Safety check

  return String(str)   // Cast numbers to string
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // Aggressive replace
    .replace(/(^-|-$)+/g, "");   // Trim dashes
}