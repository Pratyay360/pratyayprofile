import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ url }) => {
  // Skip auth check on login page
  if (url.pathname === "/admin/login") {
    return { authorized: true };
  }

  // For all other admin routes, check authentication
  const envPass = import.meta.env.VITE_PASS ?? "";

  // In SSR context, we can't access localStorage, so we rely on the client
  // to handle the auth state. We'll pass the env password to the client.
  return {
    authorized: envPass === "", // If no password set, always authorized
    envPass,
  };
};
