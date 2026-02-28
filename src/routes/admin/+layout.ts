import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ url }) => {
  if (url.pathname === "/admin/login") {
    return { authorized: true };
  }
  return {
    authorized: false,
  };
};
