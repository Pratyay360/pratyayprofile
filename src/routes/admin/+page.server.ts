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

  const [profiles, projects, certificates, skills, education, socials, donations] =
    await Promise.all([
      pb.collection("aboutme").getFullList({ sort: "-created" }),
      pb.collection("projects").getFullList({ sort: "-created" }),
      pb.collection("certificates").getFullList({ sort: "-created" }),
      pb.collection("skills").getFullList({ sort: "-created" }),
      pb.collection("education").getFullList({ sort: "-created" }),
      pb.collection("social").getFullList({ sort: "-created" }),
      pb.collection("donations").getFullList({ sort: "-created" }),
    ]);

  return {
    profiles,
    projects,
    certificates,
    skills,
    education,
    socials,
    donations,
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
    const title = readText(data, "title");
    const description = readText(data, "description");
    const imageFile = readOptionalFile(data, "image");

    if (!name) {
      return fail(400, { error: "Name is required." });
    }

    const payload = new FormData();
    payload.set("name", name);
    payload.set("title", title);
    payload.set("description", description);
    if (imageFile) payload.set("image", imageFile);

    try {
      if (id) {
        await pb.collection("aboutme").update(id, payload);
      } else {
        await pb.collection("aboutme").create(payload);
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
      await pb.collection("aboutme").delete(id);
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
        await pb.collection("projects").update(id, payload);
      } else {
        await pb.collection("projects").create(payload);
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
      await pb.collection("projects").delete(id);
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
        await pb.collection("certificates").update(id, payload);
      } else {
        await pb.collection("certificates").create(payload);
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
      await pb.collection("certificates").delete(id);
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
        await pb.collection("skills").update(id, { category, items });
      } else {
        await pb.collection("skills").create({ category, items });
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
      await pb.collection("skills").delete(id);
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
        await pb.collection("social").update(id, payload);
      } else {
        await pb.collection("social").create(payload);
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
      await pb.collection("social").delete(id);
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
        await pb.collection("donations").update(id, payload);
      } else {
        await pb.collection("donations").create(payload);
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
      await pb.collection("donations").delete(id);
      return { success: true };
    } catch {
      return fail(500, { error: "Could not delete donation link." });
    }
  },
};
