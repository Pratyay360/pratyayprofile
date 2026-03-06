import type { Cookies } from "@sveltejs/kit";
import { dev } from "$app/environment";
import { createClient } from "$lib/pocketbase";

export const AUTH_COOKIE = "admin_auth";
export const PENDING_AUTH_COOKIE = "admin_pending_auth";

function cookieOptions(maxAge = 60 * 60 * 24 * 7) {
  return {
    path: "/",
    httpOnly: true,
    sameSite: "strict" as const,
    secure: !dev,
    maxAge,
  };
}

export function createPocketBaseClient() {
  return createClient(import.meta.env.VITE_POCKET_BASE!);
}

export async function verifyUserToken(token: string) {
  const pb = createPocketBaseClient();
  pb.authStore.save(token, null);

  try {
    await pb.collection("_superusers").authRefresh();
    if (!pb.authStore.isValid) {
      pb.authStore.clear();
      return null;
    }
    return pb;
  } catch {
    pb.authStore.clear();
    return null;
  }
}

export function setAuthCookie(cookies: Cookies, token: string) {
  cookies.set(AUTH_COOKIE, token, cookieOptions());
}

export function clearAuthCookie(cookies: Cookies) {
  cookies.delete(AUTH_COOKIE, { path: "/" });
}

export function setPendingAuthCookie(cookies: Cookies, token: string) {
  cookies.set(PENDING_AUTH_COOKIE, token, cookieOptions(60 * 5));
}

export function clearPendingAuthCookie(cookies: Cookies) {
  cookies.delete(PENDING_AUTH_COOKIE, { path: "/" });
}
