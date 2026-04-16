import type { PageServerLoad } from "./$types.d.ts";
import { parseAndRender } from "@ox-content/napi";
import {
  readString,
  readStringArray,
  calculateReadingTime,
  extractImagesFromMarkdown,
} from "$lib/content";
import { createClient } from "$lib/pocketbase";

export const load: PageServerLoad = async ({ params }) => {
  const pb = createClient(import.meta.env.VITE_POCKET_BASE);
  const blog = await pb.collection("blogs").getOne(params.slug);
  const content = readString(blog, "content");
  const rendered = parseAndRender(content, {
    gfm: true,
    footnotes: true,
    tables: true,
  }).html;

  const tags = readStringArray(blog, "tags");
  const readingTime = calculateReadingTime(content);
  const images = extractImagesFromMarkdown(content);

  // Fetch related posts (other posts with similar tags)
  let relatedPosts: Array<{
    id: string;
    title: string;
    link: string;
    images: string[];
  }> = [];

  if (tags.length > 0) {
    try {
      const allPosts = await pb.collection("blogs").getFullList({
        filter: `id != "${params.slug}"`,
        sort: "-created",
        limit: 10,
      });

      relatedPosts = allPosts
        .filter((post) => {
          const postTags = readStringArray(post, "tags");
          return postTags.some((tag) => tags.includes(tag));
        })
        .slice(0, 3)
        .map((post) => ({
          id: post.id,
          title: readString(post, "title"),
          link: `/blogs/${post.id}`,
          images: extractImagesFromMarkdown(readString(post, "content")),
        }));
    } catch {
      // Ignore errors fetching related posts
    }
  }

  return {
    content,
    rendered,
    blog,
    tags,
    readingTime,
    images,
    relatedPosts,
  };
};
