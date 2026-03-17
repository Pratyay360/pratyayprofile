import { fail, redirect } from "@sveltejs/kit";
import type {
  Actions,
  PageServerLoad,
} from "../../../../.svelte-kit/types/src/routes/admin/blogs/$types.d.ts";
import { AUTH_COOKIE, clearAuthCookie, verifyUserToken } from "../../../lib/server/admin-auth.ts";

const readText = (data: FormData, key: string): string => {
  const value = data.get(key);
  return typeof value === "string" ? value.trim() : "";
};

const readOptionalFile = (data: FormData, key: string): File | null => {
  const value = data.get(key);
  return value instanceof File && value.size > 0 ? value : null;
};

const requireAdminPocketBase = async (cookies: any) => {
  const token = cookies.get(AUTH_COOKIE);
  if (!token) throw redirect(303, "/admin/login");

  const pb = await verifyUserToken(token);
  if (!pb) {
    clearAuthCookie(cookies);
    throw redirect(303, "/admin/login");
  }
  return pb;
};

const safeGetList = async <T>(pb: any, collection: string, options = {}): Promise<T[]> => {
  try {
    return await pb.collection(collection).getFullList(options);
  } catch {
    return [];
  }
};

const createOrUpdate = (
  pb: any,
  collection: string,
  id: string | null,
  data: FormData | Record<string, any>,
) => {
  if (id) {
    return pb.collection(collection).update(id, data);
  }
  return pb.collection(collection).create(data);
};

const deleteRecord = (pb: any, collection: string, id: string) => {
  return pb.collection(collection).delete(id);
};

export const load: PageServerLoad = async ({ cookies }) => {
  const pb = await requireAdminPocketBase(cookies);
  const blogs = await safeGetList(pb, "blogs");
  return { blogs };
};

export const actions: Actions = {
  saveBlog: async ({ request, cookies }) => {
    const pb = await requireAdminPocketBase(cookies);
    const data = await request.formData();
    const title = readText(data, "title");

    if (!title) return fail(400, { error: "Blog title is required." });

    const payload = new FormData();
    payload.set("title", title);
    payload.set("content", readText(data, "content") || readText(data, "brief"));
    payload.set("url", readText(data, "url"));
    const image = readOptionalFile(data, "coverImage");
    if (image) payload.set("coverImage", image);

    try {
      await createOrUpdate(pb, "blogs", readText(data, "id") || null, payload);
      return { success: true };
    } catch {
      return fail(500, { error: "Could not save blog post." });
    }
  },

  deleteBlog: async ({ request, cookies }) => {
    const pb = await requireAdminPocketBase(cookies);
    const id = readText(await request.formData(), "id");
    if (!id) return fail(400, { error: "Blog id is required." });

    try {
      await deleteRecord(pb, "blogs", id);
      return { success: true };
    } catch {
      return fail(500, { error: "Could not delete blog post." });
    }
  },
};
