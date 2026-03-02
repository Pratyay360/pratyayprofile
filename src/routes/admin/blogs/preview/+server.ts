import { compile } from "mdsvex";
import { json } from "@sveltejs/kit";
import { AUTH_COOKIE, verifyUserToken } from "$lib/server/admin-auth";

export const POST = async ({ request, cookies }) => {
  const token = cookies.get(AUTH_COOKIE);
  if (!token) return json({ error: "Unauthorized" }, { status: 401 });

  const pb = await verifyUserToken(token);
  if (!pb) return json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json().catch(() => null)) as { markdown?: string } | null;
  const markdown = typeof body?.markdown === "string" ? body.markdown : "";

  try {
    const result = await compile(markdown, { filename: "admin-preview.svx" });
    return json({ html: result?.code ?? "" });
  } catch {
    return json({ html: "<p>Invalid markdown.</p>" }, { status: 400 });
  }
};
