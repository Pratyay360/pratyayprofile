import type { PageServerLoad } from "./$types.d.ts";
import { parseAndRender } from "@ox-content/napi";
import { readString, resolveMediaUrl } from "$lib/content";
import { createClient } from "$lib/pocketbase";

export const load: PageServerLoad = async ({ params }) => {
  const pb = createClient(import.meta.env.VITE_POCKET_BASE);
  const blog = await pb.collection("blogs").getOne(params.slug);
  const coverImage = resolveMediaUrl(pb, blog, "coverImage", { token: null });
  const content = resolveMediaUrl(pb, blog, "content", { token: null });
  const rendered = parseAndRender(content, { gfm: true, footnotes: true, tables: true }).html;

  return { coverImage, content, rendered, blog };
};
