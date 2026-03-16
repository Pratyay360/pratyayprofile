import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { AUTH_COOKIE, clearAuthCookie, verifyUserToken } from "$lib/server/admin-auth";

function readText(data: FormData, key: string): string {
  const value = data.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function readOptionalFile(data: FormData, key: string): File | null {
  const value = data.get(key);
  return value instanceof File && value.size > 0 ? value : null;
}

async function requireAdminPocketBase(cookies: import("@sveltejs/kit").Cookies) {
  const token = cookies.get(AUTH_COOKIE);
  if (!token) throw redirect(303, "/admin/login");

  const pb = await verifyUserToken(token);
  if (!pb) {
    clearAuthCookie(cookies);
    throw redirect(303, "/admin/login");
  }
  return pb;
}

async function safeGetList<T>(pb: any, collection: string, options = {}): Promise<T[]> {
  try {
    return await pb.collection(collection).getFullList(options);
  } catch {
    return [];
  }
}

// Generic CRUD helpers
const createOrUpdate = (
  pb: any,
  collection: string,
  id: string,
  data: FormData | Record<string, any>,
) => {
  if (id) {
    return pb.collection(collection).update(id, data);
  }
  return pb.collection(collection).create(data);
};

function deleteRecord(pb: any, collection: string, id: string) {
  return pb.collection(collection).delete(id);
}

export const load: PageServerLoad = async ({ cookies }) => {
  const pb = await requireAdminPocketBase(cookies);

  const [profiles, projects, certificates, skills, education, social_links, donation, messages] =
    await Promise.all([
      safeGetList(pb, "me"),
      safeGetList(pb, "project"),
      safeGetList(pb, "certificate"),
      safeGetList(pb, "skill"),
      safeGetList(pb, "education"),
      safeGetList(pb, "social_links"),
      safeGetList(pb, "donation"),
      safeGetList(pb, "messages", { sort: "-created" }),
    ]);

  return {
    profiles,
    projects,
    certificates,
    skills,
    education,
    social_links,
    donation,
    messages,
  };
};

export const actions: Actions = {
  logout: ({ cookies }) => {
    clearAuthCookie(cookies);
    throw redirect(303, "/admin/login");
  },

  saveProfile: async ({ request, cookies }) => {
    const pb = await requireAdminPocketBase(cookies);
    const data = await request.formData();
    const name = readText(data, "name");
    if (!name) return fail(400, { error: "Name is required." });
    const payload = new FormData();
    payload.set("name", name);
    payload.set("description", readText(data, "description"));
    const image = readOptionalFile(data, "image");
    if (image) payload.set("image", image);

    try {
      await createOrUpdate(pb, "me", readText(data, "id"), payload);
      return { success: true };
    } catch {
      return fail(500, { error: "Could not save profile." });
    }
  },

  deleteProfile: async ({ request, cookies }) => {
    const pb = await requireAdminPocketBase(cookies);
    const id = readText(await request.formData(), "id");
    if (!id) return fail(400, { error: "Profile id is required." });

    try {
      await deleteRecord(pb, "me", id);
      return { success: true };
    } catch {
      return fail(500, { error: "Could not delete profile." });
    }
  },

  saveProject: async ({ request, cookies }) => {
    const pb = await requireAdminPocketBase(cookies);
    const data = await request.formData();
    const title = readText(data, "title");

    if (!title) return fail(400, { error: "Project title is required." });

    const payload = new FormData();
    payload.set("title", title);
    payload.set("brief", readText(data, "brief"));
    payload.set("link", readText(data, "link"));
    const image = readOptionalFile(data, "imageUrl");
    if (image) payload.set("imageUrl", image);

    try {
      await createOrUpdate(pb, "project", readText(data, "id"), payload);
      return { success: true };
    } catch {
      return fail(500, { error: "Could not save project." });
    }
  },

  deleteProject: async ({ request, cookies }) => {
    const pb = await requireAdminPocketBase(cookies);
    const id = readText(await request.formData(), "id");
    if (!id) return fail(400, { error: "Project id is required." });

    try {
      await deleteRecord(pb, "project", id);
      return { success: true };
    } catch {
      return fail(500, { error: "Could not delete project." });
    }
  },

  saveCertificate: async ({ request, cookies }) => {
    const pb = await requireAdminPocketBase(cookies);
    const data = await request.formData();
    const title = readText(data, "title");

    if (!title) return fail(400, { error: "Certificate title is required." });

    const payload = new FormData();
    payload.set("title", title);
    payload.set("description", readText(data, "description"));
    payload.set("date", readText(data, "date"));
    payload.set("link", readText(data, "link"));
    const image = readOptionalFile(data, "imageSrc");
    if (image) payload.set("imageSrc", image);

    try {
      await createOrUpdate(pb, "certificate", readText(data, "id"), payload);
      return { success: true };
    } catch {
      return fail(500, { error: "Could not save certificate." });
    }
  },

  deleteCertificate: async ({ request, cookies }) => {
    const pb = await requireAdminPocketBase(cookies);
    const id = readText(await request.formData(), "id");
    if (!id) return fail(400, { error: "Certificate id is required." });

    try {
      await deleteRecord(pb, "certificate", id);
      return { success: true };
    } catch {
      return fail(500, { error: "Could not delete certificate." });
    }
  },

  saveSkill: async ({ request, cookies }) => {
    const pb = await requireAdminPocketBase(cookies);
    const data = await request.formData();
    const category = readText(data, "category");

    if (!category) return fail(400, { error: "Skill category is required." });

    const items = readText(data, "items")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    try {
      await createOrUpdate(pb, "skill", readText(data, "id"), { category, items });
      return { success: true };
    } catch {
      return fail(500, { error: "Could not save skill category." });
    }
  },

  deleteSkill: async ({ request, cookies }) => {
    const pb = await requireAdminPocketBase(cookies);
    const id = readText(await request.formData(), "id");
    if (!id) return fail(400, { error: "Skill id is required." });

    try {
      await deleteRecord(pb, "skill", id);
      return { success: true };
    } catch {
      return fail(500, { error: "Could not delete skill category." });
    }
  },

  saveEducation: async ({ request, cookies }) => {
    const pb = await requireAdminPocketBase(cookies);
    const data = await request.formData();
    const degree = readText(data, "degree");

    if (!degree) return fail(400, { error: "Degree is required." });

    const payload = {
      degree,
      institution: readText(data, "institution"),
      period: readText(data, "period"),
      description: readText(data, "description"),
    };

    try {
      await createOrUpdate(pb, "education", readText(data, "id"), payload);
      return { success: true };
    } catch {
      return fail(500, { error: "Could not save education entry." });
    }
  },

  deleteEducation: async ({ request, cookies }) => {
    const pb = await requireAdminPocketBase(cookies);
    const id = readText(await request.formData(), "id");
    if (!id) return fail(400, { error: "Education id is required." });

    try {
      await deleteRecord(pb, "education", id);
      return { success: true };
    } catch {
      return fail(500, { error: "Could not delete education entry." });
    }
  },

  saveSocial: async ({ request, cookies }) => {
    const pb = await requireAdminPocketBase(cookies);
    const data = await request.formData();
    const name = readText(data, "name");

    if (!name) return fail(400, { error: "Social name is required." });

    const payload = new FormData();
    payload.set("name", name);
    payload.set("link", readText(data, "link"));
    const image = readOptionalFile(data, "image");
    if (image) payload.set("image", image);

    try {
      await createOrUpdate(pb, "social_links", readText(data, "id"), payload);
      return { success: true };
    } catch {
      return fail(500, { error: "Could not save social link." });
    }
  },

  deleteSocial: async ({ request, cookies }) => {
    const pb = await requireAdminPocketBase(cookies);
    const id = readText(await request.formData(), "id");
    if (!id) return fail(400, { error: "Social id is required." });

    try {
      await deleteRecord(pb, "social_links", id);
      return { success: true };
    } catch {
      return fail(500, { error: "Could not delete social link." });
    }
  },

  saveDonation: async ({ request, cookies }) => {
    const pb = await requireAdminPocketBase(cookies);
    const data = await request.formData();
    const name = readText(data, "name");

    if (!name) return fail(400, { error: "Donation name is required." });

    const payload = new FormData();
    payload.set("name", name);
    payload.set("link", readText(data, "link"));
    const image = readOptionalFile(data, "image");
    if (image) payload.set("image", image);

    try {
      await createOrUpdate(pb, "donation", readText(data, "id"), payload);
      return { success: true };
    } catch {
      return fail(500, { error: "Could not save donation link." });
    }
  },

  deleteDonation: async ({ request, cookies }) => {
    const pb = await requireAdminPocketBase(cookies);
    const id = readText(await request.formData(), "id");
    if (!id) return fail(400, { error: "Donation id is required." });

    try {
      await deleteRecord(pb, "donation", id);
      return { success: true };
    } catch {
      return fail(500, { error: "Could not delete donation link." });
    }
  },

  deleteMessage: async ({ request, cookies }) => {
    const pb = await requireAdminPocketBase(cookies);
    const id = readText(await request.formData(), "id");
    if (!id) return fail(400, { error: "Message id is required." });

    try {
      await deleteRecord(pb, "messages", id);
      return { success: true };
    } catch {
      return fail(500, { error: "Could not delete message." });
    }
  },
};
