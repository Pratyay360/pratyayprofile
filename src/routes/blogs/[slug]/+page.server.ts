import { createClient } from "$lib/pocketbase";
import { compile } from "mdsvex";
import type { PageServerLoad } from "./$types";
import { error } from "@sveltejs/kit";

const pb = createClient(import.meta.env.VITE_POCKET_BASE!);
pb.autoCancellation(false);

export const load: PageServerLoad = async ({ params }) => {
  try {
    const blog = await pb.collection("blogs").getOne(params.slug);
    const content = typeof blog.content === "string" ? blog.content : "";
    const coverImage = await pb.files.getURL(blog, blog.coverImage, { token: null });
    const compiled = await compile(content, { filename: `${params.slug}.svx` });
    const renderedContent = compiled?.code ?? "";

    return { blog, coverImage, renderedContent };
  } catch (e) {
    throw error(404, "Blog post not found" + e);
  }
};
