import type { PageServerLoad } from "./$types";
import { resolveMediaUrl } from "$lib/content";
import { createClient } from "$lib/pocketbase";
export const load: PageServerLoad = async ({ params }) => {
  const pb = createClient(import.meta.env.VITE_POCKET_BASE);
  const blog = await pb.collection("blogs").getOne(params.slug);
  const coverImage = resolveMediaUrl(pb, blog, "coverImage", { token: null });
  const content = resolveMediaUrl(pb, blog, "content", { token: null });
  return { coverImage, content, blog };
};
