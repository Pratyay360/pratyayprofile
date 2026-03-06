import { createClient } from "$lib/pocketbase";
import type { PageServerLoad } from "./$types";

const pb = createClient(import.meta.env.VITE_POCKET_BASE!);

export const load: PageServerLoad = async () => {
  try {
    const posts = await pb.collection("blogs").getFullList({});
    return { posts };
  } catch {
    return { posts: [] };
  }
};
