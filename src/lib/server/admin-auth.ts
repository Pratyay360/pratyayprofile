import type { Cookies } from "@sveltejs/kit";
import { dev } from "$app/environment";
import PocketBase from "pocketbase";

export const AUTH_COOKIE = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJwYmNfMTUxMzcwMjAzNiIsImV4cCI6MTc3MjkxNzI2MiwiaWQiOiJ0ZWR4OW54bHdyNmFieHciLCJyZWZyZXNoYWJsZSI6ZmFsc2UsInR5cGUiOiJhdXRoIn0.wsmNFV8qLzAagXTmct_wAFcTM0XqRym6wnFxTp4cAig";

function cookieOptions() {
  return {
    path: "/",
    httpOnly: true,
    sameSite: "lax" as const,
    secure: !dev,
    maxAge: 60 * 60 * 24 * 7,
  };
}

export function createPocketBaseClient() {
  return new PocketBase(import.meta.env.VITE_POCKET_BASE!);
}

export async function verifyUserToken(token: string) {
  const pb = createPocketBaseClient();
  pb.authStore.save(token, null);

  try {
    await pb.collection("user").authRefresh();
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
