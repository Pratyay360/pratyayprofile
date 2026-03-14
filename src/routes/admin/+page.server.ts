import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { AUTH_COOKIE, clearAuthCookie, verifyUserToken } from "$lib/server/admin-auth";

function readText(data: FormData, key: string): string {
  const value = data.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function readOptionalFile(data: FormData, key: string): File | null {
  const value = data.get(key);
  if (!(value instanceof File) || value.size === 0) return null;
  return value;
}

async function requireAdminPocketBase(cookies: import("@sveltejs/kit").Cookies) {
  const token = cookies.get(AUTH_COOKIE);
  if (!token) {
    throw redirect(303, "/admin/login");
  }

  const pb = await verifyUserToken(token);
  if (!pb) {
    clearAuthCookie(cookies);
    throw redirect(303, "/admin/login");
  }

  return pb;
}

export const load: PageServerLoad = async ({ cookies }) => {
  const pb = await requireAdminPocketBase(cookies);

  // Helper to safely fetch collection data
  async function safeGetCollection<T>(collectionName: string): Promise<T[]> {
    try {
      return await pb.collection(collectionName).getFullList({});
    } catch (error: any) {
      console.warn(`Collection "${collectionName}" not accessible:`, error?.message || error);
      return [];
    }
  }

  async function safeGetCollectionSorted<T>(collectionName: string, sort: string): Promise<T[]> {
    try {
      return await pb.collection(collectionName).getFullList({ sort });
    } catch (error: any) {
      console.warn(`Collection "${collectionName}" not accessible:`, error?.message || error);
      return [];
    }
  }

  const [
    profiles,
    projects,
    certificates,
    skills,
    education,
    social_link,
    donation,
    blogs,
    messages,
  ] = await Promise.all([
    safeGetCollection("me"),
    safeGetCollection("project"),
    safeGetCollection("certificate"),
    safeGetCollection("skill"),
    safeGetCollection("education"),
    safeGetCollection("social_link"),
    safeGetCollection("donation"),
    safeGetCollection("blogs"),
    safeGetCollectionSorted("messages", "-created"),
  ]);

  return {
    profiles,
    projects,
    certificates,
    skills,
    education,
    social_link,
    donation,
    blogs,
    messages,
  };
};

export const actions: Actions = {
  logout: async ({ cookies }) => {
    clearAuthCookie(cookies);
    throw redirect(303, "/admin/login");
  },

  saveProfile: async ({ request, cookies }) => {
    const pb = await requireAdminPocketBase(cookies);
    const data = await request.formData();
    const id = readText(data, "id");
    const name = readText(data, "name");
    const description = readText(data, "description");
    const imageFile = readOptionalFile(data, "image");

    if (!name) {
      return fail(400, { error: "Name is required." });
    }

    const payload = new FormData();
    payload.set("name", name);
    payload.set("description", description);
    if (imageFile) payload.set("image", imageFile);

    try {
      if (id) {
        await pb.collection("me").update(id, payload);
      } else {
        await pb.collection("me").create(payload);
      }
      return { success: true };
    } catch {
      return fail(500, { error: "Could not save profile." });
    }
  },

  deleteProfile: async ({ request, cookies }) => {
    const pb = await requireAdminPocketBase(cookies);
    const data = await request.formData();
    const id = readText(data, "id");
    if (!id) return fail(400, { error: "Profile id is required." });

    try {
      await pb.collection("me").delete(id);
      return { success: true };
    } catch {
      return fail(500, { error: "Could not delete profile." });
    }
  },

  saveProject: async ({ request, cookies }) => {
    const pb = await requireAdminPocketBase(cookies);
    const data = await request.formData();
    const id = readText(data, "id");
    const title = readText(data, "title");
    const brief = readText(data, "brief");
    const link = readText(data, "link");
    const imageFile = readOptionalFile(data, "imageUrl");

    if (!title) {
      return fail(400, { error: "Project title is required." });
    }

    const payload = new FormData();
    payload.set("title", title);
    payload.set("brief", brief);
    payload.set("link", link);
    if (imageFile) payload.set("imageUrl", imageFile);

    try {
      if (id) {
        await pb.collection("project").update(id, payload);
      } else {
        await pb.collection("project").create(payload);
      }
      return { success: true };
    } catch {
      return fail(500, { error: "Could not save project." });
    }
  },

  deleteProject: async ({ request, cookies }) => {
    const pb = await requireAdminPocketBase(cookies);
    const data = await request.formData();
    const id = readText(data, "id");
    if (!id) return fail(400, { error: "Project id is required." });

    try {
      await pb.collection("project").delete(id);
      return { success: true };
    } catch {
      return fail(500, { error: "Could not delete project." });
    }
  },

  saveCertificate: async ({ request, cookies }) => {
    const pb = await requireAdminPocketBase(cookies);
    const data = await request.formData();
    const id = readText(data, "id");
    const title = readText(data, "title");
    const description = readText(data, "description");
    const date = readText(data, "date");
    const link = readText(data, "link");
    const imageFile = readOptionalFile(data, "imageSrc");

    if (!title) {
      return fail(400, { error: "Certificate title is required." });
    }

    const payload = new FormData();
    payload.set("title", title);
    payload.set("description", description);
    payload.set("date", date);
    payload.set("link", link);
    if (imageFile) payload.set("imageSrc", imageFile);

    try {
      if (id) {
        await pb.collection("certificate").update(id, payload);
      } else {
        await pb.collection("certificate").create(payload);
      }
      return { success: true };
    } catch {
      return fail(500, { error: "Could not save certificate." });
    }
  },

  deleteCertificate: async ({ request, cookies }) => {
    const pb = await requireAdminPocketBase(cookies);
    const data = await request.formData();
    const id = readText(data, "id");
    if (!id) return fail(400, { error: "Certificate id is required." });

    try {
      await pb.collection("certificate").delete(id);
      return { success: true };
    } catch {
      return fail(500, { error: "Could not delete certificate." });
    }
  },

  saveSkill: async ({ request, cookies }) => {
    const pb = await requireAdminPocketBase(cookies);
    const data = await request.formData();
    const id = readText(data, "id");
    const category = readText(data, "category");
    const itemsInput = readText(data, "items");
    const items = itemsInput
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    if (!category) {
      return fail(400, { error: "Skill category is required." });
    }

    try {
      if (id) {
        await pb.collection("skill").update(id, { category, items });
      } else {
        await pb.collection("skill").create({ category, items });
      }
      return { success: true };
    } catch {
      return fail(500, { error: "Could not save skill category." });
    }
  },

  deleteSkill: async ({ request, cookies }) => {
    const pb = await requireAdminPocketBase(cookies);
    const data = await request.formData();
    const id = readText(data, "id");
    if (!id) return fail(400, { error: "Skill id is required." });

    try {
      await pb.collection("skill").delete(id);
      return { success: true };
    } catch {
      return fail(500, { error: "Could not delete skill category." });
    }
  },

  saveEducation: async ({ request, cookies }) => {
    const pb = await requireAdminPocketBase(cookies);
    const data = await request.formData();
    const id = readText(data, "id");
    const degree = readText(data, "degree");
    const institution = readText(data, "institution");
    const period = readText(data, "period");
    const description = readText(data, "description");

    if (!degree) {
      return fail(400, { error: "Degree is required." });
    }

    try {
      if (id) {
        await pb.collection("education").update(id, { degree, institution, period, description });
      } else {
        await pb.collection("education").create({ degree, institution, period, description });
      }
      return { success: true };
    } catch {
      return fail(500, { error: "Could not save education entry." });
    }
  },

  deleteEducation: async ({ request, cookies }) => {
    const pb = await requireAdminPocketBase(cookies);
    const data = await request.formData();
    const id = readText(data, "id");
    if (!id) return fail(400, { error: "Education id is required." });

    try {
      await pb.collection("education").delete(id);
      return { success: true };
    } catch {
      return fail(500, { error: "Could not delete education entry." });
    }
  },

  saveSocial: async ({ request, cookies }) => {
    const pb = await requireAdminPocketBase(cookies);
    const data = await request.formData();
    const id = readText(data, "id");
    const name = readText(data, "name");
    const link = readText(data, "link");
    const imageFile = readOptionalFile(data, "image");

    if (!name) {
      return fail(400, { error: "Social name is required." });
    }

    const payload = new FormData();
    payload.set("name", name);
    payload.set("link", link);
    if (imageFile) payload.set("image", imageFile);

    try {
      if (id) {
        await pb.collection("social_link").update(id, payload);
      } else {
        await pb.collection("social_link").create(payload);
      }
      return { success: true };
    } catch {
      return fail(500, { error: "Could not save social link." });
    }
  },

  deleteSocial: async ({ request, cookies }) => {
    const pb = await requireAdminPocketBase(cookies);
    const data = await request.formData();
    const id = readText(data, "id");
    if (!id) return fail(400, { error: "Social id is required." });

    try {
      await pb.collection("social_link").delete(id);
      return { success: true };
    } catch {
      return fail(500, { error: "Could not delete social link." });
    }
  },

  saveDonation: async ({ request, cookies }) => {
    const pb = await requireAdminPocketBase(cookies);
    const data = await request.formData();
    const id = readText(data, "id");
    const name = readText(data, "name");
    const link = readText(data, "link");
    const imageFile = readOptionalFile(data, "image");

    if (!name) {
      return fail(400, { error: "Donation name is required." });
    }

    const payload = new FormData();
    payload.set("name", name);
    payload.set("link", link);
    if (imageFile) payload.set("image", imageFile);

    try {
      if (id) {
        await pb.collection("donation").update(id, payload);
      } else {
        await pb.collection("donation").create(payload);
      }
      return { success: true };
    } catch {
      return fail(500, { error: "Could not save donation link." });
    }
  },

  deleteDonation: async ({ request, cookies }) => {
    const pb = await requireAdminPocketBase(cookies);
    const data = await request.formData();
    const id = readText(data, "id");
    if (!id) return fail(400, { error: "Donation id is required." });

    try {
      await pb.collection("donation").delete(id);
      return { success: true };
    } catch {
      return fail(500, { error: "Could not delete donation link." });
    }
  },

  saveBlog: async ({ request, cookies }) => {
    const pb = await requireAdminPocketBase(cookies);
    const data = await request.formData();
    const id = readText(data, "id");
    const title = readText(data, "title");
    const content = readText(data, "content") || readText(data, "brief");
    const url = readText(data, "url");
    const imageFile = readOptionalFile(data, "coverImage");

    if (!title) {
      return fail(400, { error: "Blog title is required." });
    }

    function buildPayload(contentField: "content" | "brief"): FormData {
      const payload = new FormData();
      payload.set("title", title);
      payload.set(contentField, content);
      payload.set("url", url);
      if (imageFile) payload.set("coverImage", imageFile);
      return payload;
    }

    try {
      const saveWithField = async (field: "content" | "brief") => {
        const payload = buildPayload(field);
        if (id) {
          await pb.collection("blogs").update(id, payload);
        } else {
          await pb.collection("blogs").create(payload);
        }
      };

      try {
        await saveWithField("content");
      } catch {
        // Backward compatibility for existing schemas that still use "brief"
        await saveWithField("brief");
      }

      return { success: true };
    } catch (e) {
      console.error(e);
      return fail(500, { error: "Could not save blog post." });
    }
  },

  deleteBlog: async ({ request, cookies }) => {
    const pb = await requireAdminPocketBase(cookies);
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
