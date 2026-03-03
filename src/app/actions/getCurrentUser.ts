"use server";

import { usersApi } from "@/libs/apiClient";
import { getSession } from "@/libs/dal";
import { ResponseError } from "@/libs/generated/custapi";

export async function getCurrentUser() {
  const session = await getSession();

  if (!session) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    const user = await usersApi.usersIdIdGet(session.userId);
    return { success: true, data: user };
  } catch (error) {
    if (error instanceof ResponseError) {
      const errorText = await error.response.text();
      return {
        success: false,
        error: `Failed to fetch user: ${error.response.status} - ${errorText}`,
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch user",
    };
  }
}
