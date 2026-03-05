import PocketBase from "pocketbase";
import { compile } from "mdsvex";
import type { PageServerLoad } from "./$types";

const pb = new PocketBase(import.meta.env.VITE_POCKET_BASE!);
export const load: PageServerLoad = async ({ params }) => {
  const blog = await pb.collection("blogs").getOne(params.slug);
  const content = typeof blog.content === "string" ? blog.content : "";
  const coverImage = await pb.files.getURL(blog, blog.coverImage, { 'thumb': '100x250' });
  const compiled = await compile(content, { filename: `${params.slug}.svx` });

  const renderedContent = compiled?.code ?? "";

  return { blog, coverImage, renderedContent };
};
