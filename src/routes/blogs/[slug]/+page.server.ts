import { createClient } from "$lib/pocketbase";
import type { PageServerLoad } from "./$types";
import { error } from "@sveltejs/kit";

const pb = createClient(import.meta.env.VITE_POCKET_BASE!);
pb.autoCancellation(false);

export const load: PageServerLoad = async ({ params }) => {
  try {
    const blog = await pb.collection("blogs").getOne(params.slug);
    const renderedContent = blog?.content;
    const coverImage = pb.files.getURL(blog, blog?.coverImage, { token: null });
    return { blog, coverImage, renderedContent };
  } catch (e) {
    throw error(404, "Blog post not found" + e);
  }
};
