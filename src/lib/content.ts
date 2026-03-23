import type PocketBase from "pocketbase";
import type { RecordModel } from "pocketbase";

export function readString(record: Record<string, unknown>, field: string): string {
  const value = record[field];
  return typeof value === "string" ? value : "";
}

export function readStringArray(record: Record<string, unknown>, field: string): string[] {
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
  if (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("/")) {
    return value;
  }
  return pb.files.getURL(record, value, options);
}
