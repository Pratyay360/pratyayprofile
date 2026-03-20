// routes/+page.server.js
import { createClient } from "$lib/pocketbase";
import { readString, resolveMediaUrl } from "$lib/content";

/** @type {import('./$types').PageServerLoad} */
export async function load() {
  const pb = createClient(import.meta.env.VITE_POCKET_BASE);

  try {
    const records = await pb.collection("project").getFullList({
      sort: "-created",
    });

    const projects = records.map((record) => ({
      id: record.id,
      imageUrl: resolveMediaUrl(pb, record, "imageUrl", { token: null }),
      title: readString(record, "title"),
      brief: readString(record, "brief"),
      link: readString(record, "link"),
    }));

    return { projects };
  } catch (error) {
    console.error("Failed to load projects:", error);
    // Return an empty array so the page can show a fallback
    return { projects: [] };
  }
}
