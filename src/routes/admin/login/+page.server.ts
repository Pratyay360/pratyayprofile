import { fail, redirect } from "@sveltejs/kit";
import {
  AUTH_COOKIE,
  clearAuthCookie,
  // clearPendingAuthCookie, // Not needed without OTP
  createPocketBaseClient,
  // PENDING_AUTH_COOKIE, // Not needed without OTP
  // setPendingAuthCookie, // Not needed without OTP
  setAuthCookie,
  verifyUserToken,
} from "$lib/server/admin-auth";

// Commented out - not needed without MFA check
// function extractErrorText(error: unknown): string {
//   if (error instanceof Error) return error.message.toLowerCase();
//   if (typeof error === "string") return error.toLowerCase();
//   if (error && typeof error === "object") {
//     const maybeMessage = (error as { message?: unknown }).message;
//     if (typeof maybeMessage === "string") return maybeMessage.toLowerCase();
//   }
//   return "";
// }

export const load = async ({ cookies }: { cookies: any }) => {
  const token = cookies.get(AUTH_COOKIE);
  if (!token) return {};

  const pb = await verifyUserToken(token);
  if (!pb) {
    clearAuthCookie(cookies);
    // clearPendingAuthCookie(cookies); // Not needed without OTP
    return {};
  }

  setAuthCookie(cookies, pb.authStore.token);
  throw redirect(303, "/admin");
};

export const actions = {
  login: async ({ request, cookies }: { request: any; cookies: any }) => {
    const data = await request.formData();
    const email = data.get("email");
    const password = data.get("password");

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      email.length === 0 ||
      password.length === 0
    ) {
      return fail(400, { error: "Email and password are required." });
    }

    const pb = createPocketBaseClient();
    try {
      const authData = await pb.collection("_superusers").authWithPassword(email, password);

      if (!pb.authStore.isValid || !authData || !authData.token) {
        return fail(403, { error: "Authentication failed." });
      }

      setAuthCookie(cookies, authData.token);
      throw redirect(303, "/admin");
    } catch {
      // Comment out MFA check since MFA is not used
      // const errorText = extractErrorText(error);
      // if (errorText.includes("mfa")) {
      //   return fail(400, {
      //     error: "MFA is enabled for this account. Please disable MFA first.",
      //   });
      // }

      return fail(400, {
        error: "Invalid email or password.",
      });
    }
  },

  // Commented out OTP-related actions
  // requestOtp: async ({ request, cookies }) => {
  //   const data = await request.formData();
  //   const email = data.get("email");
  //   const password = data.get("password");
  //
  //   if (
  //     typeof email !== "string" ||
  //     typeof password !== "string" ||
  //     email.length === 0 ||
  //     password.length === 0
  //   ) {
  //     return fail(400, { stage: "request" as const, error: "Email and password are required." });
  //   }
  //
  //   const pb = createPocketBaseClient();
  //   try {
  //     const passwordAuth = await pb.collection("_superusers").authWithPassword(email, password);
  //     const otpResponse = await pb.collection("_superusers").requestOTP(email);
  //     setPendingAuthCookie(cookies, passwordAuth.token);
  //     return {
  //       stage: "otp" as const,
  //       email,
  //       message: "OTP sent to your email.",
  //       otpId: otpResponse.otpId,
  //     };
  //   } catch (error) {
  //     const errorText = extractErrorText(error);
  //     if (errorText.includes("mfa")) {
  //       return fail(400, {
  //         stage: "request" as const,
  //         error:
  //           "PocketBase MFA is enabled for this account. Disable MFA for the superuser (or switch to PocketBase MFA login) before using this OTP flow.",
  //       });
  //     }
  //
  //     return fail(400, {
  //       stage: "request" as const,
  //       error: "Could not request OTP for this email.",
  //     });
  //   }
  // },
  // verifyOtp: async ({ request, cookies }) => {
  //   const data = await request.formData();
  //   const email = data.get("email");
  //   const otpId = data.get("otpId");
  //   const otp = data.get("otp");
  //   const pendingToken = cookies.get(PENDING_AUTH_COOKIE);
  //
  //   if (
  //     typeof email !== "string" ||
  //     typeof otpId !== "string" ||
  //     typeof otp !== "string" ||
  //     email.length === 0 ||
  //     otpId.length === 0 ||
  //     otp.length === 0
  //   ) {
  //     return fail(400, {
  //       stage: "otp" as const,
  //       email: typeof email === "string" ? email : "",
  //       error: "Email and OTP are required.",
  //     });
  //   }
  //
  //   if (!pendingToken) {
  //     return fail(401, {
  //       stage: "request" as const,
  //       error: "Password verification expired. Please sign in again.",
  //     });
  //   }
  //
  //   const pendingAuth = await verifyUserToken(pendingToken);
  //   if (!pendingAuth) {
  //     clearPendingAuthCookie(cookies);
  //     return fail(401, {
  //       stage: "request" as const,
  //       error: "Password verification expired. Please sign in again.",
  //     });
  //   }
  //
  //   if (pendingAuth.authStore.record?.email !== email) {
  //     clearPendingAuthCookie(cookies);
  //     return fail(401, {
  //       stage: "request" as const,
  //       error: "Password verification mismatch. Please sign in again.",
  //     });
  //   }
  //
  //   const pb = createPocketBaseClient();
  //   try {
  //     await pb.collection("_superusers").authWithOTP(otpId, otp);
  //     if (!pb.authStore.isValid || pb.authStore.record?.email !== email) {
  //       return fail(403, {
  //         stage: "otp" as const,
  //         email,
  //         error: "Authenticated account does not match the sign-in user.",
  //       });
  //     }
  //
  //     clearPendingAuthCookie(cookies);
  //     setAuthCookie(cookies, pb.authStore.token);
  //     throw redirect(303, "/admin");
  //   } catch {
  //     return fail(400, {
  //       stage: "otp" as const,
  //       email,
  //       error: "Invalid OTP or expired OTP.",
  //     });
  //   }
  // },
};
