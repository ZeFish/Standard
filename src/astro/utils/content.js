/**
 * Content Utilities
 * Ported from src/eleventy/eleventy/filter.js
 */

export function getReadingTime(text) {
    if (!text) return "";
    const wordsPerMinute = 225;
    const wordCount = text.split(/\s+/g).length;
    const minutes = Math.floor(wordCount / wordsPerMinute);

    if (minutes <= 1) return "1 minute";
    return `${minutes} minutes`;
}

export function getExcerpt(content, options = {}) {
    if (!content) return "";
    let text = String(content);

    const defaults = {
        maxWords: 50,
        maxChars: null,
        stripHtml: true,
        endWithEllipsis: true,
    };
    const config = { ...defaults, ...options };

    // Strip HTML
    if (config.stripHtml) {
        text = text.replace(/<[^>]*>/g, " ");
    }

    // Clean whitespace
    text = text.replace(/\s+/g, " ").trim();

    // Max Chars
    if (config.maxChars && text.length > config.maxChars) {
        text = text.substring(0, config.maxChars);
        if (config.endWithEllipsis) text += "…";
        return text;
    }

    // Max Words
    if (config.maxWords) {
        const words = text.split(/\s+/);
        if (words.length > config.maxWords) {
            text = words.slice(0, config.maxWords).join(" ");
            if (config.endWithEllipsis) text += "…";
        }
    }

    return text;
}

export function formatDate(date, format = "iso") {
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d)) return "";

    if (format === "iso") return d.toISOString();
    if (format === "html") return d.toISOString().split("T")[0];
    if (format === "dot") {
        const year = String(d.getFullYear()).slice(-2);
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}.${month}.${day}`;
    }
    return d.toLocaleDateString();
}
