import { redirect } from "@sveltejs/kit";
import { clearAuthCookie } from "$lib/server/admin-auth";

export const actions = {
  logout: async ({ cookies }) => {
    clearAuthCookie(cookies);
    throw redirect(303, "/admin/login");
  },
};
