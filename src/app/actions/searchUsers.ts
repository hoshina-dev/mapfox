"use server";

import { usersApi } from "@/libs/apiClient";

export async function searchUsers(query: string, limit?: number) {
  try {
    const results = await usersApi.usersSearchGet(query, limit);
    return { success: true, data: results };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to search users",
      data: [],
    };
  }
}
