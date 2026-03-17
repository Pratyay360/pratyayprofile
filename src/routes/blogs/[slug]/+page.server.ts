import type { PageServerLoad } from "./$types";
import { parseAndRender } from "@ox-content/napi";
import { readString, resolveMediaUrl } from "$lib/content";
import { createClient } from "$lib/pocketbase";

export const load: PageServerLoad = async ({ params }) => {
  const pb = createClient(import.meta.env.VITE_POCKET_BASE);
  const blog = await pb.collection("blogs").getOne(params.slug);
  const coverImage = resolveMediaUrl(pb, blog, "coverImage", { token: null });
  const content = readString(blog, "content");
  const rendered = parseAndRender(content).html;

  return { coverImage, content, rendered, blog };
};
