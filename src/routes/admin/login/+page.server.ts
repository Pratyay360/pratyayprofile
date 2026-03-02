import { fail, redirect } from "@sveltejs/kit";
import {
  AUTH_COOKIE,
  clearAuthCookie,
  clearPendingAuthCookie,
  createPocketBaseClient,
  PENDING_AUTH_COOKIE,
  setPendingAuthCookie,
  setAuthCookie,
  verifyUserToken,
} from "$lib/server/admin-auth";

export const load = async ({ cookies }) => {
  const token = cookies.get(AUTH_COOKIE);
  if (!token) return {};

  const pb = await verifyUserToken(token);
  if (!pb) {
    clearAuthCookie(cookies);
    clearPendingAuthCookie(cookies);
    return {};
  }

  setAuthCookie(cookies, pb.authStore.token);
  throw redirect(303, "/admin");
};

export const actions = {
  requestOtp: async ({ request, cookies }) => {
    const data = await request.formData();
    const email = data.get("email");
    const password = data.get("password");

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      email.length === 0 ||
      password.length === 0
    ) {
      return fail(400, { stage: "request" as const, error: "Email and password are required." });
    }

    const pb = createPocketBaseClient();
    try {
      await pb.collection("_superusers").authWithPassword(email, password);
      if (!pb.authStore.isValid) {
        return fail(403, {
          stage: "request" as const,
          error: "Invalid email or password.",
        });
      }

      const otpResponse = await pb.collection("_superusers").requestOTP(email);
      setPendingAuthCookie(cookies, pb.authStore.token);
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
    const pendingToken = cookies.get(PENDING_AUTH_COOKIE);

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

    if (!pendingToken) {
      return fail(401, {
        stage: "request" as const,
        error: "Password verification expired. Please sign in again.",
      });
    }

    const pendingAuth = await verifyUserToken(pendingToken);
    if (!pendingAuth) {
      clearPendingAuthCookie(cookies);
      return fail(401, {
        stage: "request" as const,
        error: "Password verification expired. Please sign in again.",
      });
    }

    if (pendingAuth.authStore.record?.email !== email) {
      clearPendingAuthCookie(cookies);
      return fail(401, {
        stage: "request" as const,
        error: "Password verification mismatch. Please sign in again.",
      });
    }

    const pb = createPocketBaseClient();
    try {
      await pb.collection("_superusers").authWithOTP(otpId, otp);

      if (!pb.authStore.isValid || pb.authStore.record?.email !== email) {
        return fail(403, {
          stage: "otp" as const,
          email,
          otpId,
          error: "Authenticated account does not match the sign-in user.",
        });
      }

      clearPendingAuthCookie(cookies);
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
