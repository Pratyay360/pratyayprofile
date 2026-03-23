import PocketBase from "pocketbase";

export function createClient(url: string) {
  const pb = new PocketBase(url);
  const clientWithFetch = pb as PocketBase & {
    _fetch?: (url: string, options?: RequestInit) => Promise<Response>;
  };

  // @ts-ignore
  clientWithFetch._fetch = function (url: string, options?: RequestInit) {
    if (!options) {
      options = {};
    }
    if (!options.headers) {
      options.headers = {};
    }
    // Add headers to avoid Cloudflare security blocks
    const headers = options.headers as Record<string, string>;
    headers["Accept"] = "application/json";
    headers["Accept-Language"] = "en-US,en;q=0.9";

    return fetch(url, options);
  };

  return pb;
}
