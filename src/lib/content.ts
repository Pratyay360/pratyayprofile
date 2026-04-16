import type PocketBase from "pocketbase";
import type { RecordModel } from "pocketbase";

export function readString(
  record: Record<string, unknown>,
  field: string,
): string {
  const value = record[field];
  return typeof value === "string" ? value : "";
}

export function readStringArray(
  record: Record<string, unknown>,
  field: string,
): string[] {
  const value = record[field];
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

export function resolveMediaUrl(
  pb: PocketBase,
  record: RecordModel,
  field: string,
  options?: { token?: string | null },
): string {
  const value = record[field];
  if (typeof value !== "string" || !value) return "";
  if (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("/")
  ) {
    return value;
  }
  return pb.files.getURL(record, value, options);
}

/**
 * Calculate reading time in minutes based on text content.
 * Average reading speed: 200 words per minute
 */
export function calculateReadingTime(content: string): number {
  if (!content) return 0;
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return Math.max(1, minutes);
}

/**
 * Extract image URLs from markdown content.
 * Supports both markdown syntax ![alt](url) and HTML <img> tags.
 */
export function extractImagesFromMarkdown(content: string): string[] {
  if (!content) return [];

  const images: string[] = [];

  // Match markdown image syntax: ![alt](url)
  const markdownRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  let match;
  while ((match = markdownRegex.exec(content)) !== null) {
    const url = match[2].trim();
    if (url && !url.startsWith("data:")) {
      images.push(url);
    }
  }

  // Match HTML img tags: <img src="url" ...>
  const htmlRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
  while ((match = htmlRegex.exec(content)) !== null) {
    const url = match[1].trim();
    if (url && !url.startsWith("data:")) {
      images.push(url);
    }
  }

  return [...new Set(images)]; // Remove duplicates
}
