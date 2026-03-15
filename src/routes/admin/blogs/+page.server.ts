import { createClient } from "$lib/pocketbase";
import { fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

function readText(data: FormData, key: string): string {
  const value = data.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function readOptionalFile(data: FormData, key: string): File | null {
  const value = data.get(key);
  if (!(value instanceof File) || value.size === 0) return null;
  return value;
}

export const load: PageServerLoad = async () => {
  const pb = createClient(import.meta.env.VITE_POCKET_BASE);
  const blogs = await pb.collection("blogs").getFullList({ sort: "-created" });
  return { blogs };
};

export const actions: Actions = {
  saveBlog: async ({ request }) => {
    const pb = createClient(import.meta.env.VITE_POCKET_BASE);
    const data = await request.formData();
    const id = readText(data, "id");
    const title = readText(data, "title");
    const content = readText(data, "content");
    const imageFile = readOptionalFile(data, "coverImage");
    const author = readText(data, "author");

    if (!title) {
      return fail(400, { error: "Blog title is required." });
    }

    const payload = new FormData();
    payload.set("title", title);
    payload.set("content", content);
    payload.set("author", author);
    if (imageFile) payload.set("coverImage", imageFile);

    try {
      if (id) {
        await pb.collection("blogs").update(id, payload);
      } else {
        await pb.collection("blogs").create(payload);
      }
      return { success: true };
    } catch {
      return fail(500, { error: "Could not save blog post." });
    }
  },

  deleteBlog: async ({ request }) => {
    const pb = createClient(import.meta.env.VITE_POCKET_BASE);
    const data = await request.formData();
    const id = readText(data, "id");
    if (!id) return fail(400, { error: "Blog id is required." });

    try {
      await pb.collection("blogs").delete(id);
      return { success: true };
    } catch {
      return fail(500, { error: "Could not delete blog post." });
    }
  },
};
