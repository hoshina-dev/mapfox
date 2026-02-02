"use server";

import { organizationsApi } from "@/libs/apiClient";

export async function searchOrganizations(query: string, limit?: number) {
  try {
    const results = await organizationsApi.organizationsSearchGet(query, limit);
    return { success: true, data: results };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to search organizations",
      data: [],
    };
  }
}
