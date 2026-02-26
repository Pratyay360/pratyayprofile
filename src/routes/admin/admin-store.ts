import { writable } from "svelte/store";

export const authorized = writable(false);
export const statusMessage = writable("");
export const currentSection = writable<
  "profile" | "projects" | "certificates" | "skills" | "education" | "socials" | "donations"
>("profile");

export function setStatus(message: string): void {
  statusMessage.set(message);
}

export function setAuthorized(value: boolean): void {
  authorized.set(value);
}

export function setSection(
  section:
    | "profile"
    | "projects"
    | "certificates"
    | "skills"
    | "education"
    | "socials"
    | "donations",
): void {
  currentSection.set(section);
}
