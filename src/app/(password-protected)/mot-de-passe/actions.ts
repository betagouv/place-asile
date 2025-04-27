"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ONE_WEEK_IN_SECONDS } from "@/constants";

export async function verifyPassword(
  password: string,
  redirectTo: string
): Promise<{ success: boolean; redirectTo?: string; redirected?: boolean }> {
  try {
    const isValid = password === process.env.PAGE_PASSWORD;

    console.log("isValid", isValid);

    if (isValid) {
      // Set an authentication cookie when password is valid
      const cookieStore = await cookies();
      cookieStore.set("mot-de-passe", password, {
        httpOnly: true,
        path: "/",
        maxAge: ONE_WEEK_IN_SECONDS,
      });

      // Return success and redirectTo for client-side navigation
      return { success: true, redirectTo };
    }

    return { success: isValid };
  } catch (error) {
    console.error("Error verifying password:", error);
    return { success: false };
  }
}

// Separate function for redirection to be called after the response is processed
export async function redirectAfterPasswordVerification(
  redirectTo: string
): Promise<void> {
  redirect(redirectTo);
}
