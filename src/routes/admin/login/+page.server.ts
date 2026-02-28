import { fail, redirect } from "@sveltejs/kit";
import {
  AUTH_COOKIE,
  clearAuthCookie,
  createPocketBaseClient,
  setAuthCookie,
  verifyUserToken,
} from "$lib/server/admin-auth";

export const load = async ({ cookies }) => {
  const token = cookies.get(AUTH_COOKIE);
  if (!token) return {};

  const pb = await verifyUserToken(token);
  if (!pb) {
    clearAuthCookie(cookies);
    return {};
  }

  setAuthCookie(cookies, pb.authStore.token);
  throw redirect(303, "/admin");
};

export const actions = {
  requestOtp: async ({ request }) => {
    const data = await request.formData();
    const email = data.get("email");

    if (typeof email !== "string" || email.length === 0) {
      return fail(400, { stage: "request" as const, error: "Email is required." });
    }

    const pb = createPocketBaseClient();
    try {
      const otpResponse = await pb.collection("user").requestOTP(email);
      return {
        stage: "otp" as const,
        email,
        otpId: otpResponse.otpId,
        message: "OTP sent to your email.",
      };
    } catch {
      return fail(400, {
        stage: "request" as const,
        error: "Could not request OTP for this email.",
      });
    }
  },
  verifyOtp: async ({ request, cookies }) => {
    const data = await request.formData();
    const email = data.get("email");
    const otpId = data.get("otpId");
    const otp = data.get("otp");

    if (
      typeof email !== "string" ||
      typeof otpId !== "string" ||
      typeof otp !== "string" ||
      email.length === 0 ||
      otpId.length === 0 ||
      otp.length === 0
    ) {
      return fail(400, {
        stage: "otp" as const,
        email: typeof email === "string" ? email : "",
        otpId: typeof otpId === "string" ? otpId : "",
        error: "Email, OTP ID and OTP are required.",
      });
    }

    const pb = createPocketBaseClient();
    try {
      await pb.collection("user").authWithOTP(otpId, otp);

      if (!pb.authStore.isValid) {
        return fail(403, {
          stage: "otp" as const,
          email,
          otpId,
          error: "Authenticated account is not a user.",
        });
      }

      setAuthCookie(cookies, pb.authStore.token);
      throw redirect(303, "/admin");
    } catch {
      return fail(400, {
        stage: "otp" as const,
        email,
        otpId,
        error: "Invalid OTP or expired OTP.",
      });
    }
  },
};
