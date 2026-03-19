import { redirect } from "@sveltejs/kit";
import {
  AUTH_COOKIE,
  clearAuthCookie,
  setAuthCookie,
  verifyUserToken,
} from "$lib/server/admin-auth";

export const load = async ({ cookies, url }) => {
  const token = cookies.get(AUTH_COOKIE);

  if (url.pathname === "/admin/login") {
    if (!token) return {};
    const pb = await verifyUserToken(token);
    if (!pb) {
      clearAuthCookie(cookies);
      return {};
    }
    setAuthCookie(cookies, pb.authStore.token);
    throw redirect(303, "/admin");
  }

  if (!token) {
    throw redirect(303, "/admin/login");
  }

  const pb = await verifyUserToken(token);
  if (!pb) {
    clearAuthCookie(cookies);
    throw redirect(303, "/admin/login");
  }

  setAuthCookie(cookies, pb.authStore.token);
  return {
    adminEmail: pb.authStore.record?.email ?? null,
  };
};
